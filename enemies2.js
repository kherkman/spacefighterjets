// enemies2.js
(function() {
    const ENEMY_WIDTH = 80;
    const ENEMY_HEIGHT = 80;
    const ENEMY_PROJECTILE_SPEED = 7; // Hieman nopeammat vihollisammukset
    const ENEMY_MUZZZLE_OFFSET_Y = 55;
    const ENEMY_POINTS = 150; // Enemmän pisteitä Level 2 perusvihollisista
    const BOSS_POINTS = 2000; // Enemmän pisteitä Level 2 pomosta

    let gameContainerRef;
    let gameWidthRef;
    let gameHeightRef;
    let playerXRef; // Viittaus pelaajan X-positioon tähtäystä varten

    let activeEnemies = [];
    let enemyProjectiles = [];
    let level2Boss = null;

    let regularEnemySpawnRate = 2200; 
    let lastRegularEnemySpawnTime = 0;
    let numRegularEnemiesSpawned = 0;
    const MAX_REGULAR_ENEMIES_BEFORE_BOSS = 10; 
    let bossSpawned = false;
    let bossDefeated = false;

    // --- Uudistetut kulmikkaat ja yksityiskohtaiset SVG-määrittelyt Level 2 -aluksille ---

    const NECROTIC_DRONE_SVG = `
        <svg viewBox="0 0 1000 1000">
            <defs>
                <linearGradient id="mainBodyGradientAlien3_lvl2_nd" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stop-color="#4d4d00" />
                    <stop offset="50%" stop-color="#262600" />
                    <stop offset="100%" stop-color="#0a0a00" />
                </linearGradient>
                <linearGradient id="wingGradientAlien3_lvl2_nd" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stop-color="#7fff00" />
                    <stop offset="100%" stop-color="#3b7f00" />
                </linearGradient>
                <linearGradient id="cockpitGradientAlien3_lvl2_nd" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stop-color="#e600ff" />
                    <stop offset="100%" stop-color="#5e0080" />
                </linearGradient>
                <linearGradient id="exhaustGradientAlien3_lvl2_nd" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stop-color="#ffcc00" />
                    <stop offset="100%" stop-color="#ff6600" />
                </linearGradient>
                <linearGradient id="accentGradientAlien3_lvl2_nd" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stop-color="#ff0055" />
                    <stop offset="100%" stop-color="#80001a" />
                </linearGradient>
                <linearGradient id="trailGreen_lvl2_nd" x1="0%" y1="100%" x2="0%" y2="0%">
                    <stop offset="0%" stop-color="#7fff00" stop-opacity="0.8" />
                    <stop offset="100%" stop-color="#7fff00" stop-opacity="0" />
                </linearGradient>
                <filter id="neonGlow_lvl2_nd">
                    <feGaussianBlur stdDeviation="8" result="coloredBlur"/>
                    <feMerge>
                        <feMergeNode in="coloredBlur"/>
                        <feMergeNode in="SourceGraphic"/>
                    </feMerge>
                </filter>
            </defs>
            <g transform="translate(500, 500) rotate(180) translate(-500, -500)">
                <!-- Neon-vihreät pakokaasut -->
                <polygon fill="url(#trailGreen_lvl2_nd)" opacity="0.3" points="400,650 380,800 420,800" filter="url(#neonGlow_lvl2_nd)"></polygon>
                <polygon fill="url(#trailGreen_lvl2_nd)" opacity="0.3" points="600,650 580,800 620,800" filter="url(#neonGlow_lvl2_nd)"></polygon>

                <!-- Monikerroksiset siivet (Vasen) -->
                <polygon fill="url(#wingGradientAlien3_lvl2_nd)" points="450,450 250,550 400,650"></polygon>
                <polygon fill="url(#mainBodyGradientAlien3_lvl2_nd)" points="380,480 200,530 320,590" opacity="0.7"></polygon>
                <polygon fill="#7fff00" points="320,510 260,535 300,560" filter="url(#neonGlow_lvl2_nd)" opacity="0.8"></polygon>

                <!-- Monikerroksiset siivet (Oikea) -->
                <polygon fill="url(#wingGradientAlien3_lvl2_nd)" points="550,450 750,550 600,650"></polygon>
                <polygon fill="url(#mainBodyGradientAlien3_lvl2_nd)" points="620,480 800,530 680,590" opacity="0.7"></polygon>
                <polygon fill="#7fff00" points="680,510 740,535 700,560" filter="url(#neonGlow_lvl2_nd)" opacity="0.8"></polygon>

                <!-- Kulmikas päärunko -->
                <polygon fill="url(#mainBodyGradientAlien3_lvl2_nd)" points="500,280 430,450 500,480"></polygon>
                <polygon fill="url(#mainBodyGradientAlien3_lvl2_nd)" points="500,280 570,450 500,480"></polygon>
                <polygon fill="url(#mainBodyGradientAlien3_lvl2_nd)" points="430,450 570,450 400,650 600,650"></polygon>

                <!-- Terävä violetti ydinsensori -->
                <polygon fill="url(#cockpitGradientAlien3_lvl2_nd)" points="500,320 450,420 500,450"></polygon>
                <polygon fill="url(#cockpitGradientAlien3_lvl2_nd)" points="500,320 550,420 500,450"></polygon>
                <polygon fill="#ffffff" opacity="0.6" points="500,340 480,400 500,415"></polygon>

                <!-- Tehosteet ja moottorit -->
                <polygon fill="url(#accentGradientAlien3_lvl2_nd)" points="420,700 400,750 440,750"></polygon>
                <polygon fill="url(#accentGradientAlien3_lvl2_nd)" points="580,700 560,750 600,750"></polygon>
                <polygon fill="url(#exhaustGradientAlien3_lvl2_nd)" points="400,650 420,700 380,700"></polygon>
                <polygon fill="url(#exhaustGradientAlien3_lvl2_nd)" points="600,650 620,700 580,700"></polygon>
            </g>
        </svg>
    `;

    const OBSIDIAN_FANG_SVG = `
        <svg viewBox="0 0 1000 1000">
            <defs>
                <linearGradient id="mainBodyGradientAlien4_lvl2_of" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stop-color="#262626" />
                    <stop offset="50%" stop-color="#121212" />
                    <stop offset="100%" stop-color="#000000" />
                </linearGradient>
                <linearGradient id="wingGradientAlien4_lvl2_of" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stop-color="#ff1a1a" />
                    <stop offset="100%" stop-color="#660000" />
                </linearGradient>
                <linearGradient id="cockpitGradientAlien4_lvl2_of" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stop-color="#ff00aa" />
                    <stop offset="100%" stop-color="#660044" />
                </linearGradient>
                <linearGradient id="exhaustGradientAlien4_lvl2_of" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stop-color="#ffaa00" />
                    <stop offset="100%" stop-color="#995500" />
                </linearGradient>
                <linearGradient id="trailRed_lvl2_of" x1="0%" y1="100%" x2="0%" y2="0%">
                    <stop offset="0%" stop-color="#ff1a1a" stop-opacity="0.8" />
                    <stop offset="100%" stop-color="#ff1a1a" stop-opacity="0" />
                </linearGradient>
                <filter id="neonGlow_lvl2_of">
                    <feGaussianBlur stdDeviation="8" result="coloredBlur"/>
                    <feMerge>
                        <feMergeNode in="coloredBlur"/>
                        <feMergeNode in="SourceGraphic"/>
                    </feMerge>
                </filter>
            </defs>
            <g transform="translate(500, 500) rotate(180) translate(-500, -500)">
                <!-- Punaiset moottoritulet -->
                <polygon fill="url(#trailRed_lvl2_of)" opacity="0.35" points="400,600 380,750 420,750" filter="url(#neonGlow_lvl2_of)"></polygon>
                <polygon fill="url(#trailRed_lvl2_of)" opacity="0.35" points="600,600 580,750 620,750" filter="url(#neonGlow_lvl2_of)"></polygon>

                <!-- Kristallimaiset siipipaneelit (Vasen) -->
                <polygon fill="url(#wingGradientAlien4_lvl2_of)" points="350,450 150,550 400,600"></polygon>
                <polygon fill="url(#mainBodyGradientAlien4_lvl2_of)" points="330,460 210,530 360,560" opacity="0.9"></polygon>
                <polygon fill="#ff1a1a" points="260,510 200,535 240,545" filter="url(#neonGlow_lvl2_of)" opacity="0.8"></polygon>

                <!-- Kristallimaiset siipipaneelit (Oikea) -->
                <polygon fill="url(#wingGradientAlien4_lvl2_of)" points="650,450 850,550 600,600"></polygon>
                <polygon fill="url(#mainBodyGradientAlien4_lvl2_of)" points="670,460 790,530 640,560" opacity="0.9"></polygon>
                <polygon fill="#ff1a1a" points="740,510 800,535 760,545" filter="url(#neonGlow_lvl2_of)" opacity="0.8"></polygon>

                <!-- Särmikäs Obsidian-runko -->
                <polygon fill="url(#mainBodyGradientAlien4_lvl2_of)" points="500,280 350,450 500,490"></polygon>
                <polygon fill="url(#mainBodyGradientAlien4_lvl2_of)" points="500,280 650,450 500,490"></polygon>
                <polygon fill="url(#mainBodyGradientAlien4_lvl2_of)" points="350,450 650,450 400,600 600,600"></polygon>

                <!-- Eteenpäin suunnatut terävät hampaat (Fangs) -->
                <polygon fill="url(#mainBodyGradientAlien4_lvl2_of)" points="400,320 370,180 430,280"></polygon>
                <polygon fill="url(#mainBodyGradientAlien4_lvl2_of)" points="600,320 630,180 570,280"></polygon>

                <!-- Syvänpunainen ydin -->
                <polygon fill="url(#cockpitGradientAlien4_lvl2_of)" points="500,320 460,420 500,450"></polygon>
                <polygon fill="url(#cockpitGradientAlien4_lvl2_of)" points="500,320 540,420 500,450"></polygon>

                <!-- Alaosan suuttimet -->
                <polygon fill="url(#exhaustGradientAlien4_lvl2_of)" points="400,600 420,650 380,650"></polygon>
                <polygon fill="url(#exhaustGradientAlien4_lvl2_of)" points="600,600 620,650 580,650"></polygon>
            </g>
        </svg>
    `;

    const ASTRAL_HORROR_SVG = `
        <svg viewBox="0 0 1000 1000">
            <defs>
                <linearGradient id="mainBodyGradientAlien8_lvl2_ah" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stop-color="#4a005c" />
                    <stop offset="50%" stop-color="#210033" />
                    <stop offset="100%" stop-color="#090014" />
                </linearGradient>
                <linearGradient id="wingGradientAlien8_lvl2_ah" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stop-color="#a6ff00" />
                    <stop offset="100%" stop-color="#4d9900" />
                </linearGradient>
                <linearGradient id="cockpitGradientAlien8_lvl2_ah" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stop-color="#ff00ff" />
                    <stop offset="100%" stop-color="#990099" />
                </linearGradient>
                <linearGradient id="exhaustGradientAlien8_lvl2_ah" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stop-color="#00ffff" />
                    <stop offset="100%" stop-color="#0066aa" />
                </linearGradient>
                <linearGradient id="accentGradientAlien8_lvl2_ah" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stop-color="#ffea00" />
                    <stop offset="100%" stop-color="#b3a000" />
                </linearGradient>
                <linearGradient id="trailCyan_lvl2_ah" x1="0%" y1="100%" x2="0%" y2="0%">
                    <stop offset="0%" stop-color="#00ffff" stop-opacity="0.8" />
                    <stop offset="100%" stop-color="#00ffff" stop-opacity="0" />
                </linearGradient>
                <filter id="neonGlow_lvl2_ah">
                    <feGaussianBlur stdDeviation="8" result="coloredBlur"/>
                    <feMerge>
                        <feMergeNode in="coloredBlur"/>
                        <feMergeNode in="SourceGraphic"/>
                    </feMerge>
                </filter>
            </defs>
            <g transform="translate(500, 500) rotate(180) translate(-500, -500)">
                <!-- Jättimäiset siniset pakokaasut -->
                <polygon fill="url(#trailCyan_lvl2_ah)" opacity="0.3" points="300,750 250,920 350,920" filter="url(#neonGlow_lvl2_ah)"></polygon>
                <polygon fill="url(#trailCyan_lvl2_ah)" opacity="0.3" points="700,750 650,920 750,920" filter="url(#neonGlow_lvl2_ah)"></polygon>

                <!-- Särmikkäät ja massiiviset siivet (Vasen) -->
                <polygon fill="url(#wingGradientAlien8_lvl2_ah)" points="380,500 150,400 300,750"></polygon>
                <polygon fill="url(#mainBodyGradientAlien8_lvl2_ah)" points="360,510 200,450 300,680" opacity="0.95"></polygon>
                <polygon fill="#a6ff00" points="260,470 180,430 220,530" filter="url(#neonGlow_lvl2_ah)" opacity="0.8"></polygon>

                <!-- Särmikkäät ja massiiviset siivet (Oikea) -->
                <polygon fill="url(#wingGradientAlien8_lvl2_ah)" points="620,500 850,400 700,750"></polygon>
                <polygon fill="url(#mainBodyGradientAlien8_lvl2_ah)" points="640,510 800,450 700,680" opacity="0.95"></polygon>
                <polygon fill="#a6ff00" points="740,470 820,430 780,530" filter="url(#neonGlow_lvl2_ah)" opacity="0.8"></polygon>

                <!-- Moniulotteinen ja geometrinen pääpanssari -->
                <polygon fill="url(#mainBodyGradientAlien8_lvl2_ah)" points="500,150 420,300 500,340"></polygon>
                <polygon fill="url(#mainBodyGradientAlien8_lvl2_ah)" points="500,150 580,300 500,340"></polygon>
                <polygon fill="url(#mainBodyGradientAlien8_lvl2_ah)" points="420,300 580,300 380,500 620,500"></polygon>
                <polygon fill="url(#mainBodyGradientAlien8_lvl2_ah)" points="380,500 620,500 300,750 700,750"></polygon>

                <!-- Keulan valtavat piikit/sarvet -->
                <polygon fill="url(#mainBodyGradientAlien8_lvl2_ah)" points="400,200 330,80 430,180"></polygon>
                <polygon fill="url(#mainBodyGradientAlien8_lvl2_ah)" points="600,200 670,80 570,180"></polygon>

                <!-- Hehkuva violetti ohjausmatriisi -->
                <polygon fill="url(#cockpitGradientAlien8_lvl2_ah)" points="500,180 440,280 500,320" filter="url(#neonGlow_lvl2_ah)"></polygon>
                <polygon fill="url(#cockpitGradientAlien8_lvl2_ah)" points="500,180 560,280 500,320" filter="url(#neonGlow_lvl2_ah)"></polygon>
                <polygon fill="#ffffff" opacity="0.5" points="500,200 470,270 500,295"></polygon>

                <!-- Keltaiset koristepaneelit -->
                <polygon fill="url(#accentGradientAlien8_lvl2_ah)" points="350,700 330,750 370,750"></polygon>
                <polygon fill="url(#accentGradientAlien8_lvl2_ah)" points="650,700 630,750 670,750"></polygon>

                <!-- Nelinkertaiset pakoputkikammiot -->
                <polygon fill="url(#exhaustGradientAlien8_lvl2_ah)" points="300,750 340,800 260,800"></polygon>
                <polygon fill="url(#exhaustGradientAlien8_lvl2_ah)" points="700,750 740,800 660,800"></polygon>
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

    // Necrotic Drone - Korkeampi terveys, tupla-ammukset
    function createNecroticDrone(x, y) {
        const enemy = {
            x: x,
            y: y,
            maxHealth: 5, 
            health: 5,
            speed: 2.3, 
            fireRate: 1600, 
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
                    enemyShootProjectile(this.x - 15, this.y + this.height / 2 - ENEMY_MUZZZLE_OFFSET_Y, playerX); 
                    enemyShootProjectile(this.x + 15, this.y + this.height / 2 - ENEMY_MUZZZLE_OFFSET_Y, playerX);
                    this.lastShotTime = currentTime;
                }
            }
        };
        createEnemyElement(enemy, NECROTIC_DRONE_SVG);
        updateEnemyHealthBar(enemy);
        return enemy;
    }

    // Obsidian Fang - Nopeampi, lievä vaakasuuntainen hakeutuminen
    function createObsidianFang(x, y) {
        const enemy = {
            x: x,
            y: y,
            maxHealth: 4,
            health: 4,
            speed: 3, 
            fireRate: 1700,
            lastShotTime: performance.now() + Math.random() * 500,
            width: ENEMY_WIDTH,
            height: ENEMY_HEIGHT,
            isBoss: false,
            trackingFactor: 0.05, 
            points: ENEMY_POINTS,
            update: function(currentTime, frameRateFactor, playerX) { 
                this.y += this.speed * frameRateFactor;

                if (playerX !== undefined) { 
                    if (this.x < playerX) {
                        this.x += this.trackingFactor * frameRateFactor * this.speed;
                    } else if (this.x > playerX) {
                        this.x -= this.trackingFactor * frameRateFactor * this.speed;
                    }
                    this.x = Math.max(this.width / 2, Math.min(gameWidthRef - this.width / 2, this.x));
                }
                updateEnemyElementPosition(this);
            },
            shoot: function(currentTime, playerX) {
                if (currentTime - this.lastShotTime > this.fireRate) {
                    enemyShootProjectile(this.x, this.y + this.height / 2 - ENEMY_MUZZZLE_OFFSET_Y, playerX);
                    this.lastShotTime = currentTime;
                }
            }
        };
        createEnemyElement(enemy, OBSIDIAN_FANG_SVG);
        updateEnemyHealthBar(enemy);
        return enemy;
    }

    // Astral Horror - Level 2 Pomo
    function createAstralHorror(x, y) {
        const boss = {
            x: x,
            y: y,
            maxHealth: 80, 
            health: 80,
            speed: 1.8, 
            bossSpeedX: 2, 
            fireRate: 800, 
            fireRateSpread: 3000, 
            lastShotTime: performance.now(),
            lastSpreadShotTime: performance.now(),
            width: ENEMY_WIDTH * 2.2, 
            height: ENEMY_HEIGHT * 2.2,
            isBoss: true,
            points: BOSS_POINTS,
            state: 'descend', 
            targetY: gameHeightRef * 0.25, 
            update: function(currentTime, frameRateFactor) {
                if (this.state === 'descend') {
                    this.y += this.speed * frameRateFactor;
                    if (this.y >= this.targetY) {
                        this.y = this.targetY;
                        this.state = 'patrol';
                    }
                } else if (this.state === 'patrol') {
                    this.x += this.bossSpeedX * frameRateFactor;
                    this.y = this.targetY + Math.sin(currentTime * 0.0005) * 10; 

                    if (this.x - this.width / 2 < 0 || this.x + this.width / 2 > gameWidthRef) {
                        this.bossSpeedX *= -1;
                        this.x = Math.max(this.width / 2, Math.min(gameWidthRef - this.width / 2, this.x));
                    }
                }
                updateEnemyElementPosition(this);
            },
            shoot: function(currentTime, playerX) {
                if (currentTime - this.lastShotTime > this.fireRate) {
                    enemyShootProjectile(this.x - 25, this.y + this.height / 2 - ENEMY_MUZZZLE_OFFSET_Y, playerX);
                    enemyShootProjectile(this.x, this.y + this.height / 2 - ENEMY_MUZZZLE_OFFSET_Y, playerX);
                    enemyShootProjectile(this.x + 25, this.y + this.height / 2 - ENEMY_MUZZZLE_OFFSET_Y, playerX);
                    this.lastShotTime = currentTime;
                }
                if (currentTime - this.lastSpreadShotTime > this.fireRateSpread) {
                    enemyShootProjectile(this.x - 40, this.y + this.height / 2 - ENEMY_MUZZZLE_OFFSET_Y, playerX - 60);
                    enemyShootProjectile(this.x - 20, this.y + this.height / 2 - ENEMY_MUZZZLE_OFFSET_Y, playerX - 30);
                    enemyShootProjectile(this.x, this.y + this.height / 2 - ENEMY_MUZZZLE_OFFSET_Y, playerX);
                    enemyShootProjectile(this.x + 20, this.y + this.height / 2 - ENEMY_MUZZZLE_OFFSET_Y, playerX + 30);
                    enemyShootProjectile(this.x + 40, this.y + this.height / 2 - ENEMY_MUZZZLE_OFFSET_Y, playerX + 60);
                    this.lastSpreadShotTime = currentTime;
                }
            }
        };
        createEnemyElement(boss, ASTRAL_HORROR_SVG);
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
            level2Boss = null;
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
            if (Math.random() < 0.6) { 
                newEnemy = createNecroticDrone(x, y);
            } else { 
                newEnemy = createObsidianFang(x, y);
            }
            gameContainerRef.appendChild(newEnemy.element);
            activeEnemies.push(newEnemy);
        },

        spawnBoss: function() {
            const x = gameWidthRef / 2;
            const y = -ENEMY_HEIGHT * 2.5; 
            level2Boss = createAstralHorror(x, y);
            gameContainerRef.appendChild(level2Boss.element);
            activeEnemies.push(level2Boss);
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
            if (level2Boss && level2Boss.state === 'patrol') {
                level2Boss.targetY = newHeight * 0.25;
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