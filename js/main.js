// Super Kids Games - Main JavaScript
class SuperKidsGames {
    constructor() {
        this.currentAge = 'all';
        this.achievements = [];
        this.soundEnabled = true;
        this.currentGame = null;
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadAchievements();
        this.createParticleEffects();
        this.playBackgroundMusic();
    }

    setupEventListeners() {
        // Age selector buttons
        document.querySelectorAll('.age-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.selectAge(e.target.dataset.age);
            });
        });

        // Mascot interactions
        const mascot = document.querySelector('.mascot-character');
        if (mascot) {
            mascot.addEventListener('click', () => {
                this.mascotInteraction();
            });
        }

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.currentGame) {
                this.closeGame();
            }
        });

        // Window resize handling
        window.addEventListener('resize', () => {
            this.handleResize();
        });
    }

    selectAge(age) {
        this.currentAge = age;
        
        // Update active button
        document.querySelectorAll('.age-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-age="${age}"]`).classList.add('active');
        
        // Filter games
        this.filterGames(age);
        
        // Play selection sound
        this.playSound('select');
        
        // Add celebration effect
        this.createCelebrationEffect();
    }

    filterGames(age) {
        const gameCards = document.querySelectorAll('.game-card');
        
        gameCards.forEach(card => {
            const cardAges = card.dataset.age.split(',');
            
            if (age === 'all' || cardAges.includes(age)) {
                card.classList.remove('hidden');
                card.style.animation = 'fadeInUp 0.5s ease forwards';
            } else {
                card.classList.add('hidden');
            }
        });
    }

    mascotInteraction() {
        const mascot = document.querySelector('.mascot-character');
        const phrases = ['🦄', '🌟', '🎉', '🎈', '🎊', '🌈', '⭐', '🎀'];
        
        // Random mascot change
        const randomPhrase = phrases[Math.floor(Math.random() * phrases.length)];
        mascot.textContent = randomPhrase;
        
        // Play happy sound
        this.playSound('mascot');
        
        // Create rainbow effect
        this.createRainbowEffect();
        
        // Reset after 2 seconds
        setTimeout(() => {
            mascot.textContent = '🦄';
        }, 2000);
    }

    createCelebrationEffect() {
        const celebration = document.createElement('div');
        celebration.className = 'celebration-effect';
        celebration.innerHTML = '🎉✨🎊⭐🌟';
        celebration.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            font-size: 3rem;
            z-index: 9999;
            animation: celebrationBurst 2s ease-out forwards;
            pointer-events: none;
        `;
        
        document.body.appendChild(celebration);
        
        setTimeout(() => {
            celebration.remove();
        }, 2000);
    }

    createRainbowEffect() {
        const rainbow = document.createElement('div');
        rainbow.className = 'rainbow-effect';
        rainbow.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(45deg, 
                rgba(255, 0, 0, 0.3), 
                rgba(255, 154, 0, 0.3), 
                rgba(255, 255, 0, 0.3), 
                rgba(0, 255, 0, 0.3), 
                rgba(0, 0, 255, 0.3), 
                rgba(75, 0, 130, 0.3), 
                rgba(238, 130, 238, 0.3)
            );
            z-index: 9998;
            animation: rainbowFade 3s ease-out forwards;
            pointer-events: none;
        `;
        
        document.body.appendChild(rainbow);
        
        setTimeout(() => {
            rainbow.remove();
        }, 3000);
    }

    createParticleEffects() {
        // Add floating particles
        for (let i = 0; i < 20; i++) {
            setTimeout(() => {
                this.createFloatingParticle();
            }, i * 300);
        }
        
        // Continuously create particles
        setInterval(() => {
            this.createFloatingParticle();
        }, 2000);
    }

    createFloatingParticle() {
        const particles = ['⭐', '✨', '🌟', '💫', '🎈', '🎊', '🦋', '🌸'];
        const particle = document.createElement('div');
        particle.textContent = particles[Math.floor(Math.random() * particles.length)];
        
        particle.style.cssText = `
            position: fixed;
            font-size: ${Math.random() * 20 + 15}px;
            left: ${Math.random() * 100}vw;
            top: 100vh;
            z-index: -1;
            animation: floatUp ${Math.random() * 10 + 15}s linear forwards;
            pointer-events: none;
        `;
        
        document.body.appendChild(particle);
        
        setTimeout(() => {
            particle.remove();
        }, 25000);
    }

    playSound(type) {
        if (!this.soundEnabled) return;
        
        // Create audio context for sound effects
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        
        const sounds = {
            select: { frequency: 800, duration: 0.1 },
            success: { frequency: 1000, duration: 0.3 },
            mascot: { frequency: 600, duration: 0.2 },
            game: { frequency: 400, duration: 0.15 }
        };
        
        const sound = sounds[type] || sounds.select;
        
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.setValueAtTime(sound.frequency, audioContext.currentTime);
        oscillator.type = 'sine';
        
        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + sound.duration);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + sound.duration);
    }

    playBackgroundMusic() {
        // Simple background ambient sound simulation
        if (!this.soundEnabled) return;
        
        setInterval(() => {
            if (Math.random() < 0.1) { // 10% chance every interval
                this.playSound('game');
            }
        }, 10000);
    }

    loadAchievements() {
        const savedAchievements = localStorage.getItem('superKidsAchievements');
        if (savedAchievements) {
            this.achievements = JSON.parse(savedAchievements);
        }
        this.displayAchievements();
    }

    saveAchievements() {
        localStorage.setItem('superKidsAchievements', JSON.stringify(this.achievements));
    }

    addAchievement(title, description, icon) {
        const achievement = {
            id: Date.now(),
            title,
            description,
            icon,
            earned: new Date().toLocaleDateString()
        };
        
        this.achievements.push(achievement);
        this.saveAchievements();
        this.displayAchievements();
        this.showAchievementNotification(achievement);
    }

    displayAchievements() {
        const container = document.getElementById('achievements');
        if (!container) return;
        
        if (this.achievements.length === 0) {
            container.innerHTML = '<p style="color: #666; font-size: 1.2rem;">Start playing games to earn achievements! 🏆</p>';
            return;
        }
        
        container.innerHTML = this.achievements.map(achievement => `
            <div class="achievement">
                <div style="font-size: 2rem; margin-bottom: 10px;">${achievement.icon}</div>
                <h4>${achievement.title}</h4>
                <p>${achievement.description}</p>
                <small>Earned: ${achievement.earned}</small>
            </div>
        `).join('');
    }

    showAchievementNotification(achievement) {
        const notification = document.createElement('div');
        notification.className = 'achievement-notification';
        notification.innerHTML = `
            <div style="font-size: 2rem;">${achievement.icon}</div>
            <h3>Achievement Unlocked!</h3>
            <p>${achievement.title}</p>
        `;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(45deg, #ffd89b, #19547b);
            color: white;
            padding: 20px;
            border-radius: 15px;
            z-index: 10000;
            animation: achievementSlide 4s ease-in-out forwards;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
            text-align: center;
            min-width: 250px;
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 4000);
    }

    handleResize() {
        // Handle responsive adjustments
        const gameModal = document.getElementById('gameModal');
        if (gameModal && gameModal.classList.contains('active')) {
            // Adjust game modal size
            const gameContent = gameModal.querySelector('.game-content');
            if (gameContent) {
                gameContent.style.maxHeight = `${window.innerHeight * 0.8}px`;
            }
        }
    }
}

