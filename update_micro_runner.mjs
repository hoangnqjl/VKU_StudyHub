import fs from 'fs';

const msrPath = 'd:/Documents/Projects/MyProjects/Capiword/frontend/src/pages/Study/ActiveRecallMode/MicroStepRunner.jsx';
let content = fs.readFileSync(msrPath, 'utf8');

// 1. Add imports for PronunciationStep, ListeningStep, Trophy, Mic, Headphones
const oldImports = `import InteractiveSentence from './InteractiveSentence';
import ScrambledWordPicker from './ScrambledWordPicker';
import TapAnimate from '../../../components/ui/TapAnimate';`;

const newImports = `import InteractiveSentence from './InteractiveSentence';
import ScrambledWordPicker from './ScrambledWordPicker';
import PronunciationStep from './PronunciationStep';
import ListeningStep from './ListeningStep';
import TapAnimate from '../../../components/ui/TapAnimate';
import { Trophy, Headphones, Mic, Award } from 'lucide-react';`;

content = content.replace(oldImports, newImports);

// 2. Add Score & Mistakes state inside MicroStepRunner component
const oldStateDeclaration = `    const [stepIndex, setStepIndex] = useState(0);
    const [isSpellingPhase, setIsSpellingPhase] = useState(false); // Toggle between Flashcard view & Spelling view
    const [isCardFlipped, setIsCardFlipped] = useState(false);`;

const newStateDeclaration = `    const [stepIndex, setStepIndex] = useState(0);
    const [isSpellingPhase, setIsSpellingPhase] = useState(false);
    const [isCardFlipped, setIsCardFlipped] = useState(false);

    // Score & Mistakes State
    const [score, setScore] = useState(0);
    const [scoreDelta, setScoreDelta] = useState(null); // { pts: 1|2|3, key: timestamp }
    const [mistakesList, setMistakesList] = useState([]); // Array of { stepIdx, label, word, type }
    const [isReviewingMistakes, setIsReviewingMistakes] = useState(false);
    const [reviewIndex, setReviewIndex] = useState(0);
    const [showSummaryModal, setShowSummaryModal] = useState(false);

    const addScore = (points) => {
        if (!points || points <= 0) return;
        setScore(prev => prev + points);
        setScoreDelta({ pts: points, key: Date.now() });
        setTimeout(() => setScoreDelta(null), 1800);
    };

    const recordMistake = (mistakeInfo) => {
        setMistakesList(prev => {
            const exists = prev.some(m => m.stepIdx === stepIndex);
            if (exists) return prev;
            return [...prev, { ...mistakeInfo, stepIdx: stepIndex }];
        });
    };`;

content = content.replace(oldStateDeclaration, newStateDeclaration);

// 3. Update stepLabels to 11 steps
const oldStepLabels = `    const stepLabels = [
        \`Chinh phục Từ A: \${wordA?.term} (\${isSpellingPhase ? 'Ghép từ đơn' : 'Xem Thẻ Flashcard'})\`,
        \`Chinh phục Từ A: \${wordA?.term} (Bước 2: Điền từ vào câu ngắn)\`,
        \`Chinh phục Từ A: \${wordA?.term} (Bước 3: Vận dụng câu mới)\`,
        \`Chinh phục Từ B: \${wordB?.term} (\${isSpellingPhase ? 'Ghép từ đơn' : 'Xem Thẻ Flashcard'})\`,
        \`Chinh phục Từ B: \${wordB?.term} (Bước 2: Điền từ vào câu ngắn)\`,
        \`Chinh phục Từ B: \${wordB?.term} (Bước 3: Vận dụng câu mới)\`,
        \`Ghép cặp Ngữ cảnh (Combo: \${wordA?.term} + \${wordB?.term})\`
    ];`;

const newStepLabels = `    const stepLabels = [
        \`Từ A: \${wordA?.term} (Nhịp 1: Flashcard & Ghép chữ • +1đ)\`,
        \`Từ A: \${wordA?.term} (Nhịp 2: Điền từ cơ bản • +2đ)\`,
        \`Từ A: \${wordA?.term} (Nhịp 3: Ngữ cảnh mới • +2đ)\`,
        \`Từ A: \${wordA?.term} (Nhịp 4: Nghe lại & Điền từ • +2đ)\`,
        \`Từ A: \${wordA?.term} (Nhịp 5: Luyện phát âm • +1~3đ)\`,
        \`Từ B: \${wordB?.term} (Nhịp 1: Flashcard & Ghép chữ • +1đ)\`,
        \`Từ B: \${wordB?.term} (Nhịp 2: Điền từ cơ bản • +2đ)\`,
        \`Từ B: \${wordB?.term} (Nhịp 3: Ngữ cảnh mới • +2đ)\`,
        \`Từ B: \${wordB?.term} (Nhịp 4: Nghe lại & Điền từ • +2đ)\`,
        \`Từ B: \${wordB?.term} (Nhịp 5: Luyện phát âm • +1~3đ)\`,
        \`Ghép cặp Ngữ cảnh (Combo: \${wordA?.term} + \${wordB?.term} • +3đ)\`
    ];`;

content = content.replace(oldStepLabels, newStepLabels);

// Write back
fs.writeFileSync(msrPath, content, 'utf8');
console.log('MicroStepRunner.jsx part 1 updated!');
