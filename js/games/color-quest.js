// Rainbow Color Quest - Creative Color Learning Adventure!
class ColorQuest {
    constructor(container) {
        this.container = container;
        this.level = 1;
        this.score = 0;
        this.lives = 3;
        this.creativity = 100;
        this.currentChallenge = null;
        this.playerCanvas = null;
        this.ctx = null;
        this.isDrawing = false;
        this.currentColor = '#ff6b6b';
        this.brushSize = 5;
        this.challengesCompleted = 0;
        this.streak = 0;
        
        // Color data
        this.colors = {
            primary: {
                red: '#ff0000',
                blue: '#0000ff',
                yellow: '#ffff00'
            },
            secondary: {
                orange: '#ffa500',
                green: '#00ff00',
                purple: '#800080'
            },
            tertiary: {
                pink: '#ffc0cb',
                brown: '#8b4513',
                gray: '#808080',
                white: '#ffffff',
                black: '#000000'
            }
        };
        
        this.colorMixing = {
            'red + blue': 'purple',
            'blue + red': 'purple',
            'red + yellow': 'orange',
            'yellow + red': 'orange',
            'blue + yellow': 'green',
            'yellow + blue': 'green'
        };
        
        this.challengeTypes = ['colorMatch', 'colorMix', 'freeDrawing', 'patternCreate', 'colorName'];
        this.mascot = '🎨';
        this.mascotMoods = ['🎨', '🌈', '✨', '🖌️', '🎭', '🌟', '💫', '🦄'];
        
        this.init();
    }

    init() {
        this.createGameInterface();
        this.setupCanvas();
        this.generateChallenge();
    }

