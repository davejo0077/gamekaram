// Space Math Adventure - Epic Math Journey to the Stars!
class MathAdventure {
    constructor(container) {
        this.container = container;
        this.level = 1;
        this.score = 0;
        this.lives = 3;
        this.fuel = 100;
        this.currentProblem = null;
        this.problemCount = 0;
        this.streak = 0;
        this.maxStreak = 0;
        this.difficulty = 'easy'; // easy, medium, hard
        this.rockets = ['🚀', '🛸', '🛰️', '🌌'];
        this.planets = ['🌍', '🪐', '🌕', '⭐', '🌟', '💫', '☄️', '🌠'];
        
        this.init();
    }

    init() {
        this.createGameInterface();
        this.generateProblem();
    }

    createGameInterface() {
        this.container.innerHTML = `
            <div class="math-adventure-game">
                <div class="space-background">
                    <div class="stars-field"></div>
                    <div class="moving-stars"></div>
                </div>
                
                <div class="game-hud">
                    <div class="hud-left">
                        <div class="stat-box">
                            <span class="stat-label">🚀 Level</span>
                            <span class="stat-value" id="math-level">${this.level}</span>
                        </div>
                        <div class="stat-box">
                            <span class="stat-label">⭐ Score</span>
                            <span class="stat-value" id="math-score">${this.score}</span>
                        </div>
                    </div>
                    
                    <div class="hud-center">
                        <div class="rocket-display">
                            <div class="rocket-ship" id="rocketShip">🚀</div>
                        </div>
                    </div>
                    
                    <div class="hud-right">
                        <div class="stat-box">
                            <span class="stat-label">❤️ Lives</span>
                            <span class="stat-value" id="math-lives">${this.lives}</span>
                        </div>
                        <div class="fuel-gauge">
                            <span class="stat-label">⛽ Fuel</span>
                            <div class="fuel-bar">
                                <div class="fuel-fill" id="fuelFill" style="width: ${this.fuel}%"></div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="problem-container">
                    <div class="problem-display">
                        <h3>🎯 Mission Control</h3>
                        <div class="problem-text" id="problemText">
                            Get ready for launch! 🚀
                        </div>
                        <div class="streak-display" id="streakDisplay">
                            ${this.streak > 0 ? `🔥 Streak: ${this.streak}` : ''}
                        </div>
                    </div>
                    
                    <div class="answer-section" id="answerSection">
                        <div class="number-pad">
                            ${[1,2,3,4,5,6,7,8,9,0].map(num => 
                                `<button class="number-btn" data-number="${num}">${num}</button>`
                            ).join('')}
                            <button class="number-btn special" data-action="clear">🗑️</button>
                            <button class="number-btn special" data-action="submit">🚀</button>
                        </div>
                        <div class="answer-display">
                            <input type="text" id="answerInput" placeholder="Your answer..." readonly>
                        </div>
                    </div>
                </div>
                
                <div class="planets-display" id="planetsDisplay">
                    <div class="planet-progress">
                        <h4>🌌 Destination Progress</h4>
                        <div class="planets-row" id="planetsRow">
                            ${this.generatePlanetsHTML()}
                        </div>
                    </div>
                </div>
                
                <div class="achievement-zone" id="achievementZone"></div>
                
                <div class="game-controls">
                    <button class="space-btn" id="hintBtn" onclick="this.getHint()">
                        💡 Hint
                    </button>
                    <button class="space-btn secondary" id="skipBtn" onclick="this.skipProblem()">
                        ⏭️ Skip
                    </button>
                    <button class="space-btn danger" id="restartBtn" onclick="this.restart()">
                        🔄 Restart
                    </button>
                </div>
            </div>
        `;
        
        this.addGameStyles();
        this.setupEventListeners();
        this.createStarField();
    }

    addGameStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .math-adventure-game {
                position: relative;
                min-height: 600px;
                background: linear-gradient(180deg, #0c0c3f 0%, #1a1a5e 50%, #2a1810 100%);
                border-radius: 15px;
                overflow: hidden;
                color: white;
                font-family: 'Nunito', sans-serif;
            }
            
            .space-background {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                z-index: 1;
            }
            
            .stars-field {
                position: absolute;
                width: 100%;
                height: 100%;
                background: transparent;
                z-index: 1;
            }
            
            .star {
                position: absolute;
                width: 2px;
                height: 2px;
                background: white;
                border-radius: 50%;
                animation: twinkle 3s ease-in-out infinite;
            }
            
            @keyframes twinkle {
                0%, 100% { opacity: 0.3; transform: scale(1); }
                50% { opacity: 1; transform: scale(1.5); }
            }
            
            .moving-stars {
                position: absolute;
                width: 100%;
                height: 100%;
                background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="10" cy="10" r="0.5" fill="white"/><circle cx="30" cy="30" r="0.8" fill="white"/><circle cx="60" cy="20" r="0.6" fill="white"/><circle cx="80" cy="60" r="0.7" fill="white"/><circle cx="20" cy="80" r="0.5" fill="white"/></svg>') repeat;
                animation: moveStars 20s linear infinite;
                opacity: 0.6;
            }
            
            @keyframes moveStars {
                from { transform: translateY(0); }
                to { transform: translateY(-100px); }
            }
            
            .game-hud {
                position: relative;
                z-index: 10;
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 20px;
                background: rgba(0, 0, 0, 0.3);
                backdrop-filter: blur(10px);
            }
            
            .hud-left, .hud-right {
                display: flex;
                flex-direction: column;
                gap: 10px;
            }
            
            .stat-box {
                display: flex;
                flex-direction: column;
                align-items: center;
                background: rgba(255, 255, 255, 0.1);
                padding: 10px 15px;
                border-radius: 10px;
                backdrop-filter: blur(5px);
            }
            
            .stat-label {
                font-size: 0.9rem;
                opacity: 0.8;
            }
            
            .stat-value {
                font-size: 1.3rem;
                font-weight: 700;
                font-family: 'Fredoka One', cursive;
            }
            
            .rocket-display {
                text-align: center;
            }
            
            .rocket-ship {
                font-size: 4rem;
                animation: rocketFloat 3s ease-in-out infinite;
                cursor: pointer;
                transition: transform 0.3s ease;
            }
            
            .rocket-ship:hover {
                transform: scale(1.2) rotate(10deg);
            }
            
            @keyframes rocketFloat {
                0%, 100% { transform: translateY(0) rotate(0deg); }
                33% { transform: translateY(-10px) rotate(5deg); }
                66% { transform: translateY(-5px) rotate(-3deg); }
            }
            
            .fuel-gauge {
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 5px;
            }
            
            .fuel-bar {
                width: 60px;
                height: 20px;
                background: rgba(255, 255, 255, 0.2);
                border-radius: 10px;
                overflow: hidden;
                border: 2px solid rgba(255, 255, 255, 0.3);
            }
            
            .fuel-fill {
                height: 100%;
                background: linear-gradient(90deg, #ff6b6b 0%, #feca57 50%, #4ecdc4 100%);
                border-radius: 8px;
                transition: width 0.5s ease;
                animation: fuelPulse 2s ease-in-out infinite;
            }
            
            @keyframes fuelPulse {
                0%, 100% { filter: brightness(1); }
                50% { filter: brightness(1.3); }
            }
            
            .problem-container {
                position: relative;
                z-index: 10;
                padding: 30px;
                text-align: center;
            }
            
            .problem-display {
                background: rgba(255, 255, 255, 0.1);
                backdrop-filter: blur(10px);
                border-radius: 20px;
                padding: 25px;
                margin-bottom: 25px;
                border: 2px solid rgba(255, 255, 255, 0.2);
            }
            
            .problem-display h3 {
                font-family: 'Fredoka One', cursive;
                margin-bottom: 15px;
                font-size: 1.5rem;
                color: #feca57;
            }
            
            .problem-text {
                font-size: 2rem;
                font-weight: 700;
                margin-bottom: 15px;
                color: white;
                font-family: 'Fredoka One', cursive;
                text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
            }
            
            .streak-display {
                font-size: 1.2rem;
                font-weight: 600;
                color: #ff6b6b;
                animation: streakGlow 2s ease-in-out infinite;
            }
            
            @keyframes streakGlow {
                0%, 100% { text-shadow: 0 0 5px #ff6b6b; }
                50% { text-shadow: 0 0 20px #ff6b6b, 0 0 30px #ff6b6b; }
            }
            
            .answer-section {
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 20px;
            }
            
            .number-pad {
                display: grid;
                grid-template-columns: repeat(3, 1fr);
                gap: 10px;
                max-width: 300px;
                width: 100%;
            }
            
            .number-btn {
                aspect-ratio: 1;
                border: none;
                border-radius: 15px;
                font-size: 1.5rem;
                font-weight: 700;
                cursor: pointer;
                transition: all 0.3s ease;
                background: linear-gradient(45deg, #4ecdc4, #44a08d);
                color: white;
                box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
            }
            
            .number-btn:hover {
                transform: translateY(-3px) scale(1.05);
                box-shadow: 0 8px 20px rgba(0, 0, 0, 0.4);
            }
            
            .number-btn:active {
                transform: translateY(0) scale(0.95);
            }
            
            .number-btn.special {
                background: linear-gradient(45deg, #ff9a9e, #fecfef);
            }
            
            .answer-display {
                width: 100%;
                max-width: 300px;
            }
            
            #answerInput {
                width: 100%;
                padding: 15px 20px;
                border: none;
                border-radius: 25px;
                font-size: 1.5rem;
                text-align: center;
                font-weight: 700;
                background: rgba(255, 255, 255, 0.9);
                color: #333;
                box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
            }
            
            .planets-display {
                position: relative;
                z-index: 10;
                padding: 20px 30px;
                text-align: center;
            }
            
            .planet-progress h4 {
                font-family: 'Fredoka One', cursive;
                margin-bottom: 15px;
                color: #feca57;
            }
            
            .planets-row {
                display: flex;
                justify-content: center;
                align-items: center;
                gap: 15px;
                flex-wrap: wrap;
            }
            
            .planet-item {
                font-size: 2.5rem;
                opacity: 0.3;
                transition: all 0.5s ease;
                animation: planetOrbit 8s ease-in-out infinite;
            }
            
            .planet-item.reached {
                opacity: 1;
                animation: planetGlow 2s ease-in-out infinite;
                transform: scale(1.2);
            }
            
            @keyframes planetOrbit {
                0%, 100% { transform: translateY(0) rotate(0deg); }
                50% { transform: translateY(-10px) rotate(180deg); }
            }
            
            @keyframes planetGlow {
                0%, 100% { 
                    filter: drop-shadow(0 0 10px #feca57);
                    transform: scale(1.2);
                }
                50% { 
                    filter: drop-shadow(0 0 20px #feca57);
                    transform: scale(1.3);
                }
            }
            
            .achievement-zone {
                position: relative;
                z-index: 15;
                padding: 20px;
                text-align: center;
                min-height: 60px;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            
            .space-achievement {
                background: linear-gradient(45deg, #667eea, #764ba2);
                color: white;
                padding: 15px 25px;
                border-radius: 15px;
                animation: spaceAchievement 3s ease-in-out;
                box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4);
                border: 2px solid rgba(255, 255, 255, 0.3);
            }
            
            @keyframes spaceAchievement {
                0% { opacity: 0; transform: translateY(-30px) scale(0.8); }
                50% { opacity: 1; transform: translateY(0) scale(1.1); }
                100% { opacity: 1; transform: translateY(0) scale(1); }
            }
            
            .game-controls {
                position: relative;
                z-index: 10;
                display: flex;
                justify-content: center;
                gap: 15px;
                padding: 20px;
                flex-wrap: wrap;
            }
            
            .space-btn {
                padding: 12px 25px;
                border: none;
                border-radius: 25px;
                font-size: 1.1rem;
                font-weight: 700;
                cursor: pointer;
                transition: all 0.3s ease;
                background: linear-gradient(45deg, #667eea, #764ba2);
                color: white;
                box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
            }
            
            .space-btn:hover {
                transform: translateY(-3px);
                box-shadow: 0 8px 20px rgba(0, 0, 0, 0.4);
            }
            
            .space-btn.secondary {
                background: linear-gradient(45deg, #feca57, #ff9ff3);
            }
            
            .space-btn.danger {
                background: linear-gradient(45deg, #ff6b6b, #ee5a24);
            }
            
            .correct-animation {
                animation: correctBlast 1s ease-out;
            }
            
            @keyframes correctBlast {
                0% { transform: scale(1); filter: brightness(1); }
                50% { transform: scale(1.05); filter: brightness(1.5) hue-rotate(120deg); }
                100% { transform: scale(1); filter: brightness(1); }
            }
            
            .wrong-animation {
                animation: wrongShake 0.8s ease-out;
            }
            
            @keyframes wrongShake {
                0%, 100% { transform: translateX(0); }
                20% { transform: translateX(-10px); }
                40% { transform: translateX(10px); }
                60% { transform: translateX(-8px); }
                80% { transform: translateX(5px); }
            }
            
            .game-over-screen {
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
                z-index: 20;
                text-align: center;
                padding: 30px;
            }
            
            .game-over-content {
                background: linear-gradient(45deg, #ff6b6b, #ee5a24);
                padding: 40px;
                border-radius: 20px;
                max-width: 400px;
                width: 100%;
            }
            
            .game-over-content h2 {
                font-family: 'Fredoka One', cursive;
                font-size: 2.5rem;
                margin-bottom: 20px;
            }
            
            @media (max-width: 768px) {
                .game-hud {
                    flex-direction: column;
                    gap: 15px;
                }
                
                .hud-left, .hud-right {
                    flex-direction: row;
                    justify-content: center;
                }
                
                .rocket-ship {
                    font-size: 3rem;
                }
                
                .problem-text {
                    font-size: 1.5rem;
                }
                
                .number-pad {
                    max-width: 250px;
                }
                
                .planets-row {
                    gap: 10px;
                }
                
                .planet-item {
                    font-size: 2rem;
                }
            }
        `;
        document.head.appendChild(style);
    }

    setupEventListeners() {
        // Number pad buttons
        this.container.querySelectorAll('.number-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const number = e.target.dataset.number;
                const action = e.target.dataset.action;
                
                if (number !== undefined) {
                    this.addToAnswer(number);
                } else if (action === 'clear') {
                    this.clearAnswer();
                } else if (action === 'submit') {
                    this.submitAnswer();
                }
            });
        });

        // Rocket interaction
        const rocket = this.container.querySelector('#rocketShip');
        if (rocket) {
            rocket.addEventListener('click', () => {
                this.rocketBoost();
            });
        }

        // Keyboard support
        document.addEventListener('keydown', (e) => {
            if (this.container.closest('.game-modal').style.display === 'none') return;
            
            if (e.key >= '0' && e.key <= '9') {
                this.addToAnswer(e.key);
            } else if (e.key === 'Enter') {
                this.submitAnswer();
            } else if (e.key === 'Backspace') {
                this.clearAnswer();
            }
        });
    }

    createStarField() {
        const starField = this.container.querySelector('.stars-field');
        if (!starField) return;
        
        for (let i = 0; i < 50; i++) {
            const star = document.createElement('div');
            star.className = 'star';
            star.style.left = `${Math.random() * 100}%`;
            star.style.top = `${Math.random() * 100}%`;
            star.style.animationDelay = `${Math.random() * 3}s`;
            star.style.animationDuration = `${2 + Math.random() * 2}s`;
            starField.appendChild(star);
        }
    }

    generatePlanetsHTML() {
        return this.planets.map((planet, index) => 
            `<div class="planet-item ${index < this.level ? 'reached' : ''}">${planet}</div>`
        ).join('');
    }

    generateProblem() {
        let num1, num2, operation, answer;
        
        // Adjust difficulty based on level
        const maxNum = Math.min(5 + (this.level * 3), 50);
        
        // Choose operation based on level
        const operations = ['+', '-'];
        if (this.level >= 3) operations.push('×');
        if (this.level >= 5) operations.push('÷');
        
        operation = operations[Math.floor(Math.random() * operations.length)];
        
        switch (operation) {
            case '+':
                num1 = Math.floor(Math.random() * maxNum) + 1;
                num2 = Math.floor(Math.random() * maxNum) + 1;
                answer = num1 + num2;
                break;
                
            case '-':
                num1 = Math.floor(Math.random() * maxNum) + 5;
                num2 = Math.floor(Math.random() * (num1 - 1)) + 1;
                answer = num1 - num2;
                break;
                
            case '×':
                num1 = Math.floor(Math.random() * Math.min(maxNum, 12)) + 1;
                num2 = Math.floor(Math.random() * Math.min(maxNum, 12)) + 1;
                answer = num1 * num2;
                break;
                
            case '÷':
                answer = Math.floor(Math.random() * Math.min(maxNum, 15)) + 1;
                num2 = Math.floor(Math.random() * Math.min(maxNum, 10)) + 1;
                num1 = answer * num2;
                break;
        }
        
        this.currentProblem = {
            num1,
            num2,
            operation,
            answer,
            text: `${num1} ${operation} ${num2} = ?`
        };
        
        this.displayProblem();
        this.clearAnswer();
    }

    displayProblem() {
        const problemText = this.container.querySelector('#problemText');
        if (problemText && this.currentProblem) {
            problemText.textContent = this.currentProblem.text;
        }
    }

    addToAnswer(digit) {
        const answerInput = this.container.querySelector('#answerInput');
        if (answerInput) {
            const currentValue = answerInput.value;
            if (currentValue.length < 4) { // Limit answer length
                answerInput.value = currentValue + digit;
            }
        }
    }

    clearAnswer() {
        const answerInput = this.container.querySelector('#answerInput');
        if (answerInput) {
            answerInput.value = '';
        }
    }

    submitAnswer() {
        const answerInput = this.container.querySelector('#answerInput');
        if (!answerInput || !this.currentProblem) return;
        
        const userAnswer = parseInt(answerInput.value);
        if (isNaN(userAnswer)) return;
        
        if (userAnswer === this.currentProblem.answer) {
            this.correctAnswer();
        } else {
            this.wrongAnswer();
        }
    }

    correctAnswer() {
        this.score += (10 + (this.level * 5) + this.streak);
        this.streak++;
        this.maxStreak = Math.max(this.maxStreak, this.streak);
        this.problemCount++;
        
        // Add fuel
        this.fuel = Math.min(this.fuel + 10, 100);
        
        this.updateUI();
        this.showCorrectAnimation();
        this.rocketBoost();
        
        // Check for level up
        if (this.problemCount >= (5 + this.level)) {
            this.levelUp();
        } else {
            setTimeout(() => {
                this.generateProblem();
            }, 1500);
        }
        
        // Achievements
        if (this.streak === 5) {
            this.showAchievement('🔥 Hot Streak! 5 in a row!');
            this.addAchievement('Math Streak', '5 correct answers in a row!', '🔥');
        } else if (this.streak === 10) {
            this.showAchievement('🌟 Super Streak! 10 in a row!');
            this.addAchievement('Super Brain', '10 correct answers in a row!', '🌟');
        }
    }

    wrongAnswer() {
        this.streak = 0;
        this.lives--;
        this.fuel = Math.max(this.fuel - 15, 0);
        
        this.updateUI();
        this.showWrongAnimation();
        
        if (this.lives <= 0 || this.fuel <= 0) {
            this.gameOver();
        } else {
            setTimeout(() => {
                this.generateProblem();
            }, 1500);
        }
    }

    levelUp() {
        this.level++;
        this.problemCount = 0;
        this.lives = Math.min(this.lives + 1, 5); // Bonus life
        this.fuel = 100; // Refuel
        
        this.updateUI();
        this.updatePlanetsDisplay();
        this.showAchievement(`🚀 Level ${this.level} Reached!`);
        
        if (this.level === 5) {
            this.addAchievement('Space Explorer', 'Reached level 5!', '🚀');
        } else if (this.level === 10) {
            this.addAchievement('Math Astronaut', 'Reached level 10!', '🛸');
        }
        
        setTimeout(() => {
            this.generateProblem();
        }, 2000);
    }

    gameOver() {
        const gameOverScreen = document.createElement('div');
        gameOverScreen.className = 'game-over-screen';
        gameOverScreen.innerHTML = `
            <div class="game-over-content">
                <h2>Mission Complete! 🛸</h2>
                <p><strong>Final Level:</strong> ${this.level}</p>
                <p><strong>Total Score:</strong> ${this.score}</p>
                <p><strong>Best Streak:</strong> ${this.maxStreak}</p>
                <p>Your rocket ran out of fuel, but you've learned so much! 🌟</p>
                <button class="space-btn" onclick="this.restart()">🚀 New Mission</button>
            </div>
        `;
        
        this.container.appendChild(gameOverScreen);
        
        // Add final achievement
        if (this.score > 100) {
            this.addAchievement('Space Cadet', `Scored ${this.score} points!`, '🏆');
        }
    }

    rocketBoost() {
        const rocket = this.container.querySelector('#rocketShip');
        if (!rocket) return;
        
        rocket.style.animation = 'none';
        rocket.style.transform = 'scale(1.3) rotate(10deg)';
        
        setTimeout(() => {
            rocket.style.animation = 'rocketFloat 3s ease-in-out infinite';
            rocket.style.transform = '';
        }, 500);
    }

    showCorrectAnimation() {
        this.container.classList.add('correct-animation');
        setTimeout(() => {
            this.container.classList.remove('correct-animation');
        }, 1000);
    }

    showWrongAnimation() {
        this.container.classList.add('wrong-animation');
        setTimeout(() => {
            this.container.classList.remove('wrong-animation');
        }, 800);
    }

    updateUI() {
        // Update score
        const scoreEl = this.container.querySelector('#math-score');
        if (scoreEl) scoreEl.textContent = this.score;
        
        // Update level
        const levelEl = this.container.querySelector('#math-level');
        if (levelEl) levelEl.textContent = this.level;
        
        // Update lives
        const livesEl = this.container.querySelector('#math-lives');
        if (livesEl) livesEl.textContent = this.lives;
        
        // Update fuel
        const fuelFill = this.container.querySelector('#fuelFill');
        if (fuelFill) {
            fuelFill.style.width = `${this.fuel}%`;
        }
        
        // Update streak
        const streakEl = this.container.querySelector('#streakDisplay');
        if (streakEl) {
            streakEl.textContent = this.streak > 0 ? `🔥 Streak: ${this.streak}` : '';
        }
    }

    updatePlanetsDisplay() {
        const planetsRow = this.container.querySelector('#planetsRow');
        if (planetsRow) {
            planetsRow.innerHTML = this.generatePlanetsHTML();
        }
    }

    showAchievement(message) {
        const zone = this.container.querySelector('#achievementZone');
        if (!zone) return;
        
        zone.innerHTML = `<div class="space-achievement">${message}</div>`;
        
        setTimeout(() => {
            zone.innerHTML = '';
        }, 3000);
    }

    getHint() {
        if (!this.currentProblem) return;
        
        const { num1, num2, operation, answer } = this.currentProblem;
        let hint = '';
        
        switch (operation) {
            case '+':
                hint = `💡 Try counting up from ${num1}...`;
                break;
            case '-':
                hint = `💡 Try counting down from ${num1}...`;
                break;
            case '×':
                hint = `💡 Think: ${num1} groups of ${num2}...`;
                break;
            case '÷':
                hint = `💡 How many ${num2}s fit into ${num1}?`;
                break;
        }
        
        this.showAchievement(hint);
        this.fuel = Math.max(this.fuel - 5, 0);
        this.updateUI();
    }

    skipProblem() {
        this.fuel = Math.max(this.fuel - 20, 0);
        this.streak = 0;
        this.updateUI();
        
        if (this.fuel <= 0) {
            this.gameOver();
        } else {
            this.generateProblem();
        }
    }

    restart() {
        this.level = 1;
        this.score = 0;
        this.lives = 3;
        this.fuel = 100;
        this.problemCount = 0;
        this.streak = 0;
        this.maxStreak = 0;
        
        this.createGameInterface();
        this.setupEventListeners();
        this.createStarField();
        this.generateProblem();
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
window.MathAdventure = MathAdventure;