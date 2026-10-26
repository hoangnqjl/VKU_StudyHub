import fs from 'fs';

const msrPath = 'd:/Documents/Projects/MyProjects/Capiword/frontend/src/pages/Study/ActiveRecallMode/MicroStepRunner.jsx';
let content = fs.readFileSync(msrPath, 'utf8');

// 1. Update ttsTimer step numbers in useEffect
const oldTtsSteps = `            if (stepIndex === 0 && wordA?.term) {
                // Bước 1: Phát âm từ A
                playTTS(wordA.term, langA);
            } else if (stepIndex === 1) {
                // Bước 2: Tự động đọc cả câu ví dụ A
                const sentA = (wordA?.nhip_1_intro?.example_target_lang || wordA?.nhip_1_intro?.example_en || getPronounceableSentence(wordA?.nhip_2_cloze?.sentence_with_blank, wordA?.term)).replace(/<[^>]*>/g, '').trim();
                if (sentA) playTTS(sentA, langA);
            } else if (stepIndex === 2) {
                // Bước 3: Tự động đọc cả câu vận dụng A
                const recallSentA = getPronounceableSentence(wordA?.nhip_3_recall?.new_sentence_with_blank, wordA?.term);
                if (recallSentA) playTTS(recallSentA, langA);
            } else if (stepIndex === 3 && wordB?.term) {
                // Bước 4: Phát âm từ B
                playTTS(wordB.term, langB);
            } else if (stepIndex === 4) {
                // Bước 5: Tự động đọc cả câu ví dụ B
                const sentB = (wordB?.nhip_1_intro?.example_target_lang || wordB?.nhip_1_intro?.example_en || getPronounceableSentence(wordB?.nhip_2_cloze?.sentence_with_blank, wordB?.term)).replace(/<[^>]*>/g, '').trim();
                if (sentB) playTTS(sentB, langB);
            } else if (stepIndex === 5) {
                // Bước 6: Tự động đọc cả câu vận dụng B
                const recallSentB = getPronounceableSentence(wordB?.nhip_3_recall?.new_sentence_with_blank, wordB?.term);
                if (recallSentB) playTTS(recallSentB, langB);
            } else if (stepIndex === 6) {
                // Bước 7: Tự động đọc cả câu ghép lớn Combo
                const comboSent = getPronounceableSentence(combo?.sentence_with_blanks, wordA?.term, wordB?.term);
                if (comboSent) playTTS(comboSent, langA);
            }`;

const newTtsSteps = `            if (stepIndex === 0 && wordA?.term) {
                playTTS(wordA.term, langA);
            } else if (stepIndex === 1) {
                const sentA = (wordA?.nhip_1_intro?.example_target_lang || wordA?.nhip_1_intro?.example_en || getPronounceableSentence(wordA?.nhip_2_cloze?.sentence_with_blank, wordA?.term)).replace(/<[^>]*>/g, '').trim();
                if (sentA) playTTS(sentA, langA);
            } else if (stepIndex === 2) {
                const recallSentA = getPronounceableSentence(wordA?.nhip_3_recall?.new_sentence_with_blank, wordA?.term);
                if (recallSentA) playTTS(recallSentA, langA);
            } else if (stepIndex === 5 && wordB?.term) {
                playTTS(wordB.term, langB);
            } else if (stepIndex === 6) {
                const sentB = (wordB?.nhip_1_intro?.example_target_lang || wordB?.nhip_1_intro?.example_en || getPronounceableSentence(wordB?.nhip_2_cloze?.sentence_with_blank, wordB?.term)).replace(/<[^>]*>/g, '').trim();
                if (sentB) playTTS(sentB, langB);
            } else if (stepIndex === 7) {
                const recallSentB = getPronounceableSentence(wordB?.nhip_3_recall?.new_sentence_with_blank, wordB?.term);
                if (recallSentB) playTTS(recallSentB, langB);
            } else if (stepIndex === 10) {
                const comboSent = getPronounceableSentence(combo?.sentence_with_blanks, wordA?.term, wordB?.term);
                if (comboSent) playTTS(comboSent, langA);
            }`;

content = content.replace(oldTtsSteps, newTtsSteps);

// 2. Update keyboard listener for Flashcards: Step 0 and Step 5 (previously 0 and 3)
content = content.replace(
    'if (!isSpellingPhase && (stepIndex === 0 || stepIndex === 3)) {',
    'if (!isSpellingPhase && (stepIndex === 0 || stepIndex === 5)) {'
);
content = content.replace(
    'const currentWord = stepIndex === 0 ? wordA : wordB;',
    'const currentWord = stepIndex === 0 ? wordA : wordB;'
);
content = content.replace(
    'const currentLang = stepIndex === 0 ? langA : langB;',
    'const currentLang = stepIndex === 0 ? langA : langB;'
);

// 3. Update onStepChange to report stepIndex + 1 and totalSteps = 11
content = content.replace(
    'onStepChange?.(stepIndex + 1);',
    'onStepChange?.(stepIndex + 1, 11, score);'
);

// 4. Update Combo submit to award +3 points and check retry queue
const oldComboSuccess = `        if (isSlot1Correct && isSlot2Correct) {
            setFeedback({
                type: 'success',
                message: 'Xuất sắc! Bạn đã ghép cặp hoàn hảo cả 2 từ theo đúng ngữ pháp!'
            });
            setTimeout(() => {
                if (onCompleteSubtopic) onCompleteSubtopic(subtopic?.key);
            }, 1200);
            return;
        }`;

const newComboSuccess = `        if (isSlot1Correct && isSlot2Correct) {
            addScore(3);
            setFeedback({
                type: 'success',
                message: 'Xuất sắc! Bạn đã ghép cặp hoàn hảo cả 2 từ theo đúng ngữ pháp! (+3 Điểm)'
            });
            setTimeout(() => {
                if (mistakesList.length > 0) {
                    setIsReviewingMistakes(true);
                    setReviewIndex(0);
                } else {
                    setShowSummaryModal(true);
                    if (onCompleteSubtopic) onCompleteSubtopic(subtopic?.key);
                }
            }, 1200);
            return;
        }`;

content = content.replace(oldComboSuccess, newComboSuccess);

fs.writeFileSync(msrPath, content, 'utf8');
console.log('MicroStepRunner.jsx part 2 updated successfully!');