// Game Management Functions
function openGame(gameId) {
    const modal = document.getElementById('gameModal');
    const title = document.getElementById('gameTitle');
    const content = document.getElementById('gameContent');
    
    // Game titles
    const gameTitles = {
        'memory-monster': '🧠 Memory Monster',
        'math-adventure': '🚀 Space Math Adventure',
        'word-wizard': '🎩 Word Wizard',
        'color-quest': '🎨 Rainbow Color Quest'
    };
    
    title.textContent = gameTitles[gameId] || 'Super Game';
    content.innerHTML = '<div class="loading">Loading awesome game... 🎮</div>';
    
    modal.classList.add('active');
    modal.style.display = 'flex';
    
    // Load specific game
    setTimeout(() => {
        switch(gameId) {
            case 'memory-monster':
                if (window.MemoryMonster) {
                    window.gameInstance = new MemoryMonster(content);
                }
                break;
            case 'math-adventure':
                if (window.MathAdventure) {
                    window.gameInstance = new MathAdventure(content);
                }
                break;
            case 'word-wizard':
                if (window.WordWizard) {
                    window.gameInstance = new WordWizard(content);
                }
                break;
            case 'color-quest':
                if (window.ColorQuest) {
                    window.gameInstance = new ColorQuest(content);
                }
                break;
        }
    }, 500);
    
    // Play game start sound
    if (window.superKidsGames) {
        window.superKidsGames.playSound('game');
        window.superKidsGames.currentGame = gameId;
    }
}

function closeGame() {
    const modal = document.getElementById('gameModal');
    modal.classList.remove('active');
    
    setTimeout(() => {
        modal.style.display = 'none';
        const content = document.getElementById('gameContent');
        content.innerHTML = '';
        
        // Clean up game instance
        if (window.gameInstance && typeof window.gameInstance.destroy === 'function') {
            window.gameInstance.destroy();
        }
        window.gameInstance = null;
        
        if (window.superKidsGames) {
            window.superKidsGames.currentGame = null;
        }
    }, 300);
}

// Add custom CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeInUp {
        from { opacity: 0; transform: translateY(30px); }
        to { opacity: 1; transform: translateY(0); }
    }
    
    @keyframes celebrationBurst {
        0% { opacity: 0; transform: translate(-50%, -50%) scale(0); }
        50% { opacity: 1; transform: translate(-50%, -50%) scale(1.5); }
        100% { opacity: 0; transform: translate(-50%, -50%) scale(2); }
    }
    
    @keyframes rainbowFade {
        0% { opacity: 0; }
        50% { opacity: 1; }
        100% { opacity: 0; }
    }
    
    @keyframes floatUp {
        from { 
            transform: translateY(0) rotate(0deg);
            opacity: 1;
        }
        to { 
            transform: translateY(-100vh) rotate(360deg);
            opacity: 0;
        }
    }
    
    @keyframes achievementSlide {
        0% { transform: translateX(100%); opacity: 0; }
        20% { transform: translateX(0); opacity: 1; }
        80% { transform: translateX(0); opacity: 1; }
        100% { transform: translateX(100%); opacity: 0; }
    }
    
    .loading {
        text-align: center;
        font-size: 1.5rem;
        color: #666;
        padding: 50px;
        animation: bounce 1s infinite;
    }
`;
document.head.appendChild(style);

// Initialize the main game system
document.addEventListener('DOMContentLoaded', () => {
    window.superKidsGames = new SuperKidsGames();
    
    // Add welcome message
    setTimeout(() => {
        if (window.superKidsGames) {
            window.superKidsGames.createCelebrationEffect();
            window.superKidsGames.playSound('success');
        }
    }, 1000);
});