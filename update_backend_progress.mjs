import fs from 'fs';

// 1. Update activeRecallController.js
const arcPath = 'd:/Documents/Projects/MyProjects/Capiword/backend/src/controllers/activeRecallController.js';
let arc = fs.readFileSync(arcPath, 'utf8');

// Replace completeSubtopic to also mark words as 'mastered' in user_progress
const oldCompleteSubtopic = `/**
 * POST /api/active-recall/complete-subtopic
 * Đánh dấu hoàn thành Subtopic và cập nhật tiến độ
 */
exports.completeSubtopic = async (req, res) => {
    try {
        const userId = req.user.id;
        const { deckId, subtopicKey } = req.body;

        if (!deckId || !subtopicKey) {
            return res.status(400).json({ success: false, message: 'Missing deckId or subtopicKey' });
        }

        // Lấy tiến độ hiện tại
        const [rows] = await db.query(
            'SELECT * FROM user_active_recall_progress WHERE user_id = ? AND deck_id = ?',
            [userId, deckId]
        );

        let completed = [];
        if (rows.length > 0 && rows[0].completed_subtopics) {
            try {
                completed = JSON.parse(rows[0].completed_subtopics);
            } catch (e) {
                completed = [];
            }
        }

        if (!completed.includes(subtopicKey)) {
            completed.push(subtopicKey);
        }

        await db.query(\`
            INSERT INTO user_active_recall_progress (user_id, deck_id, completed_subtopics)
            VALUES (?, ?, ?)
            ON DUPLICATE KEY UPDATE
                completed_subtopics = VALUES(completed_subtopics),
                updated_at = CURRENT_TIMESTAMP
        \`, [userId, deckId, JSON.stringify(completed)]);

        return res.json({
            success: true,
            completed_subtopics: completed
        });
    } catch (err) {
        console.error('[ActiveRecall] Error completeSubtopic:', err);
        return res.status(500).json({ success: false, message: err.message });
    }
};`;

