// Memory Monster Game - Super Fun Memory Challenge!
class MemoryMonster {
    constructor(container) {
        this.container = container;
        this.level = 1;
        this.score = 0;
        this.sequence = [];
        this.playerSequence = [];
        this.isPlaying = false;
        this.monsters = ['👹', '👺', '🤖', '👽', '🦄', '🐙', '🦝', '🐻'];
        this.colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57', '#ff9ff3', '#54a0ff', '#5f27cd'];
        this.sounds = {
            correct: 800,
            wrong: 300,
            win: 1000,
            monster: 600
        };
        
        this.init();
    }

    init() {
        this.createGameInterface();
        this.startGame();
    }

    createGameInterface() {
        this.container.innerHTML = `
            <div class="memory-monster-game">
                <div class="game-header">
                    <div class="score-display">
                        <h3>🏆 Score: <span id="memory-score">${this.score}</span></h3>
                        <h4>📊 Level: <span id="memory-level">${this.level}</span></h4>
                    </div>
                    <div class="monster-mascot">
                        <div class="hungry-monster">🍽️</div>
                        <p>Feed me the right sequence!</p>
                    </div>
                </div>
                
                <div class="game-instructions">
                    <p>🎯 Watch the sequence, then repeat it by clicking the monsters!</p>
                    <p>✨ Each level adds one more monster to remember!</p>
                </div>
                
                <div class="sequence-display" id="sequenceDisplay">
                    <p>Get ready... 🚀</p>
                </div>
                
                <div class="monster-grid" id="monsterGrid">
                    ${this.monsters.map((monster, index) => `
                        <div class="monster-card" data-index="${index}" style="background-color: ${this.colors[index]}">
                            <div class="monster-emoji">${monster}</div>
                            <div class="monster-pulse"></div>
                        </div>
                    `).join('')}
                </div>
                
                <div class="game-controls">
                    <button class="game-btn" id="startBtn" onclick="this.startNewSequence()">
                        🎮 Start Level ${this.level}
                    </button>
                    <button class="game-btn secondary" id="hintBtn" onclick="this.showHint()">
                        💡 Hint
                    </button>
                </div>
                
                <div class="progress-bar">
                    <div class="progress-fill" id="progressFill"></div>
                </div>
                
                <div class="achievement-display" id="achievementDisplay"></div>
            </div>
        `;
        
        // Add game-specific styles
        this.addGameStyles();
        this.setupEventListeners();
    }

    addGameStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .memory-monster-game {
                text-align: center;
                padding: 20px;
                max-width: 600px;
                margin: 0 auto;
            }
            
