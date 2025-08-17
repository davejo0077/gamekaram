// Word Wizard - Magical Spelling Adventure!
class WordWizard {
    constructor(container) {
        this.container = container;
        this.level = 1;
        this.score = 0;
        this.lives = 3;
        this.magic = 100;
        this.currentWord = null;
        this.currentLetters = [];
        this.guessedLetters = [];
        this.correctSpelling = '';
        this.wordsCompleted = 0;
        this.streak = 0;
        
        // Word lists by difficulty
        this.wordLists = {
            easy: ['cat', 'dog', 'sun', 'run', 'big', 'red', 'fun', 'top', 'box', 'egg', 'hat', 'pig', 'cup', 'bus'],
            medium: ['apple', 'happy', 'house', 'water', 'green', 'light', 'place', 'right', 'small', 'world', 'three', 'great', 'where', 'think'],
            hard: ['because', 'through', 'before', 'around', 'another', 'without', 'between', 'against', 'nothing', 'someone', 'important', 'different', 'beautiful', 'wonderful']
        };
        
        this.magicEffects = ['✨', '🌟', '⭐', '💫', '🔮', '🪄', '✴️', '🌠'];
        this.wizardMoods = ['🧙‍♂️', '🧙‍♀️', '🎩', '🔮', '📚', '⚡', '🌟', '✨'];
        
        this.init();
    }

    init() {
        this.createGameInterface();
        this.selectNewWord();
    }