const newCompleteSubtopic = `/**
 * POST /api/active-recall/complete-subtopic
 * Đánh dấu hoàn thành Subtopic và cập nhật tiến độ vào user_active_recall_progress & user_progress (mastered)
 */
exports.completeSubtopic = async (req, res) => {
    try {
        const userId = req.user.id;
        const { deckId, subtopicKey, wordIds } = req.body;

        if (!deckId || !subtopicKey) {
            return res.status(400).json({ success: false, message: 'Missing deckId or subtopicKey' });
        }

        // 1. Cập nhật user_active_recall_progress
        const [rows] = await db.query(
            'SELECT * FROM user_active_recall_progress WHERE user_id = ? AND deck_id = ?',
            [userId, deckId]
        );

        let completed = [];
        if (rows.length > 0 && rows[0].completed_subtopics) {
            try {
                completed = JSON.parse(rows[0].completed_subtopics);
            } catch (e) {
                completed = [];
            }
        }

        if (!completed.includes(subtopicKey)) {
            completed.push(subtopicKey);
        }

        await db.query(\`
            INSERT INTO user_active_recall_progress (user_id, deck_id, completed_subtopics, current_step)
            VALUES (?, ?, ?, 0)
            ON DUPLICATE KEY UPDATE
                completed_subtopics = VALUES(completed_subtopics),
                current_step = 0,
                updated_at = CURRENT_TIMESTAMP
        \`, [userId, deckId, JSON.stringify(completed)]);

        // 2. Tự động lấy wordIds nếu phía client chưa gửi lên
        let targetWordIds = Array.isArray(wordIds) ? wordIds.map(Number).filter(Boolean) : [];
        if (targetWordIds.length === 0) {
            const [kgRows] = await db.query(
                'SELECT topics_data FROM deck_knowledge_graphs WHERE deck_id = ?',
                [deckId]
            );
            if (kgRows.length > 0 && kgRows[0].topics_data) {
                try {
                    const topics = JSON.parse(kgRows[0].topics_data);
                    for (const t of topics) {
                        for (const s of t.subtopics || []) {
                            if (s.key === subtopicKey) {
                                targetWordIds = (s.words || []).map(w => w.id).filter(Boolean);
                                break;
                            }
                        }
                        if (targetWordIds.length > 0) break;
                    }
                } catch (e) {}
            }
        }

        // 3. ĐỒNG BỘ TRẠNG THÁI: Cập nhật các từ vựng này thành 'mastered' trong user_progress
        for (const cardId of targetWordIds) {
            await db.query(\`
                INSERT INTO user_progress (user_id, flashcard_id, status, is_starred, star, score_mc, score_writing, score_listening, consecutive_correct, updated_at)
                VALUES (?, ?, 'mastered', 1, 1, 2, 2, 2, 3, CURRENT_TIMESTAMP)
                ON DUPLICATE KEY UPDATE
                    status = 'mastered',
                    is_starred = 1,
                    star = 1,
                    score_mc = 2,
                    score_writing = 2,
                    score_listening = 2,
                    consecutive_correct = GREATEST(consecutive_correct, 3),
                    updated_at = CURRENT_TIMESTAMP
            \`, [userId, cardId]).catch(e => console.warn('[completeSubtopic] user_progress update err:', e.message));
        }

        return res.json({
            success: true,
            completed_subtopics: completed,
            mastered_words: targetWordIds
        });
    } catch (err) {
        console.error('[ActiveRecall] Error completeSubtopic:', err);
        return res.status(500).json({ success: false, message: err.message });
    }
};

/**
 * POST /api/active-recall/save-state
 * Lưu trạng thái đang học dở dang (để F5 khôi phục chính xác) & cập nhật thẻ thành 'learning'
 */
exports.saveStudyState = async (req, res) => {
    try {
        const userId = req.user.id;
        const { deckId, subtopicKey, stepIndex, wordIds } = req.body;

        if (!deckId || !subtopicKey) {
            return res.status(400).json({ success: false, message: 'Missing parameters' });
        }

        // 1. Lưu bước đang học dở vào user_active_recall_progress
        await db.query(\`
            INSERT INTO user_active_recall_progress (user_id, deck_id, current_step)
            VALUES (?, ?, ?)
            ON DUPLICATE KEY UPDATE
                current_step = VALUES(current_step),
                updated_at = CURRENT_TIMESTAMP
        \`, [userId, deckId, stepIndex || 0]);

        // 2. Cập nhật các từ đang học dở thành 'learning' trong user_progress (nếu chưa mastered)
        if (Array.isArray(wordIds) && wordIds.length > 0) {
            for (const cardId of wordIds) {
                await db.query(\`
                    INSERT INTO user_progress (user_id, flashcard_id, status, score_mc, updated_at)
                    VALUES (?, ?, 'learning', 1, CURRENT_TIMESTAMP)
                    ON DUPLICATE KEY UPDATE
                        status = CASE WHEN status = 'mastered' THEN 'mastered' ELSE 'learning' END,
                        updated_at = CURRENT_TIMESTAMP
                \`, [userId, cardId]).catch(() => {});
            }
        }

        return res.json({ success: true, saved_step: stepIndex });
    } catch (err) {
        console.error('[ActiveRecall] Error saveStudyState:', err);
        return res.status(500).json({ success: false, message: err.message });
    }
};`;

if (arc.includes(oldCompleteSubtopic)) {
    arc = arc.replace(oldCompleteSubtopic, newCompleteSubtopic);
    fs.writeFileSync(arcPath, arc, 'utf8');
    console.log('activeRecallController.js updated completeSubtopic & added saveStudyState!');
} else {
    console.log('oldCompleteSubtopic not matched in activeRecallController.js');
}

// 2. Update activeRecall.js route file to export save-state route
const routerPath = 'd:/Documents/Projects/MyProjects/Capiword/backend/src/routes/activeRecall.js';
let routerContent = fs.readFileSync(routerPath, 'utf8');

if (!routerContent.includes('/save-state')) {
    routerContent = routerContent.replace(
        "router.post('/complete-subtopic', authMiddleware, activeRecallController.completeSubtopic);",
        "router.post('/complete-subtopic', authMiddleware, activeRecallController.completeSubtopic);\nrouter.post('/save-state', authMiddleware, activeRecallController.saveStudyState);"
    );
    fs.writeFileSync(routerPath, routerContent, 'utf8');
    console.log('activeRecall.js router updated with /save-state route!');
}
