// enemies1.js
(function() {
    const ENEMY_WIDTH = 80;
    const ENEMY_HEIGHT = 80;
    const ENEMY_PROJECTILE_SPEED = 6;
    const ENEMY_MUZZLE_OFFSET_Y = 55; // Säädetty SVG-alusten mukaisesti
    const ENEMY_POINTS = 100; // Pisteet perusvihollisen tuhoamisesta
    const BOSS_POINTS = 1000; // Pisteet pomon tuhoamisesta

    let gameContainerRef;
    let gameWidthRef;
    let gameHeightRef;
    let playerXRef; // Viittaus pelaajan X-positioon tähtäystä varten


    let activeEnemies = [];
    let enemyProjectiles = [];
    let level1Boss = null;

    let regularEnemySpawnRate = 2500; 
    let lastRegularEnemySpawnTime = 0;
    let numRegularEnemiesSpawned = 0;
    const MAX_REGULAR_ENEMIES_BEFORE_BOSS = 8; 
    let bossSpawned = false;
    let bossDefeated = false;

    // --- Uudistetut kulmikkaat ja yksityiskohtaiset SVG-määrittelyt Level 1 -aluksille ---

    const SHADOW_REAPER_SVG = `
        <svg viewBox="0 0 1000 1000">
            <defs>
                <linearGradient id="mainBodyGradientAlien1_lvl1_sr" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stop-color="#4a0066" />
                    <stop offset="50%" stop-color="#240033" />
                    <stop offset="100%" stop-color="#0a0010" />
                </linearGradient>
                <linearGradient id="wingGradientAlien1_lvl1_sr" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stop-color="#ff1a1a" />
                    <stop offset="100%" stop-color="#660000" />
                </linearGradient>
                <linearGradient id="cockpitGradientAlien1_lvl1_sr" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stop-color="#00ff66" />
                    <stop offset="100%" stop-color="#006622" />
                </linearGradient>
                <linearGradient id="exhaustGradientAlien1_lvl1_sr" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stop-color="#ff6600" />
                    <stop offset="100%" stop-color="#992200" />
                </linearGradient>
                <linearGradient id="accentGradientAlien1_lvl1_sr" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stop-color="#b800ff" />
                    <stop offset="100%" stop-color="#5c0080" />
                </linearGradient>
                <linearGradient id="trailRed_lvl1_sr" x1="0%" y1="100%" x2="0%" y2="0%">
                    <stop offset="0%" stop-color="#ff1a1a" stop-opacity="0.8" />
                    <stop offset="100%" stop-color="#ff1a1a" stop-opacity="0" />
                </linearGradient>
                <filter id="neonGlow_lvl1_sr">
                    <feGaussianBlur stdDeviation="8" result="coloredBlur"/>
                    <feMerge>
                        <feMergeNode in="coloredBlur"/>
                        <feMergeNode in="SourceGraphic"/>
                    </feMerge>
                </filter>
            </defs>
            <g transform="translate(500, 500) rotate(180) translate(-500, -500)">
                <!-- Punaiset moottoritulet -->
                <polygon fill="url(#trailRed_lvl1_sr)" opacity="0.3" points="400,600 380,750 420,750" filter="url(#neonGlow_lvl1_sr)"></polygon>
                <polygon fill="url(#trailRed_lvl1_sr)" opacity="0.3" points="600,600 580,750 620,750" filter="url(#neonGlow_lvl1_sr)"></polygon>

                <!-- Monikerroksiset siivet (Vasen) -->
                <polygon fill="url(#wingGradientAlien1_lvl1_sr)" points="450,400 200,500 400,600"></polygon>
                <polygon fill="url(#mainBodyGradientAlien1_lvl1_sr)" points="430,420 250,490 380,550" opacity="0.95"></polygon>
                <polygon fill="#ff1a1a" points="310,460 240,490 290,510" filter="url(#neonGlow_lvl1_sr)" opacity="0.8"></polygon>

                <!-- Monikerroksiset siivet (Oikea) -->
                <polygon fill="url(#wingGradientAlien1_lvl1_sr)" points="550,400 800,500 600,600"></polygon>
                <polygon fill="url(#mainBodyGradientAlien1_lvl1_sr)" points="570,420 750,490 620,550" opacity="0.95"></polygon>
                <polygon fill="#ff1a1a" points="690,460 760,490 710,510" filter="url(#neonGlow_lvl1_sr)" opacity="0.8"></polygon>

                <!-- Kulmikas ja särmikäs päärunko -->
                <polygon fill="url(#mainBodyGradientAlien1_lvl1_sr)" points="500,250 430,400 500,430"></polygon>
                <polygon fill="url(#mainBodyGradientAlien1_lvl1_sr)" points="500,250 570,400 500,430"></polygon>
                <polygon fill="url(#mainBodyGradientAlien1_lvl1_sr)" points="450,400 550,400 400,600 600,600"></polygon>

                <!-- Hehkuva vihreä biosensoriytimen ohjaamo -->
                <polygon fill="url(#cockpitGradientAlien1_lvl1_sr)" points="500,300 460,390 500,415" filter="url(#neonGlow_lvl1_sr)"></polygon>
                <polygon fill="url(#cockpitGradientAlien1_lvl1_sr)" points="500,300 540,390 500,415" filter="url(#neonGlow_lvl1_sr)"></polygon>

                <!-- Tehosteet ja moottorit -->
                <polygon fill="url(#accentGradientAlien1_lvl1_sr)" points="400,650 380,700 420,700"></polygon>
                <polygon fill="url(#accentGradientAlien1_lvl1_sr)" points="600,650 580,700 620,700"></polygon>
                <polygon fill="url(#exhaustGradientAlien1_lvl1_sr)" points="400,600 420,650 380,650"></polygon>
                <polygon fill="url(#exhaustGradientAlien1_lvl1_sr)" points="600,600 620,650 580,650"></polygon>
            </g>
        </svg>
    `;

    const XENON_SPIKE_SVG = `
        <svg viewBox="0 0 1000 1000">
            <defs>
                <linearGradient id="mainBodyGradientAlien2_lvl1_xs" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stop-color="#4a0054" />
                    <stop offset="50%" stop-color="#24002d" />
                    <stop offset="100%" stop-color="#0a0014" />
                </linearGradient>
                <linearGradient id="wingGradientAlien2_lvl1_xs" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stop-color="#00e5ff" />
                    <stop offset="100%" stop-color="#0055b3" />
                </linearGradient>
                <linearGradient id="cockpitGradientAlien2_lvl1_xs" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stop-color="#ff33ff" />
                    <stop offset="100%" stop-color="#990099" />
                </linearGradient>
                <linearGradient id="exhaustGradientAlien2_lvl1_xs" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stop-color="#ff1a1a" />
                    <stop offset="100%" stop-color="#800000" />
                </linearGradient>
                <linearGradient id="accentGradientAlien2_lvl1_xs" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stop-color="#a6ff00" />
                    <stop offset="100%" stop-color="#4d9900" />
                </linearGradient>
                <linearGradient id="trailBlue_lvl1_xs" x1="0%" y1="100%" x2="0%" y2="0%">
                    <stop offset="0%" stop-color="#00e5ff" stop-opacity="0.8" />
                    <stop offset="100%" stop-color="#00e5ff" stop-opacity="0" />
                </linearGradient>
                <filter id="neonGlow_lvl1_xs">
                    <feGaussianBlur stdDeviation="8" result="coloredBlur"/>
                    <feMerge>
                        <feMergeNode in="coloredBlur"/>
                        <feMergeNode in="SourceGraphic"/>
                    </feMerge>
                </filter>
            </defs>
            <g transform="translate(500, 500) rotate(180) translate(-500, -500)">
                <!-- Neon-siniset pakokaasut -->
                <polygon fill="url(#trailBlue_lvl1_xs)" opacity="0.35" points="400,600 380,720 420,720" filter="url(#neonGlow_lvl1_xs)"></polygon>
                <polygon fill="url(#trailBlue_lvl1_xs)" opacity="0.35" points="600,600 580,720 620,720" filter="url(#neonGlow_lvl1_xs)"></polygon>

                <!-- Ulommat terävät siipipaneelit (Vasen) -->
                <polygon fill="url(#wingGradientAlien2_lvl1_xs)" points="400,450 250,520 380,580"></polygon>
                <polygon fill="#00e5ff" points="330,480 270,510 320,530" filter="url(#neonGlow_lvl1_xs)" opacity="0.8"></polygon>

                <!-- Ulommat terävät siipipaneelit (Oikea) -->
                <polygon fill="url(#wingGradientAlien2_lvl1_xs)" points="600,450 750,520 620,580"></polygon>
                <polygon fill="#00e5ff" points="670,480 730,510 680,530" filter="url(#neonGlow_lvl1_xs)" opacity="0.8"></polygon>

                <!-- Särmikäs piikkimäinen runkorakenne -->
                <polygon fill="url(#mainBodyGradientAlien2_lvl1_xs)" points="500,220 430,380 500,410"></polygon>
                <polygon fill="url(#mainBodyGradientAlien2_lvl1_xs)" points="500,220 570,380 500,410"></polygon>
                <polygon fill="url(#mainBodyGradientAlien2_lvl1_xs)" points="400,450 600,450 450,650 550,650"></polygon>
                <polygon fill="url(#mainBodyGradientAlien2_lvl1_xs)" points="450,650 500,750 550,650"></polygon>

                <!-- Terävä violetti ydinosio -->
                <polygon fill="url(#cockpitGradientAlien2_lvl1_xs)" points="500,260 460,370 500,395" filter="url(#neonGlow_lvl1_xs)"></polygon>
                <polygon fill="url(#cockpitGradientAlien2_lvl1_xs)" points="500,260 540,370 500,395" filter="url(#neonGlow_lvl1_xs)"></polygon>
                <polygon fill="#ffffff" points="500,280 480,350 500,370" opacity="0.6"></polygon>

                <!-- Korostukset ja suuttimet -->
                <polygon fill="url(#accentGradientAlien2_lvl1_xs)" points="380,480 350,550 410,550"></polygon>
                <polygon fill="url(#accentGradientAlien2_lvl1_xs)" points="620,480 590,550 650,550"></polygon>
                <polygon fill="url(#accentGradientAlien2_lvl1_xs)" points="430,680 410,730 450,730"></polygon>
                <polygon fill="url(#accentGradientAlien2_lvl1_xs)" points="570,680 550,730 590,730"></polygon>
                <polygon fill="url(#exhaustGradientAlien2_lvl1_xs)" points="450,650 470,700 430,700"></polygon>
                <polygon fill="url(#exhaustGradientAlien2_lvl1_xs)" points="550,650 570,700 530,700"></polygon>
            </g>
        </svg>
    `;

    const ABYSSAL_TYRANT_SVG = `
        <svg viewBox="0 0 1000 1000">
            <defs>
                <linearGradient id="mainBodyGradientAlien7_lvl1_ab" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stop-color="#3d0370" />
                    <stop offset="50%" stop-color="#19013c" />
                    <stop offset="100%" stop-color="#05011f" />
                </linearGradient>
                <linearGradient id="wingGradientAlien7_lvl1_ab" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stop-color="#ad33ff" />
                    <stop offset="100%" stop-color="#5500b3" />
                </linearGradient>
                <linearGradient id="cockpitGradientAlien7_lvl1_ab" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stop-color="#ff1a1a" />
                    <stop offset="100%" stop-color="#660000" />
                </linearGradient>
                <linearGradient id="exhaustGradientAlien7_lvl1_ab" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stop-color="#33ff00" />
                    <stop offset="100%" stop-color="#118000" />
                </linearGradient>
                <linearGradient id="accentGradientAlien7_lvl1_ab" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stop-color="#ffca00" />
                    <stop offset="100%" stop-color="#997300" />
                </linearGradient>
                <linearGradient id="trailViolet_lvl1_ab" x1="0%" y1="100%" x2="0%" y2="0%">
                    <stop offset="0%" stop-color="#ad33ff" stop-opacity="0.8" />
                    <stop offset="100%" stop-color="#ad33ff" stop-opacity="0" />
                </linearGradient>
                <filter id="neonGlow_lvl1_ab">
                    <feGaussianBlur stdDeviation="8" result="coloredBlur"/>
                    <feMerge>
                        <feMergeNode in="coloredBlur"/>
                        <feMergeNode in="SourceGraphic"/>
                    </feMerge>
                </filter>
            </defs>
            <g transform="translate(500, 500) rotate(180) translate(-500, -500)">
                <!-- Takana hehkuvat pakokaasuvirrat -->
                <polygon fill="url(#trailViolet_lvl1_ab)" opacity="0.3" points="400,650 380,820 420,820" filter="url(#neonGlow_lvl1_ab)"></polygon>
                <polygon fill="url(#trailViolet_lvl1_ab)" opacity="0.3" points="600,650 580,820 620,820" filter="url(#neonGlow_lvl1_ab)"></polygon>

                <!-- Raskaat kulmikkaat siivet (Vasen) -->
                <polygon fill="url(#wingGradientAlien7_lvl1_ab)" points="400,400 200,500 350,600"></polygon>
                <polygon fill="url(#mainBodyGradientAlien7_lvl1_ab)" points="380,410 240,480 340,560" opacity="0.95"></polygon>
                <polygon fill="#ad33ff" points="300,450 230,480 270,510" filter="url(#neonGlow_lvl1_ab)" opacity="0.8"></polygon>

                <!-- Raskaat kulmikkaat siivet (Oikea) -->
                <polygon fill="url(#wingGradientAlien7_lvl1_ab)" points="600,400 800,500 650,600"></polygon>
                <polygon fill="url(#mainBodyGradientAlien7_lvl1_ab)" points="620,410 760,480 660,560" opacity="0.95"></polygon>
                <polygon fill="#ad33ff" points="700,450 770,480 730,510" filter="url(#neonGlow_lvl1_ab)" opacity="0.8"></polygon>

                <!-- Särmikäs Abyssal-päärunko -->
                <polygon fill="url(#mainBodyGradientAlien7_lvl1_ab)" points="500,150 420,320 500,360"></polygon>
                <polygon fill="url(#mainBodyGradientAlien7_lvl1_ab)" points="500,150 580,320 500,360"></polygon>
                <polygon fill="url(#mainBodyGradientAlien7_lvl1_ab)" points="420,320 580,320 350,600 650,600"></polygon>
                <polygon fill="url(#mainBodyGradientAlien7_lvl1_ab)" points="350,600 650,600 500,750"></polygon>

                <!-- Tyrant-sarvet/ulokkeet keulassa -->
                <polygon fill="url(#mainBodyGradientAlien7_lvl1_ab)" points="450,220 410,120 480,210"></polygon>
                <polygon fill="url(#mainBodyGradientAlien7_lvl1_ab)" points="550,220 590,120 520,210"></polygon>

                <!-- Hehkuva punainen ydin -->
                <polygon fill="url(#cockpitGradientAlien7_lvl1_ab)" points="500,200 450,300 500,335" filter="url(#neonGlow_lvl1_ab)"></polygon>
                <polygon fill="url(#cockpitGradientAlien7_lvl1_ab)" points="500,200 550,300 500,335" filter="url(#neonGlow_lvl1_ab)"></polygon>
                <polygon fill="#ffffff" points="500,220 480,280 500,300" opacity="0.5"></polygon>

                <!-- Korostukset ja vihreät pakopesät -->
                <polygon fill="url(#accentGradientAlien7_lvl1_ab)" points="420,700 400,750 440,750"></polygon>
                <polygon fill="url(#accentGradientAlien7_lvl1_ab)" points="580,700 560,750 600,750"></polygon>
                <polygon fill="url(#exhaustGradientAlien7_lvl1_ab)" points="350,600 380,680 320,680"></polygon>
                <polygon fill="url(#exhaustGradientAlien7_lvl1_ab)" points="650,600 680,680 620,680"></polygon>
            </g>
        </svg>
    `;

    // --- Sisäiset aputoiminnot ---
    function createEnemyElement(enemyData, svgHTML) {
        const wrapper = document.createElement('div');
        wrapper.classList.add('enemy-jet-wrapper');
        wrapper.style.width = `${enemyData.width}px`;
        wrapper.style.height = `${enemyData.height}px`;
        wrapper.innerHTML = svgHTML;

        const healthBarContainer = document.createElement('div');
        healthBarContainer.classList.add('enemy-health-bar-container');
        const healthBar = document.createElement('div');
        healthBar.classList.add('enemy-health-bar');
        healthBarContainer.appendChild(healthBar);
        wrapper.appendChild(healthBarContainer);

        enemyData.element = wrapper;
        enemyData.healthBar = healthBar;
        enemyData.healthBarContainer = healthBarContainer;

        return wrapper;
    }

    function updateEnemyHealthBar(enemy) {
        const healthPercentage = (enemy.health / enemy.maxHealth) * 100;
        enemy.healthBar.style.width = `${healthPercentage}%`;

        if (healthPercentage > 60) {
            enemy.healthBar.style.background = 'linear-gradient(to right, #ff0000, #cc0000)'; 
        } else if (healthPercentage > 30) {
            enemy.healthBar.style.background = 'linear-gradient(to right, #ffff00, #cc9900)'; 
        } else {
            enemy.healthBar.style.background = 'linear-gradient(to right, #ff0000, #990000)'; 
        }
    }

    function updateEnemyElementPosition(enemy) {
        enemy.element.style.left = `${enemy.x - enemy.width / 2}px`;
        enemy.element.style.top = `${enemy.y - enemy.height / 2}px`;
    }

    // --- Vihollistyypit (Factory-funktiot) ---

    // Shadow Reaper - Perusvihollinen
    function createShadowReaper(x, y) {
        const enemy = {
            x: x,
            y: y,
            maxHealth: 3,
            health: 3,
            speed: 2,
            fireRate: 1800, 
            lastShotTime: performance.now() + Math.random() * 500, 
            width: ENEMY_WIDTH,
            height: ENEMY_HEIGHT,
            isBoss: false,
            points: ENEMY_POINTS,
            update: function(currentTime, frameRateFactor) {
                this.y += this.speed * frameRateFactor;
                updateEnemyElementPosition(this);
            },
            shoot: function(currentTime, playerX) {
                if (currentTime - this.lastShotTime > this.fireRate) {
                    enemyShootProjectile(this.x, this.y + this.height / 2 - ENEMY_MUZZLE_OFFSET_Y, playerX); 
                    this.lastShotTime = currentTime;
                }
            }
        };
        createEnemyElement(enemy, SHADOW_REAPER_SVG);
        updateEnemyHealthBar(enemy);
        return enemy;
    }

    // Xenon Spike - Sine-aaltoileva, hieman nopeampi alus
    function createXenonSpike(x, y) {
        const enemy = {
            x: x,
            y: y,
            maxHealth: 4,
            health: 4,
            speed: 2.5,
            fireRate: 2000,
            lastShotTime: performance.now() + Math.random() * 500,
            width: ENEMY_WIDTH,
            height: ENEMY_HEIGHT,
            isBoss: false,
            sineOffset: Math.random() * Math.PI * 2, 
            sineSpeed: 0.005, 
            sineMagnitude: 30, 
            points: ENEMY_POINTS,
            update: function(currentTime, frameRateFactor) {
                this.y += this.speed * frameRateFactor;
                this.x += Math.sin(this.sineOffset + currentTime * this.sineSpeed) * this.sineMagnitude * 0.1 * frameRateFactor;
                this.x = Math.max(this.width / 2, Math.min(gameWidthRef - this.width / 2, this.x));
                updateEnemyElementPosition(this);
            },
            shoot: function(currentTime, playerX) {
                if (currentTime - this.lastShotTime > this.fireRate) {
                    enemyShootProjectile(this.x, this.y + this.height / 2 - ENEMY_MUZZLE_OFFSET_Y, playerX); 
                    this.lastShotTime = currentTime;
                }
            }
        };
        createEnemyElement(enemy, XENON_SPIKE_SVG);
        updateEnemyHealthBar(enemy);
        return enemy;
    }

    // Abyssal Tyrant - Level 1 Pomo
    function createAbyssalTyrant(x, y) {
        const boss = {
            x: x,
            y: y,
            maxHealth: 50,
            health: 50,
            speed: 1.5, 
            bossSpeedX: 1, 
            fireRate: 1000, 
            fireRateSecondary: 2500, 
            lastShotTime: performance.now(),
            lastSecondaryShotTime: performance.now(),
            width: ENEMY_WIDTH * 2, 
            height: ENEMY_HEIGHT * 2,
            isBoss: true,
            points: BOSS_POINTS,
            state: 'descend', 
            targetY: gameHeightRef * 0.2, 
            update: function(currentTime, frameRateFactor) {
                if (this.state === 'descend') {
                    this.y += this.speed * frameRateFactor;
                    if (this.y >= this.targetY) {
                        this.y = this.targetY;
                        this.state = 'patrol';
                    }
                } else if (this.state === 'patrol') {
                    this.x += this.bossSpeedX * frameRateFactor;
                    if (this.x - this.width / 2 < 0 || this.x + this.width / 2 > gameWidthRef) {
                        this.bossSpeedX *= -1;
                        this.x = Math.max(this.width / 2, Math.min(gameWidthRef - this.width / 2, this.x));
                    }
                }
                updateEnemyElementPosition(this);
            },
            shoot: function(currentTime, playerX) {
                if (currentTime - this.lastShotTime > this.fireRate) {
                    enemyShootProjectile(this.x - 20, this.y + this.height / 2 - ENEMY_MUZZLE_OFFSET_Y, playerX);
                    enemyShootProjectile(this.x + 20, this.y + this.height / 2 - ENEMY_MUZZLE_OFFSET_Y, playerX);
                    this.lastShotTime = currentTime;
                }
                if (currentTime - this.lastSecondaryShotTime > this.fireRateSecondary) {
                    enemyShootProjectile(this.x - 30, this.y + this.height / 2 - ENEMY_MUZZLE_OFFSET_Y, playerX - 50); 
                    enemyShootProjectile(this.x, this.y + this.height / 2 - ENEMY_MUZZLE_OFFSET_Y, playerX); 
                    enemyShootProjectile(this.x + 30, this.y + this.height / 2 - ENEMY_MUZZLE_OFFSET_Y, playerX + 50); 
                    this.lastSecondaryShotTime = currentTime;
                }
            }
        };
        createEnemyElement(boss, ABYSSAL_TYRANT_SVG);
        boss.element.style.width = `${boss.width}px`; 
        boss.element.style.height = `${boss.height}px`;
        updateEnemyHealthBar(boss);
        return boss;
    }

    // --- Ammuksien fysiikka ja ohjaus ---
    function enemyShootProjectile(startX, startY, targetPlayerX) {
        const projectile = document.createElement('div');
        projectile.classList.add('enemy-projectile');
        
        let speedX = 0;
        let speedY = ENEMY_PROJECTILE_SPEED; 

        if (targetPlayerX !== undefined) {
            const dx = targetPlayerX - startX;
            const dy = gameHeightRef - startY; 
            
            const angle = Math.atan2(dy, dx); 
            
            speedX = Math.cos(angle) * ENEMY_PROJECTILE_SPEED;
            speedY = Math.sin(angle) * ENEMY_PROJECTILE_SPEED;
        }

        projectile.style.left = `${startX - 2.5}px`; 
        projectile.style.top = `${startY}px`;
        gameContainerRef.appendChild(projectile);
        
        enemyProjectiles.push({ element: projectile, y: startY, x: startX, speedX: speedX, speedY: speedY, type: 'standard' });
    }

    // --- Rajapinta pääpelin käyttöön ---
    window.currentLevelModule = {
        initLevel: function(gameContainer, gameWidth, gameHeight) {
            gameContainerRef = gameContainer;
            gameWidthRef = gameWidth;
            gameHeightRef = gameHeight;
            this.reset(); 
        },

        reset: function() {
            activeEnemies.forEach(e => e.element.remove());
            enemyProjectiles.forEach(p => p.element.remove());
            activeEnemies.length = 0;
            enemyProjectiles.length = 0;
            level1Boss = null;
            lastRegularEnemySpawnTime = 0;
            numRegularEnemiesSpawned = 0;
            bossSpawned = false;
            bossDefeated = false;
            playerXRef = undefined; 
        },

        updateEnemies: function(currentTime, frameRateFactor, activePlayerXRefs) {
            if (activePlayerXRefs && activePlayerXRefs.length > 0) {
                playerXRef = activePlayerXRefs[0];
            } else {
                playerXRef = undefined; 
            }

            if (!bossSpawned && numRegularEnemiesSpawned < MAX_REGULAR_ENEMIES_BEFORE_BOSS) {
                if (currentTime - lastRegularEnemySpawnTime > regularEnemySpawnRate) {
                    this.spawnRegularEnemy();
                    lastRegularEnemySpawnTime = currentTime;
                    numRegularEnemiesSpawned++;
                }
            } else if (!bossSpawned && numRegularEnemiesSpawned >= MAX_REGULAR_ENEMIES_BEFORE_BOSS) {
                this.spawnBoss(); 
                bossSpawned = true;
            }

            for (let i = activeEnemies.length - 1; i >= 0; i--) {
                const enemy = activeEnemies[i];
                enemy.update(currentTime, frameRateFactor, playerXRef); 
                enemy.shoot(currentTime, playerXRef); 

                if (!enemy.isBoss && enemy.y > gameHeightRef + enemy.height / 2) {
                    enemy.element.remove();
                    activeEnemies.splice(i, 1);
                }
            }
        },

        spawnRegularEnemy: function() {
            const x = Math.random() * (gameWidthRef - ENEMY_WIDTH) + ENEMY_WIDTH / 2;
            const y = -ENEMY_HEIGHT; 

            let newEnemy;
            if (Math.random() < 0.5) { 
                newEnemy = createShadowReaper(x, y);
            } else { 
                newEnemy = createXenonSpike(x, y);
            }
            gameContainerRef.appendChild(newEnemy.element);
            activeEnemies.push(newEnemy);
        },

        spawnBoss: function() {
            const x = gameWidthRef / 2;
            const y = -ENEMY_HEIGHT * 2; 
            level1Boss = createAbyssalTyrant(x, y);
            gameContainerRef.appendChild(level1Boss.element);
            activeEnemies.push(level1Boss);
        },

        updateEnemyProjectiles: function(frameRateFactor) {
            for (let i = enemyProjectiles.length - 1; i >= 0; i--) {
                const ep = enemyProjectiles[i];
                ep.x += ep.speedX * frameRateFactor;
                ep.y += ep.speedY * frameRateFactor;
                ep.element.style.left = `${ep.x - ep.element.offsetWidth / 2}px`;
                ep.element.style.top = `${ep.y - ep.element.offsetHeight / 2}px`;

                if (ep.y > gameHeightRef + ep.element.offsetHeight || ep.y < -ep.element.offsetHeight || ep.x < -ep.element.offsetWidth || ep.x > gameWidthRef + ep.element.offsetWidth) {
                    ep.element.remove();
                    enemyProjectiles.splice(i, 1);
                }
            }
        },

        checkCollisionsWithPlayerProjectiles: function(playerProjectiles, addScoreCallback, createExplosionCallback) {
            for (let i = playerProjectiles.length - 1; i >= 0; i--) {
                const p = playerProjectiles[i];
                const pRect = p.element.getBoundingClientRect();

                for (let j = activeEnemies.length - 1; j >= 0; j--) {
                    const enemy = activeEnemies[j];
                    const enemyRect = enemy.element.getBoundingClientRect();

                    if (checkCollision(pRect, enemyRect)) {
                        enemy.health--;
                        
                        enemy.element.classList.add('damaged-flash');
                        setTimeout(() => {
                            enemy.element.classList.remove('damaged-flash');
                        }, 300); 

                        p.element.remove();
                        playerProjectiles.splice(i, 1); 
                        updateEnemyHealthBar(enemy);

                        if (enemy.health <= 0) {
                            addScoreCallback(enemy.points, p.owner); 
                            createExplosionCallback(enemy.x, enemy.y);
                            enemy.element.remove();
                            activeEnemies.splice(j, 1); 
                            if (enemy.isBoss) {
                                bossDefeated = true;
                            }
                        }
                        break; 
                    }
                }
            }
        },

        checkCollisionsWithPlayer: function(playerRect, loseLifeCallback) {
            for (let i = enemyProjectiles.length - 1; i >= 0; i--) {
                const ep = enemyProjectiles[i];
                const epRect = ep.element.getBoundingClientRect();

                if (checkCollision(epRect, playerRect)) {
                    loseLifeCallback();
                    ep.element.remove();
                    enemyProjectiles.splice(i, 1); 
                }
            }

            for (let i = activeEnemies.length - 1; i >= 0; i--) {
                const enemy = activeEnemies[i];
                const enemyRect = enemy.element.getBoundingClientRect();

                if (checkCollision(enemyRect, playerRect)) {
                    loseLifeCallback(); 
                    createExplosionParticles(enemy.x, enemy.y);
                    enemy.element.remove();
                    activeEnemies.splice(i, 1);
                    if (enemy.isBoss) {
                        bossDefeated = true; 
                    }
                }
            }
        },

        isBossDefeated: function() {
            return bossDefeated;
        },

        isBossLevel: function() {
            return bossSpawned; 
        },

        onResize: function(newWidth, newHeight) {
            gameWidthRef = newWidth;
            gameHeightRef = newHeight;
            if (level1Boss && level1Boss.state === 'patrol') {
                level1Boss.targetY = newHeight * 0.2; 
            }
        }
    };

    function checkCollision(rect1, rect2) {
        return rect1.left < rect2.right &&
               rect1.right > rect2.left &&
               rect1.top < rect2.bottom &&
               rect1.bottom > rect2.top;
    }

    function createExplosionParticles(x, y) {
        if (typeof window.createExplosionParticles === 'function') {
            window.createExplosionParticles(x, y);
        }
    }
})();