    createGameInterface() {
        this.container.innerHTML = `
            <div class="word-wizard-game">
                <div class="magic-background">
                    <div class="floating-stars"></div>
                    <div class="magic-sparkles"></div>
                </div>
                
                <div class="wizard-hud">
                    <div class="hud-section">
                        <div class="stat-crystal">
                            <span class="crystal-label">📊 Level</span>
                            <span class="crystal-value" id="word-level">${this.level}</span>
                        </div>
                        <div class="stat-crystal">
                            <span class="crystal-label">⭐ Score</span>
                            <span class="crystal-value" id="word-score">${this.score}</span>
                        </div>
                    </div>
                    
                    <div class="wizard-center">
                        <div class="wizard-avatar" id="wizardAvatar">🧙‍♂️</div>
                        <div class="wizard-speech" id="wizardSpeech">
                            Ready to cast spelling spells? ✨
                        </div>
                    </div>
                    
                    <div class="hud-section">
                        <div class="stat-crystal">
                            <span class="crystal-label">❤️ Lives</span>
                            <span class="crystal-value" id="word-lives">${this.lives}</span>
                        </div>
                        <div class="magic-meter">
                            <span class="crystal-label">🔮 Magic</span>
                            <div class="magic-bar">
                                <div class="magic-fill" id="magicFill" style="width: ${this.magic}%"></div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="spell-book">
                    <div class="book-header">
                        <h3>📖 Spell Book</h3>
                        <div class="difficulty-indicator" id="difficultyIndicator">
                            ⭐ Easy Words
                        </div>
                    </div>
                    
                    <div class="word-display">
                        <div class="word-image" id="wordImage">
                            <div class="image-placeholder">🎯</div>
                        </div>
                        <div class="word-hint" id="wordHint">
                            Listen carefully and spell the word!
                        </div>
                        <div class="word-pronunciation" id="wordPronunciation">
                            Click the 🔊 to hear the word
                        </div>
                    </div>
                    
                    <div class="spelling-area">
                        <div class="letter-slots" id="letterSlots">
                            <!-- Letter slots will be generated -->
                        </div>
                        <div class="current-word" id="currentWord">
                            <!-- Current spelling attempt -->
                        </div>
                    </div>
                    
                    <div class="alphabet-board" id="alphabetBoard">
                        ${this.generateAlphabetHTML()}
                    </div>
                    
                    <div class="word-controls">
                        <button class="magic-btn" id="hearWordBtn" onclick="this.hearWord()">
                            🔊 Hear Word
                        </button>
                        <button class="magic-btn secondary" id="hintBtn" onclick="this.getHint()">
                            💡 Hint
                        </button>
                        <button class="magic-btn" id="submitBtn" onclick="this.submitSpelling()">
                            ✨ Cast Spell
                        </button>
                        <button class="magic-btn danger" id="clearBtn" onclick="this.clearSpelling()">
                            🗑️ Clear
                        </button>
                    </div>
                </div>
                
                <div class="achievements-display" id="achievementsDisplay"></div>
                
                <div class="progress-section">
                    <div class="level-progress">
                        <span>Words to next level: ${5 - this.wordsCompleted}/5</span>
                        <div class="progress-bar">
                            <div class="progress-fill" id="progressFill" style="width: ${(this.wordsCompleted / 5) * 100}%"></div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        this.addGameStyles();
        this.setupEventListeners();
        this.createMagicEffects();
    }

    addGameStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .word-wizard-game {
                position: relative;
                min-height: 700px;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #8e44ad 100%);
                border-radius: 15px;
                overflow: hidden;
                color: white;
                font-family: 'Nunito', sans-serif;
            }
            
            .magic-background {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                z-index: 1;
            }
            
            .floating-stars {
                position: absolute;
                width: 100%;
                height: 100%;
                background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text x="10" y="20" font-size="8">✨</text><text x="70" y="40" font-size="6">⭐</text><text x="30" y="70" font-size="7">🌟</text><text x="80" y="80" font-size="5">💫</text></svg>') repeat;
                animation: floatStars 15s linear infinite;
                opacity: 0.7;
            }
            
            @keyframes floatStars {
                from { transform: translateY(0); }
                to { transform: translateY(-100px); }
            }
            
            .magic-sparkles {
                position: absolute;
                width: 100%;
                height: 100%;
                pointer-events: none;
                z-index: 2;
            }
            
            .sparkle {
                position: absolute;
                font-size: 1.5rem;
                animation: sparkleFloat 4s ease-in-out infinite;
                pointer-events: none;
            }
            
            @keyframes sparkleFloat {
                0%, 100% { opacity: 0; transform: translateY(20px) scale(0.5); }
                50% { opacity: 1; transform: translateY(-20px) scale(1); }
            }
            
            .wizard-hud {
                position: relative;
                z-index: 10;
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 20px;
                background: rgba(0, 0, 0, 0.2);
                backdrop-filter: blur(10px);
            }
            
            .hud-section {
                display: flex;
                flex-direction: column;
                gap: 10px;
            }
            
            .stat-crystal {
                display: flex;
                flex-direction: column;
                align-items: center;
                background: linear-gradient(45deg, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.1));
                padding: 10px 15px;
                border-radius: 15px;
                backdrop-filter: blur(5px);
                border: 2px solid rgba(255, 255, 255, 0.3);
                box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
            }
            
            .crystal-label {
                font-size: 0.9rem;
                opacity: 0.9;
            }
            
            .crystal-value {
                font-size: 1.4rem;
                font-weight: 700;
                font-family: 'Fredoka One', cursive;
                text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
            }
            
            .wizard-center {
                text-align: center;
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 10px;
            }
            
            .wizard-avatar {
                font-size: 4rem;
                animation: wizardFloat 3s ease-in-out infinite;
                cursor: pointer;
                transition: transform 0.3s ease;
                filter: drop-shadow(0 0 10px rgba(255, 255, 255, 0.5));
            }
            
            .wizard-avatar:hover {
                transform: scale(1.2) rotate(10deg);
            }
            
            @keyframes wizardFloat {
                0%, 100% { transform: translateY(0) rotate(0deg); }
                33% { transform: translateY(-8px) rotate(3deg); }
                66% { transform: translateY(-4px) rotate(-2deg); }
            }
            
            .wizard-speech {
                background: rgba(255, 255, 255, 0.9);
                color: #333;
                padding: 10px 15px;
                border-radius: 20px;
                font-size: 1rem;
                font-weight: 600;
                max-width: 200px;
                position: relative;
                box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
            }
            
            .wizard-speech::before {
                content: '';
                position: absolute;
                bottom: -10px;
                left: 50%;
                transform: translateX(-50%);
                width: 0;
                height: 0;
                border-left: 10px solid transparent;
                border-right: 10px solid transparent;
                border-top: 10px solid rgba(255, 255, 255, 0.9);
            }
            
            .magic-meter {
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 5px;
            }
            
            .magic-bar {
                width: 80px;
                height: 20px;
                background: rgba(0, 0, 0, 0.3);
                border-radius: 10px;
                overflow: hidden;
                border: 2px solid rgba(255, 255, 255, 0.3);
            }
            
            .magic-fill {
                height: 100%;
                background: linear-gradient(90deg, #8e44ad 0%, #3498db 50%, #e74c3c 100%);
                border-radius: 8px;
                transition: width 0.5s ease;
                animation: magicPulse 2s ease-in-out infinite;
            }
            
            @keyframes magicPulse {
                0%, 100% { filter: brightness(1); }
                50% { filter: brightness(1.3) saturate(1.5); }
            }
            
            .spell-book {
                position: relative;
                z-index: 10;
                background: rgba(255, 255, 255, 0.95);
                color: #333;
                margin: 20px;
                border-radius: 20px;
                padding: 25px;
                box-shadow: 0 15px 35px rgba(0, 0, 0, 0.3);
                backdrop-filter: blur(10px);
            }
            
            .book-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 20px;
                flex-wrap: wrap;
            }
            
            .book-header h3 {
                font-family: 'Fredoka One', cursive;
                font-size: 1.8rem;
                color: #8e44ad;
            }
            
            .difficulty-indicator {
                background: linear-gradient(45deg, #f39c12, #e67e22);
                color: white;
                padding: 8px 15px;
                border-radius: 15px;
                font-weight: 600;
                font-size: 0.9rem;
            }
            
            .word-display {
                text-align: center;
                margin-bottom: 25px;
                padding: 20px;
                background: linear-gradient(45deg, #ecf0f1, #bdc3c7);
                border-radius: 15px;
            }
            
            .word-image {
                margin-bottom: 15px;
            }
            
            .image-placeholder {
                font-size: 3rem;
                margin-bottom: 10px;
            }
            
            .word-hint {
                font-size: 1.2rem;
                font-weight: 600;
                color: #2c3e50;
                margin-bottom: 10px;
            }
            
            .word-pronunciation {
                font-size: 1rem;
                color: #7f8c8d;
                font-style: italic;
            }
            
            .spelling-area {
                margin-bottom: 25px;
            }
            
            .letter-slots {
                display: flex;
                justify-content: center;
                gap: 10px;
                margin-bottom: 15px;
                flex-wrap: wrap;
            }
            
            .letter-slot {
                width: 40px;
                height: 50px;
                border: 3px dashed #bdc3c7;
                border-radius: 10px;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 1.5rem;
                font-weight: 700;
                background: rgba(255, 255, 255, 0.8);
                transition: all 0.3s ease;
            }
            
            .letter-slot.filled {
                background: linear-gradient(45deg, #3498db, #2980b9);
                color: white;
                border-color: #2980b9;
                animation: letterPop 0.3s ease-out;
            }
            
            @keyframes letterPop {
                0% { transform: scale(0.8); }
                50% { transform: scale(1.2); }
                100% { transform: scale(1); }
            }
            
            .current-word {
                text-align: center;
                font-size: 1.8rem;
                font-weight: 700;
                font-family: 'Fredoka One', cursive;
                color: #2c3e50;
                min-height: 40px;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            
            .alphabet-board {
                display: grid;
                grid-template-columns: repeat(6, 1fr);
                gap: 8px;
                margin-bottom: 25px;
                max-width: 400px;
                margin-left: auto;
                margin-right: auto;
            }
            
            .letter-btn {
                aspect-ratio: 1;
                border: none;
                border-radius: 10px;
                font-size: 1.2rem;
                font-weight: 700;
                cursor: pointer;
                transition: all 0.3s ease;
                background: linear-gradient(45deg, #3498db, #2980b9);
                color: white;
                box-shadow: 0 3px 10px rgba(0, 0, 0, 0.2);
            }
            
            .letter-btn:hover {
                transform: translateY(-2px) scale(1.05);
                box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
            }
            
            .letter-btn:active {
                transform: translateY(0) scale(0.95);
            }
            
            .letter-btn.used {
                background: #95a5a6;
                cursor: not-allowed;
                opacity: 0.6;
            }
            
            .letter-btn.correct {
                background: linear-gradient(45deg, #27ae60, #2ecc71);
                animation: correctPulse 0.6s ease-out;
            }
            
            .letter-btn.wrong {
                background: linear-gradient(45deg, #e74c3c, #c0392b);
                animation: wrongShake 0.5s ease-out;
            }
            
            @keyframes correctPulse {
                0%, 100% { transform: scale(1); }
                50% { transform: scale(1.2); filter: brightness(1.3); }
            }
            
            @keyframes wrongShake {
                0%, 100% { transform: translateX(0); }
                25% { transform: translateX(-5px); }
                75% { transform: translateX(5px); }
            }
            
            .word-controls {
                display: flex;
                justify-content: center;
                gap: 10px;
                flex-wrap: wrap;
            }
            
            .magic-btn {
                padding: 10px 20px;
                border: none;
                border-radius: 20px;
                font-size: 1rem;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.3s ease;
                background: linear-gradient(45deg, #8e44ad, #9b59b6);
                color: white;
                box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
            }
            
            .magic-btn:hover {
                transform: translateY(-2px);
                box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
            }
            
            .magic-btn.secondary {
                background: linear-gradient(45deg, #f39c12, #e67e22);
            }
            
            .magic-btn.danger {
                background: linear-gradient(45deg, #e74c3c, #c0392b);
            }
            
            .achievements-display {
                position: relative;
                z-index: 15;
                padding: 15px 20px;
                text-align: center;
                min-height: 50px;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            
            .wizard-achievement {
                background: linear-gradient(45deg, #f1c40f, #f39c12);
                color: white;
                padding: 12px 20px;
                border-radius: 15px;
                animation: wizardAchievement 3s ease-in-out;
                box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
                border: 2px solid rgba(255, 255, 255, 0.3);
                font-weight: 600;
            }
            
            @keyframes wizardAchievement {
                0% { opacity: 0; transform: translateY(-20px) scale(0.9); }
                50% { opacity: 1; transform: translateY(0) scale(1.05); }
                100% { opacity: 1; transform: translateY(0) scale(1); }
            }
            
            .progress-section {
                position: relative;
                z-index: 10;
                padding: 15px 20px;
                text-align: center;
            }
            
            .level-progress span {
                color: white;
                font-weight: 600;
                margin-bottom: 10px;
                display: block;
            }
            
            .progress-bar {
                width: 100%;
                height: 12px;
                background: rgba(255, 255, 255, 0.2);
                border-radius: 6px;
                overflow: hidden;
                border: 1px solid rgba(255, 255, 255, 0.3);
            }
            
            .progress-fill {
                height: 100%;
                background: linear-gradient(90deg, #27ae60, #2ecc71, #f1c40f);
                border-radius: 5px;
                transition: width 0.5s ease;
                animation: progressGlow 2s ease-in-out infinite;
            }
            
            @keyframes progressGlow {
                0%, 100% { filter: brightness(1); }
                50% { filter: brightness(1.2); }
            }
            
            .correct-word-animation {
                animation: correctWordCelebration 2s ease-out;
            }
            
            @keyframes correctWordCelebration {
                0% { transform: scale(1); filter: brightness(1); }
                25% { transform: scale(1.02); filter: brightness(1.3) hue-rotate(60deg); }
                50% { transform: scale(1.05); filter: brightness(1.5) hue-rotate(120deg); }
                75% { transform: scale(1.02); filter: brightness(1.3) hue-rotate(180deg); }
                100% { transform: scale(1); filter: brightness(1); }
            }
            
            .wrong-word-animation {
                animation: wrongWordShake 1s ease-out;
            }
            
            @keyframes wrongWordShake {
                0%, 100% { transform: translateX(0); }
                20% { transform: translateX(-8px); }
                40% { transform: translateX(8px); }
                60% { transform: translateX(-6px); }
                80% { transform: translateX(4px); }
            }
            
            .game-over-wizard {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.9);
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                z-index: 25;
                text-align: center;
                padding: 30px;
            }
            
            .wizard-game-over-content {
                background: linear-gradient(45deg, #8e44ad, #9b59b6);
                padding: 40px;
                border-radius: 20px;
                max-width: 450px;
                width: 100%;
                color: white;
                box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5);
            }
            
            .wizard-game-over-content h2 {
                font-family: 'Fredoka One', cursive;
                font-size: 2.5rem;
                margin-bottom: 20px;
            }
            
            @media (max-width: 768px) {
                .wizard-hud {
                    flex-direction: column;
                    gap: 15px;
                }
                
                .hud-section {
                    flex-direction: row;
                    justify-content: center;
                }
                
                .wizard-avatar {
                    font-size: 3rem;
                }
                
                .wizard-speech {
                    max-width: 150px;
                    font-size: 0.9rem;
                }
                
                .alphabet-board {
                    grid-template-columns: repeat(5, 1fr);
                }
                
                .word-controls {
                    gap: 8px;
                }
                
                .magic-btn {
                    padding: 8px 15px;
                    font-size: 0.9rem;
                }
                
                .spell-book {
                    margin: 15px;
                    padding: 20px;
                }
            }
        `;
        document.head.appendChild(style);
    }