            .game-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 20px;
                flex-wrap: wrap;
                gap: 20px;
            }
            
            .score-display h3, .score-display h4 {
                margin: 5px 0;
                color: #333;
                font-family: 'Fredoka One', cursive;
            }
            
            .monster-mascot {
                text-align: center;
            }
            
            .hungry-monster {
                font-size: 3rem;
                animation: monsterBounce 2s ease-in-out infinite;
                cursor: pointer;
                margin-bottom: 10px;
            }
            
            @keyframes monsterBounce {
                0%, 100% { transform: scale(1) rotate(0deg); }
                50% { transform: scale(1.1) rotate(5deg); }
            }
            
            .game-instructions {
                background: linear-gradient(45deg, #ffeaa7, #fab1a0);
                padding: 15px;
                border-radius: 15px;
                margin: 20px 0;
                box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
            }
            
            .game-instructions p {
                margin: 5px 0;
                font-weight: 600;
                color: #333;
            }
            
            .sequence-display {
                font-size: 1.5rem;
                font-weight: 700;
                color: #333;
                margin: 20px 0;
                min-height: 40px;
                padding: 15px;
                background: rgba(255, 255, 255, 0.8);
                border-radius: 10px;
            }
            
            .monster-grid {
                display: grid;
                grid-template-columns: repeat(4, 1fr);
                gap: 15px;
                margin: 30px 0;
                max-width: 400px;
                margin-left: auto;
                margin-right: auto;
            }
            
            .monster-card {
                aspect-ratio: 1;
                border-radius: 15px;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                transition: all 0.3s ease;
                position: relative;
                overflow: hidden;
                box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
            }
            
            .monster-card:hover {
                transform: scale(1.05) translateY(-3px);
                box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
            }
            
            .monster-card:active {
                transform: scale(0.95);
            }
            
            .monster-emoji {
                font-size: 2.5rem;
                z-index: 2;
                position: relative;
            }
            
            .monster-pulse {
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                width: 0;
                height: 0;
                background: rgba(255, 255, 255, 0.6);
                border-radius: 50%;
                z-index: 1;
            }
            
            .monster-card.active .monster-pulse {
                animation: pulseEffect 0.8s ease-out;
            }
            
            @keyframes pulseEffect {
                0% { width: 0; height: 0; opacity: 0.8; }
                100% { width: 120%; height: 120%; opacity: 0; }
            }
            
            .monster-card.highlight {
                animation: highlightFlash 0.6s ease-in-out;
                transform: scale(1.1);
            }
            
            @keyframes highlightFlash {
                0%, 100% { 
                    box-shadow: 0 0 0 0 rgba(255, 255, 255, 0.8);
                    filter: brightness(1);
                }
                50% { 
                    box-shadow: 0 0 0 20px rgba(255, 255, 255, 0);
                    filter: brightness(1.3);
                }
            }
            
            .monster-card.correct {
                animation: correctPulse 0.5s ease-in-out;
            }
            
            @keyframes correctPulse {
                0%, 100% { transform: scale(1); }
                50% { transform: scale(1.2); filter: brightness(1.3); }
            }
            
            .monster-card.wrong {
                animation: wrongShake 0.5s ease-in-out;
                filter: grayscale(50%);
            }
            
            @keyframes wrongShake {
                0%, 100% { transform: translateX(0); }
                25% { transform: translateX(-10px); }
                75% { transform: translateX(10px); }
            }
            
            .game-controls {
                display: flex;
                justify-content: center;
                gap: 15px;
                margin: 30px 0;
                flex-wrap: wrap;
            }
            
            .game-btn {
                padding: 12px 25px;
                border: none;
                border-radius: 25px;
                font-size: 1.1rem;
                font-weight: 700;
                cursor: pointer;
                transition: all 0.3s ease;
                background: linear-gradient(45deg, #4ecdc4, #44a08d);
                color: white;
                box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
            }
            
            .game-btn:hover {
                transform: translateY(-3px);
                box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
            }
            
            .game-btn.secondary {
                background: linear-gradient(45deg, #ff9a9e, #fecfef);
            }
            
            .game-btn:disabled {
                opacity: 0.6;
                cursor: not-allowed;
                transform: none;
            }
            
            .progress-bar {
                width: 100%;
                height: 10px;
                background: rgba(0, 0, 0, 0.1);
                border-radius: 5px;
                margin: 20px 0;
                overflow: hidden;
            }
            
            .progress-fill {
                height: 100%;
                background: linear-gradient(45deg, #4ecdc4, #44a08d);
                border-radius: 5px;
                width: 0%;
                transition: width 0.3s ease;
                animation: progressGlow 2s ease-in-out infinite;
            }
            
            @keyframes progressGlow {
                0%, 100% { filter: brightness(1); }
                50% { filter: brightness(1.2); }
            }
            
            .achievement-display {
                min-height: 60px;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 1.2rem;
                font-weight: 700;
            }
            
            .achievement-popup {
                background: linear-gradient(45deg, #ffd89b, #19547b);
                color: white;
                padding: 15px 25px;
                border-radius: 15px;
                animation: achievementBounce 2s ease-in-out;
                box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
            }
            
            @keyframes achievementBounce {
                0% { opacity: 0; transform: scale(0.5) translateY(20px); }
                50% { opacity: 1; transform: scale(1.1) translateY(0); }
                100% { opacity: 1; transform: scale(1) translateY(0); }
            }
            
            .game-over {
                text-align: center;
                padding: 30px;
                background: linear-gradient(45deg, #ff6b6b, #ee5a24);
                color: white;
                border-radius: 15px;
                margin-top: 20px;
            }
            
            .game-over h3 {
                font-size: 2rem;
                margin-bottom: 15px;
                font-family: 'Fredoka One', cursive;
            }
            
            @media (max-width: 480px) {
                .monster-grid {
                    grid-template-columns: repeat(3, 1fr);
                    gap: 10px;
                }
                
                .monster-emoji {
                    font-size: 2rem;
                }
                
                .game-header {
                    flex-direction: column;
                    text-align: center;
                }
                
                .hungry-monster {
                    font-size: 2.5rem;
                }
            }
        `;
        document.head.appendChild(style);
    }

    setupEventListeners() {
        // Monster card click handlers
        const monsterCards = this.container.querySelectorAll('.monster-card');
        monsterCards.forEach((card, index) => {
            card.addEventListener('click', () => {
                if (this.isPlaying) {
                    this.handleMonsterClick(index);
                }
            });
        });

        // Mascot interaction
        const mascot = this.container.querySelector('.hungry-monster');
        if (mascot) {
            mascot.addEventListener('click', () => {
                this.mascotFeedback();
            });
        }
    }

    startGame() {
        this.updateProgress();
        this.startNewSequence();
    }

    startNewSequence() {
        this.sequence = [];
        this.playerSequence = [];
        this.isPlaying = false;
        
        // Generate sequence based on level
        for (let i = 0; i < this.level + 2; i++) {
            this.sequence.push(Math.floor(Math.random() * this.monsters.length));
        }
        
        this.showSequence();
    }

    async showSequence() {
        const display = this.container.querySelector('#sequenceDisplay');
        const startBtn = this.container.querySelector('#startBtn');
        
        display.textContent = 'Watch carefully... 👀';
        startBtn.disabled = true;
        
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        for (let i = 0; i < this.sequence.length; i++) {
            const monsterIndex = this.sequence[i];
            await this.highlightMonster(monsterIndex);
            await new Promise(resolve => setTimeout(resolve, 200));
        }
        
        display.textContent = 'Now repeat the sequence! 🎯';
        this.isPlaying = true;
        startBtn.disabled = false;
        startBtn.textContent = '🔄 New Sequence';
    }

    async highlightMonster(index) {
        const card = this.container.querySelector(`[data-index="${index}"]`);
        if (!card) return;
        
        card.classList.add('highlight', 'active');
        this.playSound(this.sounds.monster + (index * 100));
        
        await new Promise(resolve => setTimeout(resolve, 600));
        
        card.classList.remove('highlight', 'active');
    }

    handleMonsterClick(index) {
        if (!this.isPlaying) return;
        
        const card = this.container.querySelector(`[data-index="${index}"]`);
        card.classList.add('active');
        
        this.playerSequence.push(index);
        
        // Check if current click is correct
        const currentIndex = this.playerSequence.length - 1;
        if (this.playerSequence[currentIndex] === this.sequence[currentIndex]) {
            // Correct so far
            card.classList.add('correct');
            this.playSound(this.sounds.correct);
            
            setTimeout(() => {
                card.classList.remove('correct', 'active');
            }, 300);
            
            // Check if sequence is complete
            if (this.playerSequence.length === this.sequence.length) {
                this.sequenceComplete();
            }
        } else {
            // Wrong!
            card.classList.add('wrong');
            this.playSound(this.sounds.wrong);
            this.gameOver();
        }
    }

    sequenceComplete() {
        this.isPlaying = false;
        this.score += this.level * 10;
        this.level++;
        
        this.updateScore();
        this.updateProgress();
        this.showAchievement(`Level ${this.level - 1} Complete! 🎉`);
        
        // Monster celebration
        this.mascotCelebration();
        
        // Check for special achievements
        if (this.level === 5) {
            this.addAchievement('Memory Master', 'Reached level 5!', '🧠');
        } else if (this.level === 10) {
            this.addAchievement('Super Brain', 'Incredible memory power!', '🌟');
        }
        
        // Start next level after delay
        setTimeout(() => {
            this.startNewSequence();
        }, 2000);
    }

    gameOver() {
        this.isPlaying = false;
        const display = this.container.querySelector('#sequenceDisplay');
        
        // Show all monsters briefly to show correct sequence
        this.sequence.forEach((monsterIndex, i) => {
            setTimeout(() => {
                const card = this.container.querySelector(`[data-index="${monsterIndex}"]`);
                card.classList.add('highlight');
                setTimeout(() => {
                    card.classList.remove('highlight');
                }, 300);
            }, i * 150);
        });
        
        setTimeout(() => {
            const gameOverDiv = document.createElement('div');
            gameOverDiv.className = 'game-over';
            gameOverDiv.innerHTML = `
                <h3>Game Over! 😅</h3>
                <p>You reached level ${this.level} and scored ${this.score} points!</p>
                <p>The monster is still hungry... try again! 🍽️</p>
                <button class="game-btn" onclick="this.restart()">🎮 Play Again</button>
            `;
            
            this.container.appendChild(gameOverDiv);
            
            // Add to achievements if high score
            if (this.score > 50) {
                this.addAchievement('Good Try!', `Scored ${this.score} points`, '🏆');
            }
        }, 1000);
    }

    restart() {
        this.level = 1;
        this.score = 0;
        this.sequence = [];
        this.playerSequence = [];
        this.isPlaying = false;
        
        this.createGameInterface();
        this.setupEventListeners();
        this.startGame();
    }

    updateScore() {
        const scoreEl = this.container.querySelector('#memory-score');
        const levelEl = this.container.querySelector('#memory-level');
        if (scoreEl) scoreEl.textContent = this.score;
        if (levelEl) levelEl.textContent = this.level;
    }

    updateProgress() {
        const progressFill = this.container.querySelector('#progressFill');
        if (progressFill) {
            const progress = Math.min((this.level - 1) * 10, 100);
            progressFill.style.width = `${progress}%`;
        }
    }

    showAchievement(message) {
        const display = this.container.querySelector('#achievementDisplay');
        if (!display) return;
        
        display.innerHTML = `<div class="achievement-popup">${message}</div>`;
        
        setTimeout(() => {
            display.innerHTML = '';
        }, 3000);
    }

    mascotCelebration() {
        const mascot = this.container.querySelector('.hungry-monster');
        if (!mascot) return;
        
        const celebrations = ['😋', '🤤', '😍', '🥳', '🎉'];
        const original = mascot.textContent;
        
        celebrations.forEach((emoji, i) => {
            setTimeout(() => {
                mascot.textContent = emoji;
            }, i * 200);
        });
        
        setTimeout(() => {
            mascot.textContent = original;
        }, celebrations.length * 200);
    }

    mascotFeedback() {
        const mascot = this.container.querySelector('.hungry-monster');
        if (!mascot) return;
        
        const feedbacks = ['🍽️', '😋', '🤔', '👀', '🎯'];
        const feedback = feedbacks[Math.floor(Math.random() * feedbacks.length)];
        const original = mascot.textContent;
        
        mascot.textContent = feedback;
        this.playSound(this.sounds.monster);
        
        setTimeout(() => {
            mascot.textContent = original;
        }, 1000);
    }

    showHint() {
        if (!this.isPlaying || this.playerSequence.length >= this.sequence.length) return;
        
        const nextIndex = this.sequence[this.playerSequence.length];
        const card = this.container.querySelector(`[data-index="${nextIndex}"]`);
        
        card.style.filter = 'brightness(1.3)';
        setTimeout(() => {
            card.style.filter = '';
        }, 1000);
        
        this.showAchievement('💡 Next monster highlighted!');
    }

    addAchievement(title, description, icon) {
        if (window.superKidsGames) {
            window.superKidsGames.addAchievement(title, description, icon);
        }
    }

    playSound(frequency) {
        if (window.superKidsGames) {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
            oscillator.type = 'sine';
            
            gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
            
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.3);
        }
    }

    destroy() {
        // Cleanup when game is closed
        if (this.container) {
            this.container.innerHTML = '';
        }
    }
}

// Make the class available globally
window.MemoryMonster = MemoryMonster;