    createGameInterface() {
        this.container.innerHTML = `
            <div class="color-quest-game">
                <div class="rainbow-background">
                    <div class="floating-colors"></div>
                    <div class="color-particles"></div>
                </div>
                
                <div class="art-studio-hud">
                    <div class="studio-left">
                        <div class="art-stat">
                            <span class="stat-icon">🎨</span>
                            <span class="stat-label">Level</span>
                            <span class="stat-number" id="color-level">${this.level}</span>
                        </div>
                        <div class="art-stat">
                            <span class="stat-icon">⭐</span>
                            <span class="stat-label">Score</span>
                            <span class="stat-number" id="color-score">${this.score}</span>
                        </div>
                    </div>
                    
                    <div class="studio-center">
                        <div class="artist-mascot" id="artistMascot">${this.mascot}</div>
                        <div class="artist-bubble" id="artistBubble">
                            Welcome to the Rainbow Studio! 🌈
                        </div>
                    </div>
                    
                    <div class="studio-right">
                        <div class="art-stat">
                            <span class="stat-icon">❤️</span>
                            <span class="stat-label">Lives</span>
                            <span class="stat-number" id="color-lives">${this.lives}</span>
                        </div>
                        <div class="creativity-meter">
                            <span class="stat-icon">💡</span>
                            <span class="stat-label">Creativity</span>
                            <div class="creativity-bar">
                                <div class="creativity-fill" id="creativityFill" style="width: ${this.creativity}%"></div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="art-easel">
                    <div class="challenge-board">
                        <h3 id="challengeTitle">🎯 Color Challenge</h3>
                        <div class="challenge-description" id="challengeDescription">
                            Get ready to create something amazing!
                        </div>
                        <div class="challenge-target" id="challengeTarget">
                            <!-- Challenge specific content -->
                        </div>
                    </div>
                    
                    <div class="canvas-area">
                        <div class="canvas-wrapper">
                            <canvas id="playerCanvas" width="400" height="300"></canvas>
                            <div class="canvas-overlay" id="canvasOverlay"></div>
                        </div>
                        
                        <div class="art-tools">
                            <div class="color-palette" id="colorPalette">
                                <h4>🎨 Colors</h4>
                                <div class="palette-grid">
                                    ${this.generateColorPaletteHTML()}
                                </div>
                            </div>
                            
                            <div class="brush-tools">
                                <h4>🖌️ Brushes</h4>
                                <div class="brush-sizes">
                                    <button class="brush-btn ${this.brushSize === 3 ? 'active' : ''}" data-size="3">Small</button>
                                    <button class="brush-btn ${this.brushSize === 5 ? 'active' : ''}" data-size="5">Medium</button>
                                    <button class="brush-btn ${this.brushSize === 8 ? 'active' : ''}" data-size="8">Large</button>
                                </div>
                                <button class="tool-btn" id="clearCanvas">🗑️ Clear</button>
                                <button class="tool-btn" id="undoButton">↶ Undo</button>
                            </div>
                        </div>
                    </div>
                    
                    <div class="challenge-controls">
                        <button class="art-btn" id="submitArt" onclick="this.submitArt()">
                            🌟 Submit Art
                        </button>
                        <button class="art-btn secondary" id="hintBtn" onclick="this.getHint()">
                            💡 Hint
                        </button>
                        <button class="art-btn" id="newChallenge" onclick="this.generateChallenge()">
                            🎲 New Challenge
                        </button>
                        <button class="art-btn danger" id="restartBtn" onclick="this.restart()">
                            🔄 Restart
                        </button>
                    </div>
                </div>
                
                <div class="color-learning-panel" id="colorLearningPanel">
                    <h4>🌈 Color Learning</h4>
                    <div class="color-facts" id="colorFacts">
                        <p>Did you know? Red + Blue = Purple! 🟣</p>
                    </div>
                </div>
                
                <div class="achievements-gallery" id="achievementsGallery"></div>
                
                <div class="progress-section">
                    <div class="challenge-progress">
                        <span>Challenges to next level: ${5 - this.challengesCompleted}/5</span>
                        <div class="rainbow-progress-bar">
                            <div class="rainbow-progress-fill" id="progressFill" style="width: ${(this.challengesCompleted / 5) * 100}%"></div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        this.addGameStyles();
        this.setupEventListeners();
        this.createFloatingColors();
    }

    addGameStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .color-quest-game {
                position: relative;
                min-height: 800px;
                background: linear-gradient(45deg, #ff9a9e 0%, #fecfef 25%, #fecfef 50%, #a8edea 75%, #fed6e3 100%);
                border-radius: 15px;
                overflow: hidden;
                color: #333;
                font-family: 'Nunito', sans-serif;
            }
            
            .rainbow-background {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                z-index: 1;
            }
            
            .floating-colors {
                position: absolute;
                width: 100%;
                height: 100%;
                background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="20" cy="20" r="3" fill="red" opacity="0.3"/><circle cx="80" cy="30" r="4" fill="blue" opacity="0.3"/><circle cx="30" cy="70" r="3.5" fill="yellow" opacity="0.3"/><circle cx="70" cy="80" r="2.5" fill="green" opacity="0.3"/></svg>') repeat;
                animation: floatColors 20s linear infinite;
                opacity: 0.6;
            }
            
            @keyframes floatColors {
                from { transform: translateY(0) rotate(0deg); }
                to { transform: translateY(-100px) rotate(360deg); }
            }
            
            .color-particles {
                position: absolute;
                width: 100%;
                height: 100%;
                pointer-events: none;
                z-index: 2;
            }
            
            .color-particle {
                position: absolute;
                width: 6px;
                height: 6px;
                border-radius: 50%;
                animation: particleFloat 6s ease-in-out infinite;
                pointer-events: none;
            }
            
            @keyframes particleFloat {
                0%, 100% { opacity: 0; transform: translateY(20px) scale(0.5); }
                50% { opacity: 0.8; transform: translateY(-30px) scale(1.2); }
            }
            
            .art-studio-hud {
                position: relative;
                z-index: 10;
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 20px;
                background: rgba(255, 255, 255, 0.9);
                backdrop-filter: blur(10px);
                border-bottom: 3px solid rgba(255, 255, 255, 0.5);
            }
            
            .studio-left, .studio-right {
                display: flex;
                flex-direction: column;
                gap: 10px;
            }
            
            .art-stat {
                display: flex;
                flex-direction: column;
                align-items: center;
                background: linear-gradient(45deg, rgba(255, 255, 255, 0.8), rgba(255, 255, 255, 0.6));
                padding: 10px 15px;
                border-radius: 15px;
                box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
                border: 2px solid rgba(255, 255, 255, 0.5);
            }
            
            .stat-icon {
                font-size: 1.2rem;
                margin-bottom: 5px;
            }
            
            .stat-label {
                font-size: 0.8rem;
                color: #666;
                font-weight: 600;
            }
            
            .stat-number {
                font-size: 1.4rem;
                font-weight: 700;
                font-family: 'Fredoka One', cursive;
                color: #333;
            }
            
            .studio-center {
                text-align: center;
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 10px;
            }
            
            .artist-mascot {
                font-size: 4rem;
                animation: artistBounce 3s ease-in-out infinite;
                cursor: pointer;
                transition: transform 0.3s ease;
                filter: drop-shadow(0 0 10px rgba(255, 255, 255, 0.8));
            }
            
            .artist-mascot:hover {
                transform: scale(1.2) rotate(15deg);
            }
            
            @keyframes artistBounce {
                0%, 100% { transform: translateY(0) rotate(0deg); }
                25% { transform: translateY(-10px) rotate(5deg); }
                50% { transform: translateY(-5px) rotate(-3deg); }
                75% { transform: translateY(-8px) rotate(8deg); }
            }
            
            .artist-bubble {
                background: rgba(255, 255, 255, 0.95);
                color: #333;
                padding: 12px 18px;
                border-radius: 20px;
                font-size: 1rem;
                font-weight: 600;
                max-width: 220px;
                position: relative;
                box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
                border: 2px solid rgba(255, 255, 255, 0.8);
            }
            
            .artist-bubble::before {
                content: '';
                position: absolute;
                bottom: -10px;
                left: 50%;
                transform: translateX(-50%);
                width: 0;
                height: 0;
                border-left: 10px solid transparent;
                border-right: 10px solid transparent;
                border-top: 10px solid rgba(255, 255, 255, 0.95);
            }
            
            .creativity-meter {
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 5px;
            }
            
            .creativity-bar {
                width: 80px;
                height: 20px;
                background: rgba(255, 255, 255, 0.5);
                border-radius: 10px;
                overflow: hidden;
                border: 2px solid rgba(255, 255, 255, 0.8);
            }
            
            .creativity-fill {
                height: 100%;
                background: linear-gradient(90deg, #ff6b6b 0%, #feca57 25%, #48dbfb 50%, #0abde3 75%, #ff9ff3 100%);
                border-radius: 8px;
                transition: width 0.5s ease;
                animation: creativityPulse 3s ease-in-out infinite;
            }
            
            @keyframes creativityPulse {
                0%, 100% { filter: brightness(1) saturate(1); }
                50% { filter: brightness(1.2) saturate(1.3); }
            }
            
            .art-easel {
                position: relative;
                z-index: 10;
                background: rgba(255, 255, 255, 0.95);
                margin: 20px;
                border-radius: 20px;
                padding: 25px;
                box-shadow: 0 15px 35px rgba(0, 0, 0, 0.2);
                backdrop-filter: blur(10px);
            }
            
            .challenge-board {
                text-align: center;
                margin-bottom: 25px;
                padding: 20px;
                background: linear-gradient(45deg, #667eea, #764ba2);
                color: white;
                border-radius: 15px;
                box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
            }
            
            .challenge-board h3 {
                font-family: 'Fredoka One', cursive;
                font-size: 1.8rem;
                margin-bottom: 10px;
            }
            
            .challenge-description {
                font-size: 1.1rem;
                font-weight: 600;
                margin-bottom: 15px;
                opacity: 0.9;
            }
            
            .challenge-target {
                background: rgba(255, 255, 255, 0.2);
                border-radius: 10px;
                padding: 15px;
                backdrop-filter: blur(5px);
            }
            
            .canvas-area {
                display: flex;
                gap: 20px;
                margin-bottom: 25px;
                flex-wrap: wrap;
            }
            
            .canvas-wrapper {
                position: relative;
                border: 5px solid #fff;
                border-radius: 15px;
                box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
                background: white;
                overflow: hidden;
            }
            
            #playerCanvas {
                display: block;
                cursor: crosshair;
                border-radius: 10px;
            }
            
            .canvas-overlay {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                pointer-events: none;
                z-index: 5;
            }
            
            .art-tools {
                display: flex;
                flex-direction: column;
                gap: 20px;
                min-width: 200px;
            }
            
            .color-palette {
                background: rgba(255, 255, 255, 0.8);
                border-radius: 15px;
                padding: 15px;
                box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
            }
            
            .color-palette h4 {
                font-family: 'Fredoka One', cursive;
                color: #333;
                margin-bottom: 10px;
                text-align: center;
            }
            
            .palette-grid {
                display: grid;
                grid-template-columns: repeat(4, 1fr);
                gap: 8px;
            }
            
            .color-swatch {
                width: 35px;
                height: 35px;
                border-radius: 50%;
                border: 3px solid white;
                cursor: pointer;
                transition: all 0.3s ease;
                box-shadow: 0 3px 10px rgba(0, 0, 0, 0.2);
            }
            
            .color-swatch:hover {
                transform: scale(1.1);
                box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
            }
            
            .color-swatch.active {
                border-color: #333;
                transform: scale(1.2);
                box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.8), 0 0 0 6px #333;
            }
            
            .brush-tools {
                background: rgba(255, 255, 255, 0.8);
                border-radius: 15px;
                padding: 15px;
                box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
            }
            
            .brush-tools h4 {
                font-family: 'Fredoka One', cursive;
                color: #333;
                margin-bottom: 10px;
                text-align: center;
            }
            
            .brush-sizes {
                display: flex;
                gap: 5px;
                margin-bottom: 10px;
                justify-content: center;
            }
            
            .brush-btn {
                padding: 8px 12px;
                border: none;
                border-radius: 15px;
                font-size: 0.9rem;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.3s ease;
                background: linear-gradient(45deg, #48dbfb, #0abde3);
                color: white;
                box-shadow: 0 3px 10px rgba(0, 0, 0, 0.2);
            }
            
            .brush-btn:hover {
                transform: translateY(-2px);
                box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
            }
            
            .brush-btn.active {
                background: linear-gradient(45deg, #feca57, #ff9ff3);
                transform: scale(1.05);
            }
            
            .tool-btn {
                padding: 8px 12px;
                border: none;
                border-radius: 15px;
                font-size: 0.9rem;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.3s ease;
                background: linear-gradient(45deg, #ff6b6b, #ee5a24);
                color: white;
                box-shadow: 0 3px 10px rgba(0, 0, 0, 0.2);
                margin: 2px;
                width: calc(50% - 4px);
            }
            
            .tool-btn:hover {
                transform: translateY(-2px);
                box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
            }
            
            .challenge-controls {
                display: flex;
                justify-content: center;
                gap: 10px;
                flex-wrap: wrap;
            }
            
            .art-btn {
                padding: 12px 20px;
                border: none;
                border-radius: 25px;
                font-size: 1.1rem;
                font-weight: 700;
                cursor: pointer;
                transition: all 0.3s ease;
                background: linear-gradient(45deg, #667eea, #764ba2);
                color: white;
                box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
            }
            
            .art-btn:hover {
                transform: translateY(-3px);
                box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
            }
            
            .art-btn.secondary {
                background: linear-gradient(45deg, #feca57, #ff9ff3);
            }
            
            .art-btn.danger {
                background: linear-gradient(45deg, #ff6b6b, #ee5a24);
            }
            
            .color-learning-panel {
                position: relative;
                z-index: 10;
                background: rgba(255, 255, 255, 0.9);
                margin: 20px;
                border-radius: 15px;
                padding: 20px;
                text-align: center;
                box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
            }
            
            .color-learning-panel h4 {
                font-family: 'Fredoka One', cursive;
                color: #667eea;
                margin-bottom: 15px;
                font-size: 1.4rem;
            }
            
            .color-facts p {
                font-size: 1.1rem;
                color: #333;
                font-weight: 600;
                line-height: 1.6;
            }
            
            .achievements-gallery {
                position: relative;
                z-index: 15;
                padding: 15px 20px;
                text-align: center;
                min-height: 50px;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            
            .color-achievement {
                background: linear-gradient(45deg, #ff9a9e, #fecfef);
                color: white;
                padding: 12px 20px;
                border-radius: 15px;
                animation: colorAchievement 3s ease-in-out;
                box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
                border: 2px solid rgba(255, 255, 255, 0.5);
                font-weight: 600;
                text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
            }
            
            @keyframes colorAchievement {
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
            
            .challenge-progress span {
                color: #333;
                font-weight: 700;
                margin-bottom: 10px;
                display: block;
                background: rgba(255, 255, 255, 0.8);
                padding: 8px 15px;
                border-radius: 15px;
                display: inline-block;
            }
            
            .rainbow-progress-bar {
                width: 100%;
                height: 15px;
                background: rgba(255, 255, 255, 0.5);
                border-radius: 8px;
                overflow: hidden;
                border: 2px solid rgba(255, 255, 255, 0.8);
                margin-top: 10px;
            }
            
            .rainbow-progress-fill {
                height: 100%;
                background: linear-gradient(90deg, #ff0000 0%, #ff8000 16.66%, #ffff00 33.33%, #00ff00 50%, #0080ff 66.66%, #8000ff 83.33%, #ff0080 100%);
                border-radius: 6px;
                transition: width 0.5s ease;
                animation: rainbowFlow 3s ease-in-out infinite;
            }
            
            @keyframes rainbowFlow {
                0%, 100% { filter: brightness(1) saturate(1); }
                50% { filter: brightness(1.2) saturate(1.4); }
            }
            
            .correct-art-animation {
                animation: correctArtCelebration 2s ease-out;
            }
            
            @keyframes correctArtCelebration {
                0% { transform: scale(1); filter: brightness(1); }
                25% { transform: scale(1.02); filter: brightness(1.3) hue-rotate(90deg); }
                50% { transform: scale(1.05); filter: brightness(1.5) hue-rotate(180deg); }
                75% { transform: scale(1.02); filter: brightness(1.3) hue-rotate(270deg); }
                100% { transform: scale(1); filter: brightness(1) hue-rotate(360deg); }
            }
            
            .wrong-art-animation {
                animation: wrongArtShake 1s ease-out;
            }
            
            @keyframes wrongArtShake {
                0%, 100% { transform: translateX(0); }
                20% { transform: translateX(-8px); }
                40% { transform: translateX(8px); }
                60% { transform: translateX(-6px); }
                80% { transform: translateX(4px); }
            }
            
            .game-over-art {
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
                z-index: 30;
                text-align: center;
                padding: 30px;
            }
            
            .art-game-over-content {
                background: linear-gradient(45deg, #667eea, #764ba2);
                padding: 40px;
                border-radius: 20px;
                max-width: 450px;
                width: 100%;
                color: white;
                box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5);
            }
            
            .art-game-over-content h2 {
                font-family: 'Fredoka One', cursive;
                font-size: 2.5rem;
                margin-bottom: 20px;
            }
            
            /* Color mixing challenge specific styles */
            .color-mixer {
                display: flex;
                justify-content: space-around;
                align-items: center;
                flex-wrap: wrap;
                gap: 15px;
                margin: 15px 0;
            }
            
            .mix-color {
                width: 60px;
                height: 60px;
                border-radius: 50%;
                border: 4px solid white;
                box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
                cursor: pointer;
                transition: transform 0.3s ease;
            }
            
            .mix-color:hover {
                transform: scale(1.1);
            }
            
            .mix-result {
                width: 80px;
                height: 80px;
                border-radius: 50%;
                border: 5px solid white;
                box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
                background: #f0f0f0;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 2rem;
            }
            
            /* Pattern challenge styles */
            .pattern-grid {
                display: grid;
                grid-template-columns: repeat(4, 1fr);
                gap: 10px;
                max-width: 200px;
                margin: 15px auto;
            }
            
            .pattern-cell {
                width: 40px;
                height: 40px;
                border: 2px solid white;
                border-radius: 8px;
                cursor: pointer;
                transition: transform 0.2s ease;
                background: #f0f0f0;
            }
            
            .pattern-cell:hover {
                transform: scale(1.1);
            }
            
            .pattern-cell.filled {
                border-color: #333;
                transform: scale(1.05);
            }
            
            @media (max-width: 768px) {
                .art-studio-hud {
                    flex-direction: column;
                    gap: 15px;
                }
                
                .studio-left, .studio-right {
                    flex-direction: row;
                    justify-content: center;
                }
                
                .artist-mascot {
                    font-size: 3rem;
                }
                
                .artist-bubble {
                    max-width: 180px;
                    font-size: 0.9rem;
                }
                
                .canvas-area {
                    flex-direction: column;
                    align-items: center;
                }
                
                #playerCanvas {
                    width: 300px;
                    height: 225px;
                }
                
                .art-tools {
                    width: 100%;
                    max-width: 320px;
                }
                
                .palette-grid {
                    grid-template-columns: repeat(6, 1fr);
                }
                
                .challenge-controls {
                    gap: 8px;
                }
                
                .art-btn {
                    padding: 10px 16px;
                    font-size: 1rem;
                }
            }
        `;
        document.head.appendChild(style);
    }