    setupEventListeners() {
        // Alphabet buttons
        this.container.querySelectorAll('.letter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const letter = e.target.dataset.letter;
                if (letter && !e.target.classList.contains('used')) {
                    this.selectLetter(letter, e.target);
                }
            });
        });

        // Wizard avatar interaction
        const wizard = this.container.querySelector('#wizardAvatar');
        if (wizard) {
            wizard.addEventListener('click', () => {
                this.wizardInteraction();
            });
        }

        // Keyboard support
        document.addEventListener('keydown', (e) => {
            if (this.container.closest('.game-modal').style.display === 'none') return;
            
            const letter = e.key.toLowerCase();
            if (letter >= 'a' && letter <= 'z') {
                const btn = this.container.querySelector(`[data-letter="${letter}"]`);
                if (btn && !btn.classList.contains('used')) {
                    this.selectLetter(letter, btn);
                }
            } else if (e.key === 'Enter') {
                this.submitSpelling();
            } else if (e.key === 'Backspace') {
                this.removeLastLetter();
            }
        });
    }

    createMagicEffects() {
        const sparklesContainer = this.container.querySelector('.magic-sparkles');
        if (!sparklesContainer) return;
        
        setInterval(() => {
            if (Math.random() < 0.3) {
                this.createSparkle();
            }
        }, 1000);
    }

    createSparkle() {
        const sparklesContainer = this.container.querySelector('.magic-sparkles');
        if (!sparklesContainer) return;
        
        const sparkle = document.createElement('div');
        sparkle.className = 'sparkle';
        sparkle.textContent = this.magicEffects[Math.floor(Math.random() * this.magicEffects.length)];
        sparkle.style.left = `${Math.random() * 100}%`;
        sparkle.style.top = `${Math.random() * 100}%`;
        sparkle.style.animationDelay = `${Math.random() * 2}s`;
        
        sparklesContainer.appendChild(sparkle);
        
        setTimeout(() => {
            sparkle.remove();
        }, 4000);
    }

    generateAlphabetHTML() {
        const alphabet = 'abcdefghijklmnopqrstuvwxyz';
        return alphabet.split('').map(letter =>
            `<button class="letter-btn" data-letter="${letter}">${letter.toUpperCase()}</button>`
        ).join('');
    }

    selectNewWord() {
        // Determine difficulty based on level
        let difficulty = 'easy';
        if (this.level >= 5) difficulty = 'medium';
        if (this.level >= 10) difficulty = 'hard';
        
        const wordList = this.wordLists[difficulty];
        const randomWord = wordList[Math.floor(Math.random() * wordList.length)];
        
        this.currentWord = {
            word: randomWord,
            difficulty: difficulty,
            hint: this.generateHint(randomWord),
            image: this.getWordImage(randomWord)
        };
        
        this.currentLetters = [];
        this.guessedLetters = [];
        this.correctSpelling = randomWord.toLowerCase();
        
        this.updateWordDisplay();
        this.resetAlphabet();
        this.updateDifficultyIndicator(difficulty);
        this.speakWord(randomWord);
    }

    generateHint(word) {
        const hints = {
            // Easy words
            'cat': 'A furry pet that says "meow"',
            'dog': 'A loyal pet that barks',
            'sun': 'The bright star in our sky',
            'run': 'To move fast with your legs',
            'big': 'Very large in size',
            'red': 'The color of strawberries',
            'fun': 'Something enjoyable to do',
            'top': 'The highest part',
            'box': 'A container to put things in',
            'egg': 'What chickens lay',
            'hat': 'You wear this on your head',
            'pig': 'A pink farm animal',
            'cup': 'You drink from this',
            'bus': 'A big vehicle for many people',
            
            // Medium words
            'apple': 'A red or green fruit',
            'happy': 'Feeling joyful and cheerful',
            'house': 'A place where people live',
            'water': 'Clear liquid we drink',
            'green': 'The color of grass',
            'light': 'Bright illumination',
            'place': 'A location or spot',
            'right': 'The opposite of left',
            'small': 'Not big in size',
            'world': 'The planet we live on',
            'three': 'The number after two',
            'great': 'Very good or excellent',
            'where': 'A question about location',
            'think': 'To use your mind',
            
            // Hard words
            'because': 'The reason why something happens',
            'through': 'Going from one side to another',
            'before': 'Earlier in time',
            'around': 'In a circle or surrounding',
            'another': 'One more or different',
            'without': 'Not having something',
            'between': 'In the middle of two things',
            'against': 'Opposing or touching',
            'nothing': 'Not anything at all',
            'someone': 'A person, but not specific',
            'important': 'Very significant or meaningful',
            'different': 'Not the same',
            'beautiful': 'Very pretty or lovely',
            'wonderful': 'Amazing and delightful'
        };
        
        return hints[word] || `A ${word.length}-letter word`;
    }

    getWordImage(word) {
        const images = {
            'cat': '🐱', 'dog': '🐶', 'sun': '☀️', 'run': '🏃', 'big': '🦣',
            'red': '🔴', 'fun': '🎉', 'top': '⬆️', 'box': '📦', 'egg': '🥚',
            'hat': '👒', 'pig': '🐷', 'cup': '☕', 'bus': '🚌',
            'apple': '🍎', 'happy': '😊', 'house': '🏠', 'water': '💧', 'green': '🟢',
            'light': '💡', 'place': '📍', 'right': '➡️', 'small': '🐭', 'world': '🌍',
            'three': '3️⃣', 'great': '⭐', 'where': '❓', 'think': '🤔',
            'because': '❓', 'through': '🚇', 'before': '⏰', 'around': '🔄', 'another': '➕',
            'without': '🚫', 'between': '↔️', 'against': '🛡️', 'nothing': '⭕', 'someone': '👤',
            'important': '❗', 'different': '🔄', 'beautiful': '🌺', 'wonderful': '🌟'
        };
        
        return images[word] || '📝';
    }

    updateWordDisplay() {
        if (!this.currentWord) return;
        
        // Update image
        const imageEl = this.container.querySelector('.image-placeholder');
        if (imageEl) {
            imageEl.textContent = this.currentWord.image;
        }
        
        // Update hint
        const hintEl = this.container.querySelector('#wordHint');
        if (hintEl) {
            hintEl.textContent = this.currentWord.hint;
        }
        
        // Update letter slots
        const slotsEl = this.container.querySelector('#letterSlots');
        if (slotsEl) {
            slotsEl.innerHTML = this.currentWord.word.split('').map((_, index) =>
                `<div class="letter-slot" data-index="${index}"></div>`
            ).join('');
        }
        
        // Update current word display
        this.updateCurrentWordDisplay();
    }

    updateCurrentWordDisplay() {
        const currentWordEl = this.container.querySelector('#currentWord');
        if (currentWordEl) {
            currentWordEl.textContent = this.currentLetters.join('').toUpperCase();
        }
        
        // Update letter slots
        const slots = this.container.querySelectorAll('.letter-slot');
        slots.forEach((slot, index) => {
            if (this.currentLetters[index]) {
                slot.textContent = this.currentLetters[index].toUpperCase();
                slot.classList.add('filled');
            } else {
                slot.textContent = '';
                slot.classList.remove('filled');
            }
        });
    }

    resetAlphabet() {
        this.container.querySelectorAll('.letter-btn').forEach(btn => {
            btn.classList.remove('used', 'correct', 'wrong');
        });
    }

    updateDifficultyIndicator(difficulty) {
        const indicator = this.container.querySelector('#difficultyIndicator');
        if (indicator) {
            const difficultyInfo = {
                easy: { text: '⭐ Easy Words', color: '#27ae60' },
                medium: { text: '⭐⭐ Medium Words', color: '#f39c12' },
                hard: { text: '⭐⭐⭐ Hard Words', color: '#e74c3c' }
            };
            
            const info = difficultyInfo[difficulty];
            indicator.textContent = info.text;
            indicator.style.background = `linear-gradient(45deg, ${info.color}, ${info.color}aa)`;
        }
    }

    selectLetter(letter, btnElement) {
        if (this.currentLetters.length >= this.currentWord.word.length) return;
        
        this.currentLetters.push(letter);
        btnElement.classList.add('used');
        this.updateCurrentWordDisplay();
        
        // Play sound effect
        this.playMagicSound();
        
        // Auto-submit if word is complete
        if (this.currentLetters.length === this.currentWord.word.length) {
            setTimeout(() => {
                this.submitSpelling();
            }, 500);
        }
    }

    removeLastLetter() {
        if (this.currentLetters.length === 0) return;
        
        const lastLetter = this.currentLetters.pop();
        const btn = this.container.querySelector(`[data-letter="${lastLetter}"]`);
        if (btn) {
            btn.classList.remove('used');
        }
        
        this.updateCurrentWordDisplay();
    }

    submitSpelling() {
        if (this.currentLetters.length !== this.currentWord.word.length) {
            this.wizardSpeak("The spell isn't complete yet! ✨");
            return;
        }
        
        const spelledWord = this.currentLetters.join('').toLowerCase();
        
        if (spelledWord === this.correctSpelling) {
            this.correctSpelling();
        } else {
            this.wrongSpelling();
        }
    }

    correctSpelling() {
        this.score += (10 + (this.level * 5));
        this.wordsCompleted++;
        this.streak++;
        this.magic = Math.min(this.magic + 15, 100);
        
        this.updateUI();
        this.showCorrectAnimation();
        this.wizardCelebrate();
        
        // Mark correct letters
        this.currentLetters.forEach(letter => {
            const btn = this.container.querySelector(`[data-letter="${letter}"]`);
            if (btn) btn.classList.add('correct');
        });
        
        // Check for level up
        if (this.wordsCompleted >= 5) {
            this.levelUp();
        } else {
            setTimeout(() => {
                this.selectNewWord();
            }, 2000);
        }
        
        // Achievements
        if (this.streak === 5) {
            this.showAchievement('🔥 Spelling Streak! 5 words in a row!');
            this.addAchievement('Word Wizard', '5 words spelled correctly in a row!', '🔥');
        } else if (this.streak === 10) {
            this.showAchievement('📚 Master Speller! 10 words in a row!');
            this.addAchievement('Master Speller', '10 perfect spellings!', '📚');
        }
    }

    wrongSpelling() {
        this.lives--;
        this.streak = 0;
        this.magic = Math.max(this.magic - 20, 0);
        
        this.updateUI();
        this.showWrongAnimation();
        this.wizardEncourage();
        
        // Mark wrong letters
        this.currentLetters.forEach(letter => {
            const btn = this.container.querySelector(`[data-letter="${letter}"]`);
            if (btn) btn.classList.add('wrong');
        });
        
        // Show correct spelling
        this.wizardSpeak(`The correct spelling is: ${this.currentWord.word.toUpperCase()}`);
        
        if (this.lives <= 0 || this.magic <= 0) {
            setTimeout(() => {
                this.gameOver();
            }, 2000);
        } else {
            setTimeout(() => {
                this.selectNewWord();
            }, 3000);
        }
    }

    levelUp() {
        this.level++;
        this.wordsCompleted = 0;
        this.lives = Math.min(this.lives + 1, 5);
        this.magic = 100;
        
        this.updateUI();
        this.updateProgressBar();
        this.showAchievement(`🎓 Level ${this.level} Reached!`);
        this.wizardSpeak(`Amazing! Welcome to Level ${this.level}! 🌟`);
        
        if (this.level === 5) {
            this.addAchievement('Word Scholar', 'Reached level 5!', '🎓');
        } else if (this.level === 10) {
            this.addAchievement('Spelling Master', 'Reached level 10!', '👑');
        }
        
        setTimeout(() => {
            this.selectNewWord();
        }, 3000);
    }

    gameOver() {
        const gameOverScreen = document.createElement('div');
        gameOverScreen.className = 'game-over-wizard';
        gameOverScreen.innerHTML = `
            <div class="wizard-game-over-content">
                <h2>Spell Book Closed! 📚</h2>
                <p><strong>Final Level:</strong> ${this.level}</p>
                <p><strong>Total Score:</strong> ${this.score}</p>
                <p><strong>Words Completed:</strong> ${this.level * 5 + this.wordsCompleted - 5}</p>
                <p>Your magic ran out, but you've learned so many words! ✨</p>
                <button class="magic-btn" onclick="this.restart()">🔄 New Adventure</button>
            </div>
        `;
        
        this.container.appendChild(gameOverScreen);
        
        if (this.score > 100) {
            this.addAchievement('Word Explorer', `Scored ${this.score} points!`, '🏆');
        }
    }

    hearWord() {
        if (this.currentWord) {
            this.speakWord(this.currentWord.word);
            this.wizardSpeak("Listen carefully! 👂");
        }
    }

    getHint() {
        if (!this.currentWord) return;
        
        this.magic = Math.max(this.magic - 10, 0);
        this.updateUI();
        
        // Show first letter that hasn't been guessed
        for (let i = 0; i < this.currentWord.word.length; i++) {
            const letter = this.currentWord.word[i].toLowerCase();
            if (!this.currentLetters.includes(letter)) {
                const btn = this.container.querySelector(`[data-letter="${letter}"]`);
                if (btn) {
                    btn.style.background = 'linear-gradient(45deg, #f1c40f, #f39c12)';
                    setTimeout(() => {
                        btn.style.background = '';
                    }, 2000);
                }
                this.wizardSpeak(`💡 Try the letter "${letter.toUpperCase()}"`);
                break;
            }
        }
        
        if (this.magic <= 0) {
            setTimeout(() => {
                this.gameOver();
            }, 1000);
        }
    }

    clearSpelling() {
        this.currentLetters = [];
        this.resetAlphabet();
        this.updateCurrentWordDisplay();
        this.wizardSpeak("Starting fresh! ✨");
    }

    showCorrectAnimation() {
        this.container.classList.add('correct-word-animation');
        setTimeout(() => {
            this.container.classList.remove('correct-word-animation');
        }, 2000);
        
        // Create celebration sparkles
        for (let i = 0; i < 10; i++) {
            setTimeout(() => {
                this.createSparkle();
            }, i * 100);
        }
    }

    showWrongAnimation() {
        this.container.classList.add('wrong-word-animation');
        setTimeout(() => {
            this.container.classList.remove('wrong-word-animation');
        }, 1000);
    }

    updateUI() {
        const scoreEl = this.container.querySelector('#word-score');
        if (scoreEl) scoreEl.textContent = this.score;
        
        const levelEl = this.container.querySelector('#word-level');
        if (levelEl) levelEl.textContent = this.level;
        
        const livesEl = this.container.querySelector('#word-lives');
        if (livesEl) livesEl.textContent = this.lives;
        
        const magicFill = this.container.querySelector('#magicFill');
        if (magicFill) {
            magicFill.style.width = `${this.magic}%`;
        }
        
        this.updateProgressBar();
    }

    updateProgressBar() {
        const progressFill = this.container.querySelector('#progressFill');
        const progressText = this.container.querySelector('.level-progress span');
        
        if (progressFill) {
            progressFill.style.width = `${(this.wordsCompleted / 5) * 100}%`;
        }
        
        if (progressText) {
            progressText.textContent = `Words to next level: ${5 - this.wordsCompleted}/5`;
        }
    }

    showAchievement(message) {
        const display = this.container.querySelector('#achievementsDisplay');
        if (!display) return;
        
        display.innerHTML = `<div class="wizard-achievement">${message}</div>`;
        
        setTimeout(() => {
            display.innerHTML = '';
        }, 3000);
    }

    wizardSpeak(message) {
        const speechEl = this.container.querySelector('#wizardSpeech');
        if (speechEl) {
            speechEl.textContent = message;
        }
    }

    wizardCelebrate() {
        const avatarEl = this.container.querySelector('#wizardAvatar');
        if (!avatarEl) return;
        
        const celebrations = ['🎉', '⭐', '✨', '🌟', '🎊'];
        const original = avatarEl.textContent;
        
        celebrations.forEach((emoji, i) => {
            setTimeout(() => {
                avatarEl.textContent = emoji;
            }, i * 200);
        });
        
        setTimeout(() => {
            avatarEl.textContent = original;
        }, celebrations.length * 200);
        
        this.wizardSpeak("Excellent spelling! ⭐");
    }

    wizardEncourage() {
        const encouragements = [
            "Don't give up! Try again! 💪",
            "Every mistake is a learning spell! 📚",
            "You're getting better! ✨",
            "Magic takes practice! 🔮",
            "Believe in your spelling power! 🌟"
        ];
        
        const message = encouragements[Math.floor(Math.random() * encouragements.length)];
        this.wizardSpeak(message);
    }

    wizardInteraction() {
        const avatarEl = this.container.querySelector('#wizardAvatar');
        if (!avatarEl) return;
        
        const moods = this.wizardMoods;
        const randomMood = moods[Math.floor(Math.random() * moods.length)];
        const original = avatarEl.textContent;
        
        avatarEl.textContent = randomMood;
        this.playMagicSound();
        this.createSparkle();
        
        const phrases = [
            "Ready for more magic? ✨",
            "Your spelling powers grow stronger! 🔮",
            "Every word is a new spell! 📖",
            "Magic happens when you practice! 🌟",
            "The spell book awaits! 📚"
        ];
        
        this.wizardSpeak(phrases[Math.floor(Math.random() * phrases.length)]);
        
        setTimeout(() => {
            avatarEl.textContent = original;
        }, 2000);
    }

    speakWord(word) {
        // Text-to-speech for word pronunciation
        if ('speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance(word);
            utterance.rate = 0.7;
            utterance.pitch = 1.2;
            utterance.volume = 0.8;
            speechSynthesis.speak(utterance);
        }
    }

    playMagicSound() {
        if (window.superKidsGames) {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.setValueAtTime(800 + Math.random() * 400, audioContext.currentTime);
            oscillator.type = 'sine';
            
            gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
            
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.3);
        }
    }

    restart() {
        this.level = 1;
        this.score = 0;
        this.lives = 3;
        this.magic = 100;
        this.wordsCompleted = 0;
        this.streak = 0;
        this.currentWord = null;
        this.currentLetters = [];
        this.guessedLetters = [];
        
        this.createGameInterface();
        this.setupEventListeners();
        this.createMagicEffects();
        this.selectNewWord();
    }

    addAchievement(title, description, icon) {
        if (window.superKidsGames) {
            window.superKidsGames.addAchievement(title, description, icon);
        }
    }

    destroy() {
        if (this.container) {
            this.container.innerHTML = '';
        }
    }
}

// Make the class available globally
window.WordWizard = WordWizard;