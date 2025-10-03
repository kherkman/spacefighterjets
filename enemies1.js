// enemies1.js
(function() {
    const ENEMY_WIDTH = 80;
    const ENEMY_HEIGHT = 80;
    const ENEMY_PROJECTILE_SPEED = 6;
    const ENEMY_MUZZLE_OFFSET_Y = 55; // Adjust based on enemy SVG
    const ENEMY_POINTS = 100; // Score for destroying a regular enemy
    const BOSS_POINTS = 1000; // Score for destroying the boss

    let gameContainerRef;
    let gameWidthRef;
    let gameHeightRef;
    let playerXRef; // Reference to player's X position for aiming (updated by updateEnemies)


    let activeEnemies = [];
    let enemyProjectiles = [];
    let level1Boss = null;

    let regularEnemySpawnRate = 2500; // Spawn new enemy every X ms
    let lastRegularEnemySpawnTime = 0;
    let numRegularEnemiesSpawned = 0;
    const MAX_REGULAR_ENEMIES_BEFORE_BOSS = 8; // Spawn 8 regular enemies before the boss
    let bossSpawned = false;
    let bossDefeated = false;

    // SVG Definitions for Level 1 Enemies (Shadow Reaper, Xenon Spike, Abyssal Tyrant)
    // Updated gradient IDs to be unique for this module and enemy type
    const SHADOW_REAPER_SVG = `
        <svg viewBox="0 0 1000 1000">
            <defs>
                <linearGradient id="mainBodyGradientAlien1_lvl1_sr" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style="stop-color:#330044; stop-opacity:1" />
                    <stop offset="100%" style="stop-color:#1a0022; stop-opacity:1" />
                </linearGradient>
                <linearGradient id="wingGradientAlien1_lvl1_sr" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style="stop-color:#660000; stop-opacity:1" />
                    <stop offset="100%" style="stop-color:#cc0000; stop-opacity:1" />
                </linearGradient>
                <linearGradient id="cockpitGradientAlien1_lvl1_sr" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style="stop-color:#00ff00; stop-opacity:1" />
                    <stop offset="100%" style="stop-color:#009900; stop-opacity:1" />
                </linearGradient>
                <linearGradient id="exhaustGradientAlien1_lvl1_sr" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style="stop-color:#ff6600; stop-opacity:1" />
                    <stop offset="100%" style="stop-color:#ff3300; stop-opacity:1" />
                </linearGradient>
                <linearGradient id="accentGradientAlien1_lvl1_sr" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style="stop-color:#9900cc; stop-opacity:1" />
                    <stop offset="100%" style="stop-color:#660099; stop-opacity:1" />
                </linearGradient>
                <linearGradient id="trailPinkGradientAlien1_lvl1_sr" x1="0%" y1="100%" x2="0%" y2="0%">
                    <stop offset="0%" style="stop-color:#cc0000; stop-opacity:0.8" />
                    <stop offset="100%" style="stop-color:#cc0000; stop-opacity:0" />
                </linearGradient>
                <linearGradient id="trailBlueGradientAlien1_lvl1_sr" x1="0%" y1="100%" x2="0%" y2="0%">
                    <stop offset="0%" style="stop-color:#00ff00; stop-opacity:0.8" />
                    <stop offset="100%" style="stop-color:#00ff00; stop-opacity:0" />
                </linearGradient>
            </defs>
            <g transform="translate(500, 500) rotate(180) translate(-500, -500)">
                <polygon fill="url(#trailPinkGradientAlien1_lvl1_sr)" points="400,600 380,550 420,550"></polygon>
                <polygon fill="url(#trailBlueGradientAlien1_lvl1_sr)" points="600,600 580,550 620,550"></polygon>
                <polygon fill="url(#mainBodyGradientAlien1_lvl1_sr)" points="500,250 450,400 550,400"></polygon>
                <polygon fill="url(#mainBodyGradientAlien1_lvl1_sr)" points="450,400 550,400 400,600 600,600"></polygon>
                <polygon fill="url(#cockpitGradientAlien1_lvl1_sr)" points="500,300 490,380 510,380"></polygon>
                <polygon fill="url(#wingGradientAlien1_lvl1_sr)" points="450,400 200,500 400,600"></polygon>
                <polygon fill="url(#wingGradientAlien1_lvl1_sr)" points="550,400 800,500 600,600"></polygon>
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
                    <stop offset="0%" style="stop-color:#4a004a; stop-opacity:1" />
                    <stop offset="100%" style="stop-color:#2a002a; stop-opacity:1" />
                </linearGradient>
                <linearGradient id="wingGradientAlien2_lvl1_xs" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style="stop-color:#00ccff; stop-opacity:1" />
                    <stop offset="100%" style="stop-color:#0066cc; stop-opacity:1" />
                </linearGradient>
                <linearGradient id="cockpitGradientAlien2_lvl1_xs" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style="stop-color:#ff66ff; stop-opacity:1" />
                    <stop offset="100%" style="stop-color:#cc00cc; stop-opacity:1" />
                </linearGradient>
                <linearGradient id="exhaustGradientAlien2_lvl1_xs" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style="stop-color:#ff0000; stop-opacity:1" />
                    <stop offset="100%" style="stop-color:#cc0000; stop-opacity:1" />
                </linearGradient>
                <linearGradient id="accentGradientAlien2_lvl1_xs" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style="stop-color:#99ff00; stop-opacity:1" />
                    <stop offset="100%" style="stop-color:#66cc00; stop-opacity:1" />
                </linearGradient>
                <linearGradient id="trailPinkGradientAlien2_lvl1_xs" x1="0%" y1="100%" x2="0%" y2="0%">
                    <stop offset="0%" style="stop-color:#ff66ff; stop-opacity:0.8" />
                    <stop offset="100%" style="stop-color:#ff66ff; stop-opacity:0" />
                </linearGradient>
                <linearGradient id="trailBlueGradientAlien2_lvl1_xs" x1="0%" y1="100%" x2="0%" y2="0%">
                    <stop offset="0%" style="stop-color:#00ccff; stop-opacity:0.8" />
                    <stop offset="100%" style="stop-color:#00ccff; stop-opacity:0" />
                </linearGradient>
            </defs>
            <g transform="translate(500, 500) rotate(180) translate(-500, -500)">
                <polygon fill="url(#trailPinkGradientAlien2_lvl1_xs)" points="400,600 380,550 420,550"></polygon>
                <polygon fill="url(#trailBlueGradientAlien2_lvl1_xs)" points="600,600 580,550 620,550"></polygon>
                <polygon fill="url(#mainBodyGradientAlien2_lvl1_xs)" points="500,280 400,450 600,450"></polygon>
                <polygon fill="url(#mainBodyGradientAlien2_lvl1_xs)" points="400,450 600,450 450,650 550,650"></polygon>
                <polygon fill="url(#mainBodyGradientAlien2_lvl1_xs)" points="450,650 500,750 550,650"></polygon>
                <polygon fill="url(#cockpitGradientAlien2_lvl1_xs)" points="500,320 480,420 520,420"></polygon>
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
                    <stop offset="0%" style="stop-color:#31025e; stop-opacity:1" />
                    <stop offset="100%" style="stop-color:#05057e; stop-opacity:1" />
                </linearGradient>
                <linearGradient id="wingGradientAlien7_lvl1_ab" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style="stop-color:#9900ff; stop-opacity:1" />
                    <stop offset="100%" style="stop-color:#6600cc; stop-opacity:1" />
                </linearGradient>
                <linearGradient id="cockpitGradientAlien7_lvl1_ab" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style="stop-color:#ff0000; stop-opacity:1" />
                    <stop offset="100%" style="stop-color:#cc0000; stop-opacity:1" />
                </linearGradient>
                <linearGradient id="exhaustGradientAlien7_lvl1_ab" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style="stop-color:#00ff00; stop-opacity:1" />
                    <stop offset="100%" style="stop-color:#009900; stop-opacity:1" />
                </linearGradient>
                <linearGradient id="accentGradientAlien7_lvl1_ab" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style="stop-color:#ffcc00; stop-opacity:1" />
                    <stop offset="100%" style="stop-color:#ff9900; stop-opacity:1" />
                </linearGradient>
                <linearGradient id="trailPinkGradientAlien7_lvl1_ab" x1="0%" y1="100%" x2="0%" y2="0%">
                    <stop offset="0%" style="stop-color:#9900ff; stop-opacity:0.8" />
                    <stop offset="100%" style="stop-color:#9900ff; stop-opacity:0" />
                </linearGradient>
                <linearGradient id="trailBlueGradientAlien7_lvl1_ab" x1="0%" y1="100%" x2="0%" y2="0%">
                    <stop offset="0%" style="stop-color:#ff0000; stop-opacity:0.8" />
                    <stop offset="100%" style="stop-color:#ff0000; stop-opacity:0" />
                </linearGradient>
            </defs>
            <g transform="translate(500, 500) rotate(180) translate(-500, -500)">
                <polygon fill="url(#trailPinkGradientAlien7_lvl1_ab)" points="400,650 380,600 420,600"></polygon>
                <polygon fill="url(#trailBlueGradientAlien7_lvl1_ab)" points="600,650 580,600 620,600"></polygon>
                <polygon fill="url(#mainBodyGradientAlien7_lvl1_ab)" points="500,200 400,400 600,400"></polygon>
                <polygon fill="url(#mainBodyGradientAlien7_lvl1_ab)" points="400,400 600,400 350,600 650,600"></polygon>
                <polygon fill="url(#mainBodyGradientAlien7_lvl1_ab)" points="350,600 650,600 500,750"></polygon>
                <polygon fill="url(#cockpitGradientAlien7_lvl1_ab)" points="500,230 490,300 510,300"></polygon>
                <polygon fill="url(#wingGradientAlien7_lvl1_ab)" points="400,400 200,500 350,600"></polygon>
                <polygon fill="url(#wingGradientAlien7_lvl1_ab)" points="600,400 800,500 650,600"></polygon>
                <polygon fill="url(#accentGradientAlien7_lvl1_ab)" points="420,700 400,750 440,750"></polygon>
                <polygon fill="url(#accentGradientAlien7_lvl1_ab)" points="580,700 560,750 600,750"></polygon>
                <polygon fill="url(#exhaustGradientAlien7_lvl1_ab)" points="350,600 380,680 320,680"></polygon>
                <polygon fill="url(#exhaustGradientAlien7_lvl1_ab)" points="650,600 680,680 620,680"></polygon>
            </g>
        </svg>
    `;

    // --- Helper Functions for Enemies ---
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

    // --- Enemy Types (Factory Functions or Classes could be used) ---

    // Shadow Reaper - Basic enemy
    function createShadowReaper(x, y) {
        const enemy = {
            x: x,
            y: y,
            maxHealth: 3,
            health: 3,
            speed: 2,
            fireRate: 1800, // ms
            lastShotTime: performance.now() + Math.random() * 500, // Stagger initial shots
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
                    enemyShootProjectile(this.x, this.y + this.height / 2 - ENEMY_MUZZLE_OFFSET_Y, playerX); // Pass playerX
                    this.lastShotTime = currentTime;
                }
            }
        };
        createEnemyElement(enemy, SHADOW_REAPER_SVG);
        updateEnemyHealthBar(enemy);
        return enemy;
    }

    // Xenon Spike - Slightly faster, sine wave movement
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
            sineOffset: Math.random() * Math.PI * 2, // Starting point in sine wave
            sineSpeed: 0.005, // How fast it wiggles
            sineMagnitude: 30, // How far it wiggles left/right
            points: ENEMY_POINTS,
            update: function(currentTime, frameRateFactor) {
                this.y += this.speed * frameRateFactor;
                // Sine wave movement for horizontal wiggle
                this.x += Math.sin(this.sineOffset + currentTime * this.sineSpeed) * this.sineMagnitude * 0.1 * frameRateFactor;
                // Ensure it stays within bounds
                this.x = Math.max(this.width / 2, Math.min(gameWidthRef - this.width / 2, this.x));
                updateEnemyElementPosition(this);
            },
            shoot: function(currentTime, playerX) {
                if (currentTime - this.lastShotTime > this.fireRate) {
                    enemyShootProjectile(this.x, this.y + this.height / 2 - ENEMY_MUZZLE_OFFSET_Y, playerX); // Pass playerX
                    this.lastShotTime = currentTime;
                }
            }
        };
        createEnemyElement(enemy, XENON_SPIKE_SVG);
        updateEnemyHealthBar(enemy);
        return enemy;
    }

    // Abyssal Tyrant - Level 1 Boss
    function createAbyssalTyrant(x, y) {
        const boss = {
            x: x,
            y: y,
            maxHealth: 50,
            health: 50,
            speed: 1.5, // Initial descent speed
            bossSpeedX: 1, // Horizontal movement speed
            fireRate: 1000, // main weapon
            fireRateSecondary: 2500, // secondary weapon
            lastShotTime: performance.now(),
            lastSecondaryShotTime: performance.now(),
            width: ENEMY_WIDTH * 2, // Larger boss
            height: ENEMY_HEIGHT * 2,
            isBoss: true,
            points: BOSS_POINTS,
            state: 'descend', // 'descend', 'patrol'
            targetY: gameHeightRef * 0.2, // Target Y position to stop descending
            update: function(currentTime, frameRateFactor) {
                if (this.state === 'descend') {
                    this.y += this.speed * frameRateFactor;
                    if (this.y >= this.targetY) {
                        this.y = this.targetY;
                        this.state = 'patrol';
                    }
                } else if (this.state === 'patrol') {
                    this.x += this.bossSpeedX * frameRateFactor;
                    // Reverse direction if hitting screen edges
                    if (this.x - this.width / 2 < 0 || this.x + this.width / 2 > gameWidthRef) {
                        this.bossSpeedX *= -1;
                        // Ensure it stays within bounds
                        this.x = Math.max(this.width / 2, Math.min(gameWidthRef - this.width / 2, this.x));
                    }
                }
                updateEnemyElementPosition(this);
            },
            shoot: function(currentTime, playerX) {
                // Main weapon: dual shot
                if (currentTime - this.lastShotTime > this.fireRate) {
                    enemyShootProjectile(this.x - 20, this.y + this.height / 2 - ENEMY_MUZZLE_OFFSET_Y, playerX);
                    enemyShootProjectile(this.x + 20, this.y + this.height / 2 - ENEMY_MUZZLE_OFFSET_Y, playerX);
                    this.lastShotTime = currentTime;
                }
                // Secondary weapon: spread shot (every 2.5 seconds)
                if (currentTime - this.lastSecondaryShotTime > this.fireRateSecondary) {
                    // For spread, aim slightly outwards from center to create fan effect
                    enemyShootProjectile(this.x - 30, this.y + this.height / 2 - ENEMY_MUZZLE_OFFSET_Y, playerX - 50); // Aim left
                    enemyShootProjectile(this.x, this.y + this.height / 2 - ENEMY_MUZZLE_OFFSET_Y, playerX); // Aim center
                    enemyShootProjectile(this.x + 30, this.y + this.height / 2 - ENEMY_MUZZLE_OFFSET_Y, playerX + 50); // Aim right
                    this.lastSecondaryShotTime = currentTime;
                }
            }
        };
        createEnemyElement(boss, ABYSSAL_TYRANT_SVG);
        boss.element.style.width = `${boss.width}px`; // Apply boss specific size
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
        
        enemyProjectiles.push({ element: projectile, y: startY, x: startX, speedX: speedX, speedY: speedY, type: 'standard' });
    }

    // --- Module Exported Functions ---
    window.currentLevelModule = {
        initLevel: function(gameContainer, gameWidth, gameHeight) {
            gameContainerRef = gameContainer;
            gameWidthRef = gameWidth;
            gameHeightRef = gameHeight;

            this.reset(); // Reset state for a fresh level start
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
                this.spawnBoss(); // Spawn boss once regular enemies limit is reached
                bossSpawned = true;
            }

            for (let i = activeEnemies.length - 1; i >= 0; i--) {
                const enemy = activeEnemies[i];
                enemy.update(currentTime, frameRateFactor, playerXRef); // Pass playerXRef to enemy update
                enemy.shoot(currentTime, playerXRef); // Pass playerXRef to enemy shoot

                // Remove if off-screen (only for regular enemies, boss stays on screen until defeated)
                if (!enemy.isBoss && enemy.y > gameHeightRef + enemy.height / 2) {
                    enemy.element.remove();
                    activeEnemies.splice(i, 1);
                }
            }
        },

        spawnRegularEnemy: function() {
            const x = Math.random() * (gameWidthRef - ENEMY_WIDTH) + ENEMY_WIDTH / 2;
            const y = -ENEMY_HEIGHT; // Start off-screen at the top

            let newEnemy;
            if (Math.random() < 0.5) { // 50% chance for Shadow Reaper
                newEnemy = createShadowReaper(x, y);
            } else { // 50% chance for Xenon Spike
                newEnemy = createXenonSpike(x, y);
            }
            gameContainerRef.appendChild(newEnemy.element);
            activeEnemies.push(newEnemy);
        },

        spawnBoss: function() {
            const x = gameWidthRef / 2;
            const y = -ENEMY_HEIGHT * 2; // Start boss further off-screen
            level1Boss = createAbyssalTyrant(x, y);
            gameContainerRef.appendChild(level1Boss.element);
            activeEnemies.push(level1Boss);
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
                        playerProjectiles.splice(i, 1); // Remove player projectile
                        updateEnemyHealthBar(enemy);

                        if (enemy.health <= 0) {
                            addScoreCallback(enemy.points, p.owner); // Pass ownerId for scoring
                            createExplosionCallback(enemy.x, enemy.y);
                            enemy.element.remove();
                            activeEnemies.splice(j, 1); // Remove enemy
                            if (enemy.isBoss) {
                                bossDefeated = true;
                            }
                        }
                        break; // Projectile hit, no need to check other enemies with this projectile
                    }
                }
            }
        },

        checkCollisionsWithPlayer: function(playerRect, loseLifeCallback) {
            // Enemy Projectile vs. Player
            for (let i = enemyProjectiles.length - 1; i >= 0; i--) {
                const ep = enemyProjectiles[i];
                const epRect = ep.element.getBoundingClientRect();

                if (checkCollision(epRect, playerRect)) {
                    loseLifeCallback();
                    ep.element.remove();
                    enemyProjectiles.splice(i, 1); // Remove enemy projectile
                }
            }

            // Enemy (body) vs. Player (for direct collision damage)
            for (let i = activeEnemies.length - 1; i >= 0; i--) {
                const enemy = activeEnemies[i];
                const enemyRect = enemy.element.getBoundingClientRect();

                if (checkCollision(enemyRect, playerRect)) {
                    loseLifeCallback(); // Player takes damage
                    // Enemy also takes damage/is destroyed on collision with player
                    createExplosionParticles(enemy.x, enemy.y);
                    enemy.element.remove();
                    activeEnemies.splice(i, 1);
                    if (enemy.isBoss) {
                        bossDefeated = true; // Boss also counts as defeated if player crashes into it
                    }
                }
            }
        },

        isBossDefeated: function() {
            return bossDefeated;
        },

        isBossLevel: function() {
            return bossSpawned; // Level 1 becomes a boss level once the boss spawns
        },

        onResize: function(newWidth, newHeight) {
            gameWidthRef = newWidth;
            gameHeightRef = newHeight;
            // Adjust boss targetY if it's currently active
            if (level1Boss && level1Boss.state === 'patrol') {
                level1Boss.targetY = newHeight * 0.2; // Recalculate based on new height
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