    generateColorPaletteHTML() {
        const allColors = [
            ...Object.values(this.colors.primary),
            ...Object.values(this.colors.secondary),
            ...Object.values(this.colors.tertiary)
        ];
        
        return allColors.map((color, index) =>
            `<div class="color-swatch ${index === 0 ? 'active' : ''}" 
                  style="background-color: ${color}" 
                  data-color="${color}"
                  title="${this.getColorName(color)}"></div>`
        ).join('');
    }

    setupEventListeners() {
        // Color palette
        this.container.querySelectorAll('.color-swatch').forEach(swatch => {
            swatch.addEventListener('click', (e) => {
                this.selectColor(e.target.dataset.color, e.target);
            });
        });

        // Brush sizes
        this.container.querySelectorAll('.brush-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.selectBrushSize(parseInt(e.target.dataset.size), e.target);
            });
        });

        // Canvas tools
        const clearBtn = this.container.querySelector('#clearCanvas');
        if (clearBtn) {
            clearBtn.addEventListener('click', () => {
                this.clearCanvas();
            });
        }

        const undoBtn = this.container.querySelector('#undoButton');
        if (undoBtn) {
            undoBtn.addEventListener('click', () => {
                this.undoLastAction();
            });
        }

        // Artist mascot interaction
        const mascot = this.container.querySelector('#artistMascot');
        if (mascot) {
            mascot.addEventListener('click', () => {
                this.mascotInteraction();
            });
        }
    }

    setupCanvas() {
        this.playerCanvas = this.container.querySelector('#playerCanvas');
        if (!this.playerCanvas) return;
        
        this.ctx = this.playerCanvas.getContext('2d');
        this.canvasHistory = [];
        this.saveCanvasState();
        
        // Mouse events
        this.playerCanvas.addEventListener('mousedown', (e) => {
            this.startDrawing(e);
        });
        
        this.playerCanvas.addEventListener('mousemove', (e) => {
            this.draw(e);
        });
        
        this.playerCanvas.addEventListener('mouseup', () => {
            this.stopDrawing();
        });
        
        this.playerCanvas.addEventListener('mouseout', () => {
            this.stopDrawing();
        });
        
        // Touch events for mobile
        this.playerCanvas.addEventListener('touchstart', (e) => {
            e.preventDefault();
            const touch = e.touches[0];
            const mouseEvent = new MouseEvent('mousedown', {
                clientX: touch.clientX,
                clientY: touch.clientY
            });
            this.playerCanvas.dispatchEvent(mouseEvent);
        });
        
        this.playerCanvas.addEventListener('touchmove', (e) => {
            e.preventDefault();
            const touch = e.touches[0];
            const mouseEvent = new MouseEvent('mousemove', {
                clientX: touch.clientX,
                clientY: touch.clientY
            });
            this.playerCanvas.dispatchEvent(mouseEvent);
        });
        
        this.playerCanvas.addEventListener('touchend', (e) => {
            e.preventDefault();
            const mouseEvent = new MouseEvent('mouseup', {});
            this.playerCanvas.dispatchEvent(mouseEvent);
        });
    }

    createFloatingColors() {
        const colorsContainer = this.container.querySelector('.color-particles');
        if (!colorsContainer) return;
        
        setInterval(() => {
            if (Math.random() < 0.4) {
                this.createColorParticle();
            }
        }, 1000);
    }

    createColorParticle() {
        const colorsContainer = this.container.querySelector('.color-particles');
        if (!colorsContainer) return;
        
        const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#feca57', '#ff9ff3', '#54a0ff'];
        const particle = document.createElement('div');
        particle.className = 'color-particle';
        particle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.top = `${Math.random() * 100}%`;
        particle.style.animationDelay = `${Math.random() * 3}s`;
        
        colorsContainer.appendChild(particle);
        
        setTimeout(() => {
            particle.remove();
        }, 6000);
    }

    generateChallenge() {
        const challengeType = this.challengeTypes[Math.floor(Math.random() * this.challengeTypes.length)];
        
        switch (challengeType) {
            case 'colorMatch':
                this.createColorMatchChallenge();
                break;
            case 'colorMix':
                this.createColorMixChallenge();
                break;
            case 'freeDrawing':
                this.createFreeDrawingChallenge();
                break;
            case 'patternCreate':
                this.createPatternChallenge();
                break;
            case 'colorName':
                this.createColorNameChallenge();
                break;
        }
        
        this.clearCanvas();
        this.updateColorFacts();
    }

    createColorMatchChallenge() {
        const colors = Object.values(this.colors.primary);
        const targetColor = colors[Math.floor(Math.random() * colors.length)];
        
        this.currentChallenge = {
            type: 'colorMatch',
            targetColor: targetColor,
            colorName: this.getColorName(targetColor)
        };
        
        const titleEl = this.container.querySelector('#challengeTitle');
        const descEl = this.container.querySelector('#challengeDescription');
        const targetEl = this.container.querySelector('#challengeTarget');
        
        if (titleEl) titleEl.textContent = '🎨 Color Match Challenge';
        if (descEl) descEl.textContent = `Paint with the ${this.currentChallenge.colorName} color!`;
        if (targetEl) {
            targetEl.innerHTML = `
                <div style="display: flex; align-items: center; justify-content: center; gap: 15px;">
                    <span style="font-size: 1.2rem; font-weight: 700;">Target Color:</span>
                    <div style="width: 60px; height: 60px; background-color: ${targetColor}; 
                         border-radius: 50%; border: 4px solid white; 
                         box-shadow: 0 5px 15px rgba(0,0,0,0.3);"></div>
                </div>
            `;
        }
        
        this.artistSpeak(`Let's paint with ${this.currentChallenge.colorName}! 🎨`);
    }

    createColorMixChallenge() {
        const mixOptions = Object.keys(this.colorMixing);
        const selectedMix = mixOptions[Math.floor(Math.random() * mixOptions.length)];
        const [color1, color2] = selectedMix.split(' + ');
        const resultColor = this.colorMixing[selectedMix];
        
        this.currentChallenge = {
            type: 'colorMix',
            color1: this.getColorHex(color1),
            color2: this.getColorHex(color2),
            resultColor: this.getColorHex(resultColor),
            color1Name: color1,
            color2Name: color2,
            resultName: resultColor
        };
        
        const titleEl = this.container.querySelector('#challengeTitle');
        const descEl = this.container.querySelector('#challengeDescription');
        const targetEl = this.container.querySelector('#challengeTarget');
        
        if (titleEl) titleEl.textContent = '🌈 Color Mixing Challenge';
        if (descEl) descEl.textContent = `Mix ${color1} and ${color2} to make ${resultColor}!`;
        if (targetEl) {
            targetEl.innerHTML = `
                <div class="color-mixer">
                    <div class="mix-color" style="background-color: ${this.currentChallenge.color1}"></div>
                    <span style="font-size: 1.5rem; font-weight: 700;">+</span>
                    <div class="mix-color" style="background-color: ${this.currentChallenge.color2}"></div>
                    <span style="font-size: 1.5rem; font-weight: 700;">=</span>
                    <div class="mix-result">?</div>
                </div>
                <p style="margin-top: 10px; font-weight: 600;">Paint with the result color!</p>
            `;
        }
        
        this.artistSpeak(`Mix ${color1} and ${color2} to create magic! ✨`);
    }

    createFreeDrawingChallenge() {
        const subjects = [
            { name: 'rainbow', emoji: '🌈', hint: 'Draw a colorful arc in the sky!' },
            { name: 'flower', emoji: '🌸', hint: 'Draw a beautiful flower with petals!' },
            { name: 'house', emoji: '🏠', hint: 'Draw a cozy house with windows!' },
            { name: 'sun', emoji: '☀️', hint: 'Draw a bright shining sun!' },
            { name: 'tree', emoji: '🌳', hint: 'Draw a tall tree with leaves!' }
        ];
        
        const subject = subjects[Math.floor(Math.random() * subjects.length)];
        
        this.currentChallenge = {
            type: 'freeDrawing',
            subject: subject.name,
            emoji: subject.emoji,
            hint: subject.hint
        };
        
        const titleEl = this.container.querySelector('#challengeTitle');
        const descEl = this.container.querySelector('#challengeDescription');
        const targetEl = this.container.querySelector('#challengeTarget');
        
        if (titleEl) titleEl.textContent = '✏️ Creative Drawing Challenge';
        if (descEl) descEl.textContent = this.currentChallenge.hint;
        if (targetEl) {
            targetEl.innerHTML = `
                <div style="text-align: center;">
                    <div style="font-size: 4rem; margin-bottom: 10px;">${subject.emoji}</div>
                    <p style="font-size: 1.2rem; font-weight: 700;">Draw a ${subject.name}!</p>
                    <p style="opacity: 0.8;">Use your creativity and any colors you like!</p>
                </div>
            `;
        }
        
        this.artistSpeak(`Time to draw a ${subject.name}! Be creative! 🎨`);
    }

    createPatternChallenge() {
        const patterns = [
            { name: 'checkerboard', colors: ['#ff0000', '#ffffff'] },
            { name: 'stripes', colors: ['#0000ff', '#ffff00'] },
            { name: 'dots', colors: ['#00ff00', '#ffffff'] }
        ];
        
        const pattern = patterns[Math.floor(Math.random() * patterns.length)];
        
        this.currentChallenge = {
            type: 'patternCreate',
            pattern: pattern.name,
            colors: pattern.colors
        };
        
        const titleEl = this.container.querySelector('#challengeTitle');
        const descEl = this.container.querySelector('#challengeDescription');
        const targetEl = this.container.querySelector('#challengeTarget');
        
        if (titleEl) titleEl.textContent = '🔲 Pattern Challenge';
        if (descEl) descEl.textContent = `Create a ${pattern.name} pattern!`;
        if (targetEl) {
            targetEl.innerHTML = `
                <div style="text-align: center;">
                    <p style="font-size: 1.2rem; font-weight: 700; margin-bottom: 15px;">
                        Create a ${pattern.name} pattern using these colors:
                    </p>
                    <div style="display: flex; justify-content: center; gap: 10px;">
                        ${pattern.colors.map(color => 
                            `<div style="width: 40px; height: 40px; background-color: ${color}; 
                             border-radius: 50%; border: 3px solid white; 
                             box-shadow: 0 3px 10px rgba(0,0,0,0.2);"></div>`
                        ).join('')}
                    </div>
                </div>
            `;
        }
        
        this.artistSpeak(`Let's create a ${pattern.name} pattern! 🎯`);
    }

    createColorNameChallenge() {
        const colorNames = ['red', 'blue', 'yellow', 'green', 'orange', 'purple'];
        const targetColorName = colorNames[Math.floor(Math.random() * colorNames.length)];
        const targetColor = this.getColorHex(targetColorName);
        
        this.currentChallenge = {
            type: 'colorName',
            colorName: targetColorName,
            targetColor: targetColor
        };
        
        const titleEl = this.container.querySelector('#challengeTitle');
        const descEl = this.container.querySelector('#challengeDescription');
        const targetEl = this.container.querySelector('#challengeTarget');
        
        if (titleEl) titleEl.textContent = '📝 Color Name Challenge';
        if (descEl) descEl.textContent = `I'm thinking of a color... can you guess which one?`;
        if (targetEl) {
            targetEl.innerHTML = `
                <div style="text-align: center;">
                    <p style="font-size: 1.8rem; font-weight: 700; margin-bottom: 15px;">
                        "${targetColorName.toUpperCase()}"
                    </p>
                    <p style="opacity: 0.8;">Paint with this color to show you know it! 🎨</p>
                </div>
            `;
        }
        
        this.artistSpeak(`Show me the color "${targetColorName}"! 🌈`);
    }

    selectColor(color, element) {
        this.currentColor = color;
        
        // Update active color swatch
        this.container.querySelectorAll('.color-swatch').forEach(swatch => {
            swatch.classList.remove('active');
        });
        element.classList.add('active');
        
        this.playColorSound();
        this.createColorParticle();
    }

    selectBrushSize(size, element) {
        this.brushSize = size;
        
        // Update active brush button
        this.container.querySelectorAll('.brush-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        element.classList.add('active');
        
        this.artistSpeak(`Brush size changed to ${size === 3 ? 'small' : size === 5 ? 'medium' : 'large'}! 🖌️`);
    }

    startDrawing(e) {
        this.isDrawing = true;
        this.saveCanvasState();
        this.draw(e);
    }

    draw(e) {
        if (!this.isDrawing) return;
        
        const rect = this.playerCanvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        this.ctx.lineWidth = this.brushSize;
        this.ctx.lineCap = 'round';
        this.ctx.strokeStyle = this.currentColor;
        
        this.ctx.lineTo(x, y);
        this.ctx.stroke();
        this.ctx.beginPath();
        this.ctx.moveTo(x, y);
        
        // Add some creativity points
        this.creativity = Math.min(this.creativity + 0.5, 100);
        this.updateUI();
    }

    stopDrawing() {
        if (this.isDrawing) {
            this.isDrawing = false;
            this.ctx.beginPath();
        }
    }

    clearCanvas() {
        if (this.ctx) {
            this.ctx.clearRect(0, 0, this.playerCanvas.width, this.playerCanvas.height);
            this.saveCanvasState();
        }
        this.artistSpeak("Canvas cleared! Start creating! ✨");
    }

    saveCanvasState() {
        if (this.ctx) {
            this.canvasHistory.push(this.ctx.getImageData(0, 0, this.playerCanvas.width, this.playerCanvas.height));
            if (this.canvasHistory.length > 10) {
                this.canvasHistory.shift();
            }
        }
    }

    undoLastAction() {
        if (this.canvasHistory.length > 1) {
            this.canvasHistory.pop(); // Remove current state
            const previousState = this.canvasHistory[this.canvasHistory.length - 1];
            this.ctx.putImageData(previousState, 0, 0);
        }
        this.artistSpeak("Undone! Try again! 🔄");
    }

    submitArt() {
        if (!this.currentChallenge) return;
        
        const hasDrawing = this.checkHasDrawing();
        if (!hasDrawing) {
            this.artistSpeak("Draw something first! 🎨");
            return;
        }
        
        // For simplicity, we'll consider the challenge completed if they used the target color
        const usedTargetColor = this.checkUsedTargetColor();
        
        if (usedTargetColor) {
            this.correctChallenge();
        } else {
            this.encourageImprovement();
        }
    }

    checkHasDrawing() {
        const imageData = this.ctx.getImageData(0, 0, this.playerCanvas.width, this.playerCanvas.height);
        const data = imageData.data;
        
        for (let i = 0; i < data.length; i += 4) {
            if (data[i + 3] > 0) { // Alpha channel > 0 means there's something drawn
                return true;
            }
        }
        return false;
    }

    checkUsedTargetColor() {
        // For this demo, we'll be generous and accept if they drew anything with a related color
        // In a real implementation, you'd do more sophisticated color analysis
        return true; // Simplified for demo
    }

    correctChallenge() {
        this.score += (20 + (this.level * 10));
        this.challengesCompleted++;
        this.streak++;
        this.creativity = Math.min(this.creativity + 20, 100);
        
        this.updateUI();
        this.showCorrectAnimation();
        this.artistCelebrate();
        
        // Check for level up
        if (this.challengesCompleted >= 5) {
            this.levelUp();
        } else {
            setTimeout(() => {
                this.generateChallenge();
            }, 2000);
        }
        
        // Achievements
        if (this.streak === 3) {
            this.showAchievement('🎨 Creative Streak! 3 in a row!');
            this.addAchievement('Creative Artist', '3 challenges completed in a row!', '🎨');
        } else if (this.streak === 5) {
            this.showAchievement('🌈 Art Master! 5 in a row!');
            this.addAchievement('Art Master', '5 perfect artworks!', '🌈');
        }
    }

    encourageImprovement() {
        this.lives--;
        this.streak = 0;
        this.creativity = Math.max(this.creativity - 15, 0);
        
        this.updateUI();
        this.showWrongAnimation();
        this.artistEncourage();
        
        if (this.lives <= 0 || this.creativity <= 0) {
            setTimeout(() => {
                this.gameOver();
            }, 2000);
        } else {
            // Give them another chance with the same challenge
            this.artistSpeak("Keep trying! Art takes practice! 💪");
        }
    }

    levelUp() {
        this.level++;
        this.challengesCompleted = 0;
        this.lives = Math.min(this.lives + 1, 5);
        this.creativity = 100;
        
        this.updateUI();
        this.updateProgressBar();
        this.showAchievement(`🎭 Level ${this.level} Artist!`);
        this.artistSpeak(`Amazing! You're now a Level ${this.level} artist! 🌟`);
        
        if (this.level === 5) {
            this.addAchievement('Color Explorer', 'Reached level 5!', '🌈');
        } else if (this.level === 10) {
            this.addAchievement('Master Artist', 'Reached level 10!', '🎨');
        }
        
        setTimeout(() => {
            this.generateChallenge();
        }, 3000);
    }

    gameOver() {
        const gameOverScreen = document.createElement('div');
        gameOverScreen.className = 'game-over-art';
        gameOverScreen.innerHTML = `
            <div class="art-game-over-content">
                <h2>Art Gallery Closed! 🎨</h2>
                <p><strong>Final Level:</strong> ${this.level}</p>
                <p><strong>Total Score:</strong> ${this.score}</p>
                <p><strong>Challenges Completed:</strong> ${this.level * 5 + this.challengesCompleted - 5}</p>
                <p>Your creativity ran out, but you've made beautiful art! 🌈</p>
                <button class="art-btn" onclick="this.restart()">🎨 New Canvas</button>
            </div>
        `;
        
        this.container.appendChild(gameOverScreen);
        
        if (this.score > 100) {
            this.addAchievement('Young Artist', `Scored ${this.score} points!`, '🏆');
        }
    }

    getHint() {
        if (!this.currentChallenge) return;
        
        this.creativity = Math.max(this.creativity - 10, 0);
        this.updateUI();
        
        let hint = '';
        switch (this.currentChallenge.type) {
            case 'colorMatch':
                hint = `💡 Look for the ${this.currentChallenge.colorName} color in your palette!`;
                break;
            case 'colorMix':
                hint = `💡 Remember: ${this.currentChallenge.color1Name} + ${this.currentChallenge.color2Name} = ${this.currentChallenge.resultName}!`;
                break;
            case 'freeDrawing':
                hint = `💡 Think about what a ${this.currentChallenge.subject} looks like!`;
                break;
            case 'patternCreate':
                hint = `💡 Alternate between the two colors to make your pattern!`;
                break;
            case 'colorName':
                hint = `💡 Find the ${this.currentChallenge.colorName} color and paint with it!`;
                break;
        }
        
        this.showAchievement(hint);
        
        if (this.creativity <= 0) {
            setTimeout(() => {
                this.gameOver();
            }, 1000);
        }
    }

    showCorrectAnimation() {
        this.container.classList.add('correct-art-animation');
        setTimeout(() => {
            this.container.classList.remove('correct-art-animation');
        }, 2000);
        
        // Create celebration particles
        for (let i = 0; i < 15; i++) {
            setTimeout(() => {
                this.createColorParticle();
            }, i * 100);
        }
    }

    showWrongAnimation() {
        this.container.classList.add('wrong-art-animation');
        setTimeout(() => {
            this.container.classList.remove('wrong-art-animation');
        }, 1000);
    }

    updateUI() {
        const scoreEl = this.container.querySelector('#color-score');
        if (scoreEl) scoreEl.textContent = this.score;
        
        const levelEl = this.container.querySelector('#color-level');
        if (levelEl) levelEl.textContent = this.level;
        
        const livesEl = this.container.querySelector('#color-lives');
        if (livesEl) livesEl.textContent = this.lives;
        
        const creativityFill = this.container.querySelector('#creativityFill');
        if (creativityFill) {
            creativityFill.style.width = `${this.creativity}%`;
        }
        
        this.updateProgressBar();
    }

    updateProgressBar() {
        const progressFill = this.container.querySelector('#progressFill');
        const progressText = this.container.querySelector('.challenge-progress span');
        
        if (progressFill) {
            progressFill.style.width = `${(this.challengesCompleted / 5) * 100}%`;
        }
        
        if (progressText) {
            progressText.textContent = `Challenges to next level: ${5 - this.challengesCompleted}/5`;
        }
    }

    updateColorFacts() {
        const factsEl = this.container.querySelector('#colorFacts');
        if (!factsEl) return;
        
        const facts = [
            "Red + Blue = Purple! 🟣",
            "Yellow + Blue = Green! 🟢",
            "Red + Yellow = Orange! 🟠",
            "Rainbows have 7 colors! 🌈",
            "White contains all colors! ⚪",
            "Artists use primary colors to make all others! 🎨",
            "Colors can make you feel happy or calm! 😊",
            "Every color has a warm or cool feeling! 🌡️"
        ];
        
        const randomFact = facts[Math.floor(Math.random() * facts.length)];
        factsEl.innerHTML = `<p>Did you know? ${randomFact}</p>`;
    }

    showAchievement(message) {
        const gallery = this.container.querySelector('#achievementsGallery');
        if (!gallery) return;
        
        gallery.innerHTML = `<div class="color-achievement">${message}</div>`;
        
        setTimeout(() => {
            gallery.innerHTML = '';
        }, 3000);
    }

    artistSpeak(message) {
        const bubbleEl = this.container.querySelector('#artistBubble');
        if (bubbleEl) {
            bubbleEl.textContent = message;
        }
    }

    artistCelebrate() {
        const mascotEl = this.container.querySelector('#artistMascot');
        if (!mascotEl) return;
        
        const celebrations = ['🎉', '⭐', '✨', '🌟', '🎊', '🌈'];
        const original = mascotEl.textContent;
        
        celebrations.forEach((emoji, i) => {
            setTimeout(() => {
                mascotEl.textContent = emoji;
            }, i * 200);
        });
        
        setTimeout(() => {
            mascotEl.textContent = original;
        }, celebrations.length * 200);
        
        this.artistSpeak("Beautiful artwork! You're so creative! 🌟");
    }

    artistEncourage() {
        const encouragements = [
            "Keep practicing! Art is about trying! 💪",
            "Every artist makes mistakes! Try again! 🎨",
            "Your creativity is growing! Don't give up! ✨",
            "Great artists practice a lot! You can do it! 🌟",
            "Art is fun when you keep experimenting! 🌈"
        ];
        
        const message = encouragements[Math.floor(Math.random() * encouragements.length)];
        this.artistSpeak(message);
    }

    mascotInteraction() {
        const mascotEl = this.container.querySelector('#artistMascot');
        if (!mascotEl) return;
        
        const moods = this.mascotMoods;
        const randomMood = moods[Math.floor(Math.random() * moods.length)];
        const original = mascotEl.textContent;
        
        mascotEl.textContent = randomMood;
        this.playColorSound();
        this.createColorParticle();
        
        const phrases = [
            "Ready to create more art? 🎨",
            "Colors are magical! ✨",
            "Your imagination is amazing! 🌈",
            "Every picture tells a story! 📖",
            "Art makes the world beautiful! 🌟"
        ];
        
        this.artistSpeak(phrases[Math.floor(Math.random() * phrases.length)]);
        
        setTimeout(() => {
            mascotEl.textContent = original;
        }, 2000);
    }

    getColorName(hex) {
        const colorNames = {
            '#ff0000': 'red',
            '#0000ff': 'blue',
            '#ffff00': 'yellow',
            '#ffa500': 'orange',
            '#00ff00': 'green',
            '#800080': 'purple',
            '#ffc0cb': 'pink',
            '#8b4513': 'brown',
            '#808080': 'gray',
            '#ffffff': 'white',
            '#000000': 'black'
        };
        return colorNames[hex.toLowerCase()] || 'color';
    }

    getColorHex(name) {
        const colorHexes = {
            'red': '#ff0000',
            'blue': '#0000ff',
            'yellow': '#ffff00',
            'orange': '#ffa500',
            'green': '#00ff00',
            'purple': '#800080',
            'pink': '#ffc0cb',
            'brown': '#8b4513',
            'gray': '#808080',
            'white': '#ffffff',
            'black': '#000000'
        };
        return colorHexes[name.toLowerCase()] || '#000000';
    }

    playColorSound() {
        if (window.superKidsGames) {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.setValueAtTime(600 + Math.random() * 400, audioContext.currentTime);
            oscillator.type = 'sine';
            
            gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
            
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.2);
        }
    }

    restart() {
        this.level = 1;
        this.score = 0;
        this.lives = 3;
        this.creativity = 100;
        this.challengesCompleted = 0;
        this.streak = 0;
        this.currentChallenge = null;
        
        this.createGameInterface();
        this.setupCanvas();
        this.setupEventListeners();
        this.createFloatingColors();
        this.generateChallenge();
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
window.ColorQuest = ColorQuest;