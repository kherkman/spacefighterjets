// enemies2.js
(function() {
    const ENEMY_WIDTH = 80;
    const ENEMY_HEIGHT = 80;
    const ENEMY_PROJECTILE_SPEED = 7; // Slightly faster enemy projectiles
    const ENEMY_MUZZZLE_OFFSET_Y = 55;
    const ENEMY_POINTS = 150; // More points for Level 2 regular enemies
    const BOSS_POINTS = 2000; // More points for Level 2 boss

    let gameContainerRef;
    let gameWidthRef;
    let gameHeightRef;
    let playerXRef; // Reference to player's X position for aiming (updated by updateEnemies)

    let activeEnemies = [];
    let enemyProjectiles = [];
    let level2Boss = null;

    let regularEnemySpawnRate = 2200; // Faster spawn rate
    let lastRegularEnemySpawnTime = 0;
    let numRegularEnemiesSpawned = 0;
    const MAX_REGULAR_ENEMIES_BEFORE_BOSS = 10; // Spawn more regular enemies before the boss
    let bossSpawned = false;
    let bossDefeated = false;

    // SVG Definitions for Level 2 Enemies (Necrotic Drone, Obsidian Fang, Astral Horror)
    // Updated gradient IDs to be unique for this module and enemy type
    const NECROTIC_DRONE_SVG = `
        <svg viewBox="0 0 1000 1000">
            <defs>
                <linearGradient id="mainBodyGradientAlien3_lvl2_nd" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style="stop-color:#333300; stop-opacity:1" />
                    <stop offset="100%" style="stop-color:#1a1a00; stop-opacity:1" />
                </linearGradient>
                <linearGradient id="wingGradientAlien3_lvl2_nd" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style="stop-color:#66cc00; stop-opacity:1" />
                    <stop offset="100%" style="stop-color:#339900; stop-opacity:1" />
                </linearGradient>
                <linearGradient id="cockpitGradientAlien3_lvl2_nd" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style="stop-color:#cc00ff; stop-opacity:1" />
                    <stop offset="100%" style="stop-color:#660099; stop-opacity:1" />
                </linearGradient>
                <linearGradient id="exhaustGradientAlien3_lvl2_nd" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style="stop-color:#ffcc00; stop-opacity:1" />
                    <stop offset="100%" style="stop-color:#ff9900; stop-opacity:1" />
                </linearGradient>
                <linearGradient id="accentGradientAlien3_lvl2_nd" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style="stop-color:#ff0033; stop-opacity:1" />
                    <stop offset="100%" style="stop-color:#cc0000; stop-opacity:1" />
                </linearGradient>
                <linearGradient id="trailPinkGradientAlien3_lvl2_nd" x1="0%" y1="100%" x2="0%" y2="0%">
                    <stop offset="0%" style="stop-color:#66cc00; stop-opacity:0.8" />
                    <stop offset="100%" style="stop-color:#66cc00; stop-opacity:0" />
                </linearGradient>
                <linearGradient id="trailBlueGradientAlien3_lvl2_nd" x1="0%" y1="100%" x2="0%" y2="0%">
                    <stop offset="0%" style="stop-color:#cc00ff; stop-opacity:0.8" />
                    <stop offset="100%" style="stop-color:#cc00ff; stop-opacity:0" />
                </linearGradient>
            </defs>
            <g transform="translate(500, 500) rotate(180) translate(-500, -500)">
                <polygon fill="url(#trailPinkGradientAlien3_lvl2_nd)" points="400,650 380,600 420,600"></polygon>
                <polygon fill="url(#trailBlueGradientAlien3_lvl2_nd)" points="600,650 580,600 620,600"></polygon>
                <polygon fill="url(#mainBodyGradientAlien3_lvl2_nd)" points="500,280 450,450 550,450"></polygon>
                <polygon fill="url(#mainBodyGradientAlien3_lvl2_nd)" points="450,450 550,450 400,650 600,650"></polygon>
                <polygon fill="url(#cockpitGradientAlien3_lvl2_nd)" points="500,320 480,420 520,420"></polygon>
                <polygon fill="url(#wingGradientAlien3_lvl2_nd)" points="450,450 250,550 400,650"></polygon>
                <polygon fill="url(#wingGradientAlien3_lvl2_nd)" points="550,450 750,550 600,650"></polygon>
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
                    <stop offset="0%" style="stop-color:#000000; stop-opacity:1" />
                    <stop offset="100%" style="stop-color:#1a1a1a; stop-opacity:1" />
                </linearGradient>
                <linearGradient id="wingGradientAlien4_lvl2_of" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style="stop-color:#cc0000; stop-opacity:1" />
                    <stop offset="100%" style="stop-color:#800000; stop-opacity:1" />
                </linearGradient>
                <linearGradient id="cockpitGradientAlien4_lvl2_of" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style="stop-color:#ff00cc; stop-opacity:1" />
                    <stop offset="100%" style="stop-color:#990099; stop-opacity:1" />
                </linearGradient>
                <linearGradient id="exhaustGradientAlien4_lvl2_of" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style="stop-color:#ffcc00; stop-opacity:1" />
                    <stop offset="100%" style="stop-color:#ff9900; stop-opacity:1" />
                </linearGradient>
                <linearGradient id="accentGradientAlien4_lvl2_of" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style="stop-color:#00ff00; stop-opacity:1" />
                    <stop offset="100%" style="stop-color:#009900; stop-opacity:1" />
                </linearGradient>
                <linearGradient id="trailPinkGradientAlien4_lvl2_of" x1="0%" y1="100%" x2="0%" y2="0%">
                    <stop offset="0%" style="stop-color:#cc0000; stop-opacity:0.8" />
                    <stop offset="100%" style="stop-color:#cc0000; stop-opacity:0" />
                </linearGradient>
                <linearGradient id="trailBlueGradientAlien4_lvl2_of" x1="0%" y1="100%" x2="0%" y2="0%">
                    <stop offset="0%" style="stop-color:#ff00cc; stop-opacity:0.8" />
                    <stop offset="100%" style="stop-color:#ff00cc; stop-opacity:0" />
                </linearGradient>
            </defs>
            <g transform="translate(500, 500) rotate(180) translate(-500, -500)">
                <polygon fill="url(#trailPinkGradientAlien4_lvl2_of)" points="400,600 380,550 420,550"></polygon>
                <polygon fill="url(#trailBlueGradientAlien4_lvl2_of)" points="600,600 580,550 620,550"></polygon>
                <polygon fill="url(#mainBodyGradientAlien4_lvl2_of)" points="500,280 350,450 650,450"></polygon>
                <polygon fill="url(#mainBodyGradientAlien4_lvl2_of)" points="350,450 650,450 400,600 600,600"></polygon>
                <polygon fill="url(#cockpitGradientAlien4_lvl2_of)" points="500,320 490,400 510,400"></polygon>
                <polygon fill="url(#wingGradientAlien4_lvl2_of)" points="350,450 150,550 400,600"></polygon>
                <polygon fill="url(#wingGradientAlien4_lvl2_of)" points="650,450 850,550 600,600"></polygon>
                <polygon fill="url(#accentGradientAlien4_lvl2_of)" points="420,650 400,700 440,700"></polygon>
                <polygon fill="url(#accentGradientAlien4_lvl2_of)" points="580,650 560,700 600,700"></polygon>
                <polygon fill="url(#exhaustGradientAlien4_lvl2_of)" points="400,600 420,650 380,650"></polygon>
                <polygon fill="url(#exhaustGradientAlien4_lvl2_of)" points="600,600 620,650 580,650"></polygon>
            </g>
        </svg>
    `;

    const ASTRAL_HORROR_SVG = `
        <svg viewBox="0 0 1000 1000">
            <defs>
                <linearGradient id="mainBodyGradientAlien8_lvl2_ah" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style="stop-color:#4a004a; stop-opacity:1" />
                    <stop offset="100%" style="stop-color:#1a001a; stop-opacity:1" />
                </linearGradient>
                <linearGradient id="wingGradientAlien8_lvl2_ah" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style="stop-color:#99ff00; stop-opacity:1" />
                    <stop offset="100%" style="stop-color:#66cc00; stop-opacity:1" />
                </linearGradient>
                <linearGradient id="cockpitGradientAlien8_lvl2_ah" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style="stop-color:#ff00ff; stop-opacity:1" />
                    <stop offset="100%" style="stop-color:#cc00cc; stop-opacity:1" />
                </linearGradient>
                <linearGradient id="exhaustGradientAlien8_lvl2_ah" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style="stop-color:#00ffff; stop-opacity:1" />
                    <stop offset="100%" style="stop-color:#0088cc; stop-opacity:1" />
                </linearGradient>
                <linearGradient id="accentGradientAlien8_lvl2_ah" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style="stop-color:#ffcc00; stop-opacity:1" />
                    <stop offset="100%" style="stop-color:#ff9900; stop-opacity:1" />
                </linearGradient>
                <linearGradient id="trailPinkGradientAlien8_lvl2_ah" x1="0%" y1="100%" x2="0%" y2="0%">
                    <stop offset="0%" style="stop-color:#99ff00; stop-opacity:0.8" />
                    <stop offset="100%" style="stop-color:#99ff00; stop-opacity:0" />
                </linearGradient>
                <linearGradient id="trailBlueGradientAlien8_lvl2_ah" x1="0%" y1="100%" x2="0%" y2="0%">
                    <stop offset="0%" style="stop-color:#ff00ff; stop-opacity:0.8" />
                    <stop offset="100%" style="stop-color:#ff00ff; stop-opacity:0" />
                </linearGradient>
            </defs>
            <g transform="translate(500, 500) rotate(180) translate(-500, -500)">
                <polygon fill="url(#trailPinkGradientAlien8_lvl2_ah)" points="380,680 360,630 400,630"></polygon>
                <polygon fill="url(#trailBlueGradientAlien8_lvl2_ah)" points="620,680 600,630 640,630"></polygon>
                <polygon fill="url(#mainBodyGradientAlien8_lvl2_ah)" points="500,150 450,300 550,300"></polygon>
                <polygon fill="url(#mainBodyGradientAlien8_lvl2_ah)" points="450,300 550,300 380,500 620,500"></polygon>
                <polygon fill="url(#mainBodyGradientAlien8_lvl2_ah)" points="380,500 620,500 300,750 700,750"></polygon>
                <polygon fill="url(#cockpitGradientAlien8_lvl2_ah)" points="500,180 490,250 510,250"></polygon>
                <polygon fill="url(#wingGradientAlien8_lvl2_ah)" points="380,500 150,400 300,750"></polygon>
                <polygon fill="url(#wingGradientAlien8_lvl2_ah)" points="620,500 850,400 700,750"></polygon>
                <polygon fill="url(#accentGradientAlien8_lvl2_ah)" points="350,700 330,750 370,750"></polygon>
                <polygon fill="url(#accentGradientAlien8_lvl2_ah)" points="650,700 630,750 670,750"></polygon>
                <polygon fill="url(#exhaustGradientAlien8_lvl2_ah)" points="300,750 350,800 250,800"></polygon>
                <polygon fill="url(#exhaustGradientAlien8_lvl2_ah)" points="700,750 750,800 650,800"></polygon>
            </g>
        </svg>
    `;

    // --- Helper Functions for Enemies (repeated from enemies1.js for self-containment) ---
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
            enemy.healthBar.style.background = 'linear-gradient(to right, #ff0000, #cc0000)'; // Red
        } else if (healthPercentage > 30) {
            enemy.healthBar.style.background = 'linear-gradient(to right, #ffff00, #cc9900)'; // Yellow
        } else {
            enemy.healthBar.style.background = 'linear-gradient(to right, #ff0000, #990000)'; // Darker Red
        }
    }

    function updateEnemyElementPosition(enemy) {
        enemy.element.style.left = `${enemy.x - enemy.width / 2}px`;
        enemy.element.style.top = `${enemy.y - enemy.height / 2}px`;
    }

    // --- Enemy Types (Factory Functions) ---

    // Necrotic Drone - Higher health, dual shot
    function createNecroticDrone(x, y) {
        const enemy = {
            x: x,
            y: y,
            maxHealth: 5, // Increased health
            health: 5,
            speed: 2.3, // Slightly faster
            fireRate: 1600, // Faster firing
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
                    enemyShootProjectile(this.x - 15, this.y + this.height / 2 - ENEMY_MUZZZLE_OFFSET_Y, playerX); // Dual shot
                    enemyShootProjectile(this.x + 15, this.y + this.height / 2 - ENEMY_MUZZZLE_OFFSET_Y, playerX);
                    this.lastShotTime = currentTime;
                }
            }
        };
        createEnemyElement(enemy, NECROTIC_DRONE_SVG);
        updateEnemyHealthBar(enemy);
        return enemy;
    }

    // Obsidian Fang - Faster, mild horizontal tracking
    function createObsidianFang(x, y) {
        const enemy = {
            x: x,
            y: y,
            maxHealth: 4,
            health: 4,
            speed: 3, // Faster
            fireRate: 1700,
            lastShotTime: performance.now() + Math.random() * 500,
            width: ENEMY_WIDTH,
            height: ENEMY_HEIGHT,
            isBoss: false,
            trackingFactor: 0.05, // How much it tracks player horizontally
            points: ENEMY_POINTS,
            update: function(currentTime, frameRateFactor, playerX) { // Accepts playerX
                this.y += this.speed * frameRateFactor;

                // Simple player tracking (horizontal)
                if (playerX !== undefined) { // Use playerX for tracking
                    if (this.x < playerX) {
                        this.x += this.trackingFactor * frameRateFactor * this.speed;
                    } else if (this.x > playerX) {
                        this.x -= this.trackingFactor * frameRateFactor * this.speed;
                    }
                    // Keep within bounds
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

    // Astral Horror - Level 2 Boss
    function createAstralHorror(x, y) {
        const boss = {
            x: x,
            y: y,
            maxHealth: 80, // Much higher health
            health: 80,
            speed: 1.8, // Initial descent speed
            bossSpeedX: 2, // Horizontal movement speed
            fireRate: 800, // main weapon (faster)
            fireRateSpread: 3000, // spread shot
            lastShotTime: performance.now(),
            lastSpreadShotTime: performance.now(),
            width: ENEMY_WIDTH * 2.2, // Larger boss
            height: ENEMY_HEIGHT * 2.2,
            isBoss: true,
            points: BOSS_POINTS,
            state: 'descend', // 'descend', 'patrol'
            targetY: gameHeightRef * 0.25, // Target Y position to stop descending (slightly lower than L1)
            update: function(currentTime, frameRateFactor) {
                if (this.state === 'descend') {
                    this.y += this.speed * frameRateFactor;
                    if (this.y >= this.targetY) {
                        this.y = this.targetY;
                        this.state = 'patrol';
                    }
                } else if (this.state === 'patrol') {
                    // Sweeping horizontal movement with a slight vertical oscillation
                    this.x += this.bossSpeedX * frameRateFactor;
                    // Introduce a very subtle vertical bob
                    this.y = this.targetY + Math.sin(currentTime * 0.0005) * 10; // Slow bob

                    if (this.x - this.width / 2 < 0 || this.x + this.width / 2 > gameWidthRef) {
                        this.bossSpeedX *= -1;
                        this.x = Math.max(this.width / 2, Math.min(gameWidthRef - this.width / 2, this.x));
                    }
                }
                updateEnemyElementPosition(this);
            },
            shoot: function(currentTime, playerX) {
                // Main weapon: triple shot
                if (currentTime - this.lastShotTime > this.fireRate) {
                    enemyShootProjectile(this.x - 25, this.y + this.height / 2 - ENEMY_MUZZZLE_OFFSET_Y, playerX);
                    enemyShootProjectile(this.x, this.y + this.height / 2 - ENEMY_MUZZZLE_OFFSET_Y, playerX);
                    enemyShootProjectile(this.x + 25, this.y + this.height / 2 - ENEMY_MUZZZLE_OFFSET_Y, playerX);
                    this.lastShotTime = currentTime;
                }
                // Secondary weapon: wider spread shot
                if (currentTime - this.lastSpreadShotTime > this.fireRateSpread) {
                    // Spread shot, aim for positions offset from playerX
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


    // --- Enemy Projectile Logic ---
    function enemyShootProjectile(startX, startY, targetPlayerX) {
        const projectile = document.createElement('div');
        projectile.classList.add('enemy-projectile');
        
        let speedX = 0;
        let speedY = ENEMY_PROJECTILE_SPEED; // Always move down

        // If targetPlayerX is provided, calculate horizontal speed to aim
        if (targetPlayerX !== undefined) {
            const dx = targetPlayerX - startX;
            const dy = gameHeightRef - startY; // Aim towards bottom of screen
            
            const angle = Math.atan2(dy, dx); // Angle from projectile to target (bottom of screen)
            
            speedX = Math.cos(angle) * ENEMY_PROJECTILE_SPEED;
            speedY = Math.sin(angle) * ENEMY_PROJECTILE_SPEED;
        }

        projectile.style.left = `${startX - 2.5}px`; // Adjust for projectile width
        projectile.style.top = `${startY}px`;
        gameContainerRef.appendChild(projectile);
        // Storing all relevant projectile data
        enemyProjectiles.push({ element: projectile, y: startY, x: startX, speedX: speedX, speedY: speedY, type: 'standard' });
    }

    // --- Module Exported Functions ---
    window.currentLevelModule = {
        initLevel: function(gameContainer, gameWidth, gameHeight) {
            gameContainerRef = gameContainer;
            gameWidthRef = gameWidth;
            gameHeightRef = gameHeight;
            // playerXRef is now updated in updateEnemies from the main game loop

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
            playerXRef = undefined; // Reset playerXRef
        },

        // Modified to accept activePlayerXRefs
        updateEnemies: function(currentTime, frameRateFactor, activePlayerXRefs) {
            // Update playerXRef from the first active player, if any
            if (activePlayerXRefs && activePlayerXRefs.length > 0) {
                playerXRef = activePlayerXRefs[0];
            } else {
                playerXRef = undefined; // No active players
            }
            
            // Spawn regular enemies until boss condition met
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
                // Pass playerXRef to enemy update and shoot methods if they need it
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
            if (Math.random() < 0.6) { // 60% chance for Necrotic Drone
                newEnemy = createNecroticDrone(x, y);
            } else { // 40% chance for Obsidian Fang
                newEnemy = createObsidianFang(x, y);
            }
            gameContainerRef.appendChild(newEnemy.element);
            activeEnemies.push(newEnemy);
        },

        spawnBoss: function() {
            const x = gameWidthRef / 2;
            const y = -ENEMY_HEIGHT * 2.5; // Start boss further off-screen
            level2Boss = createAstralHorror(x, y);
            gameContainerRef.appendChild(level2Boss.element);
            activeEnemies.push(level2Boss);
        },

        updateEnemyProjectiles: function(frameRateFactor) {
            for (let i = enemyProjectiles.length - 1; i >= 0; i--) {
                const ep = enemyProjectiles[i];
                // Projectiles move according to their speedX and speedY
                ep.x += ep.speedX * frameRateFactor;
                ep.y += ep.speedY * frameRateFactor;
                ep.element.style.left = `${ep.x - ep.element.offsetWidth / 2}px`;
                ep.element.style.top = `${ep.y - ep.element.offsetHeight / 2}px`;

                // Remove if off-screen (consider all sides for aimed projectiles)
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

                        // Add flash effect to enemy when hit
                        enemy.element.classList.add('damaged-flash');
                        setTimeout(() => {
                            enemy.element.classList.remove('damaged-flash');
                        }, 300); // Remove flash class after 300ms

                        p.element.remove();
                        playerProjectiles.splice(i, 1);
                        updateEnemyHealthBar(enemy);

                        if (enemy.health <= 0) {
                            addScoreCallback(enemy.points, p.owner); // Pass ownerId for scoring
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

    // Global collision helper from index.html (assumes it's available)
    function checkCollision(rect1, rect2) {
        return rect1.left < rect2.right &&
               rect1.right > rect2.left &&
               rect1.top < rect2.bottom &&
               rect1.bottom > rect2.top;
    }

    // Global explosion callback from index.html (assumes it's available)
    function createExplosionParticles(x, y) {
        if (typeof window.createExplosionParticles === 'function') {
            window.createExplosionParticles(x, y);
        }
    }

})();