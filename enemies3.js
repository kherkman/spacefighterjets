// enemies3.js
(function() {
    const ENEMY_WIDTH = 80;
    const ENEMY_HEIGHT = 80;
    const ENEMY_PROJECTILE_SPEED = 8; // Even faster enemy projectiles
    const ENEMY_MUZZLE_OFFSET_Y = 55;
    const ENEMY_POINTS = 200; // More points for Level 3 regular enemies
    const BOSS_POINTS = 3000; // More points for Level 3 boss

    let gameContainerRef;
    let gameWidthRef;
    let gameHeightRef;
    let playerXRef; // Reference to player's X position for aiming (updated by updateEnemies)

    let activeEnemies = [];
    let enemyProjectiles = [];
    let level3Boss = null;

    let regularEnemySpawnRate = 2000; // Even faster spawn rate
    let lastRegularEnemySpawnTime = 0;
    let numRegularEnemiesSpawned = 0;
    const MAX_REGULAR_ENEMIES_BEFORE_BOSS = 12; // Spawn more regular enemies before the boss
    let bossSpawned = false;
    let bossDefeated = false;

    // SVG Definitions for Level 3 Enemies (Viper Claw, Dread Scythe, Xenomind Sovereign)
    // Updated gradient IDs to be unique for this module and enemy type
    const VIPER_CLAW_SVG = `
        <svg viewBox="0 0 1000 1000">
            <defs>
                <linearGradient id="mainBodyGradientAlien5_lvl3_vc" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style="stop-color:#2a4a2a; stop-opacity:1" />
                    <stop offset="100%" style="stop-color:#001a00; stop-opacity:1" />
                </linearGradient>
                <linearGradient id="wingGradientAlien5_lvl3_vc" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style="stop-color:#ff33cc; stop-opacity:1" />
                    <stop offset="100%" style="stop-color:#990099; stop-opacity:1" />
                </linearGradient>
                <linearGradient id="cockpitGradientAlien5_lvl3_vc" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style="stop-color:#ffcc00; stop-opacity:1" />
                    <stop offset="100%" style="stop-color:#ff9900; stop-opacity:1" />
                </linearGradient>
                <linearGradient id="exhaustGradientAlien5_lvl3_vc" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style="stop-color:#00ff00; stop-opacity:1" />
                    <stop offset="100%" style="stop-color:#009900; stop-opacity:1" />
                </linearGradient>
                <linearGradient id="accentGradientAlien5_lvl3_vc" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style="stop-color:#ff00cc; stop-opacity:1" />
                    <stop offset="100%" style="stop-color:#990099; stop-opacity:1" />
                </linearGradient>
                <linearGradient id="trailPinkGradientAlien5_lvl3_vc" x1="0%" y1="100%" x2="0%" y2="0%">
                    <stop offset="0%" style="stop-color:#ff33cc; stop-opacity:0.8" />
                    <stop offset="100%" style="stop-color:#ff33cc; stop-opacity:0" />
                </linearGradient>
                <linearGradient id="trailBlueGradientAlien5_lvl3_vc" x1="0%" y1="100%" x2="0%" y2="0%">
                    <stop offset="0%" style="stop-color:#ffcc00; stop-opacity:0.8" />
                    <stop offset="100%" style="stop-color:#ffcc00; stop-opacity:0" />
                </linearGradient>
            </defs>
            <g transform="translate(500, 500) rotate(180) translate(-500, -500)">
                <polygon fill="url(#trailPinkGradientAlien5_lvl3_vc)" points="400,600 380,550 420,550"></polygon>
                <polygon fill="url(#trailBlueGradientAlien5_lvl3_vc)" points="600,600 580,550 620,550"></polygon>
                <polygon fill="url(#mainBodyGradientAlien5_lvl3_vc)" points="500,250 470,400 530,400"></polygon>
                <polygon fill="url(#mainBodyGradientAlien5_lvl3_vc)" points="470,400 530,400 400,600 600,600"></polygon>
                <polygon fill="url(#cockpitGradientAlien5_lvl3_vc)" points="500,280 490,350 510,350"></polygon>
                <polygon fill="url(#wingGradientAlien5_lvl3_vc)" points="400,600 200,500 250,650"></polygon>
                <polygon fill="url(#wingGradientAlien5_lvl3_vc)" points="600,600 800,500 750,650"></polygon>
                <polygon fill="url(#accentGradientAlien5_lvl3_vc)" points="450,700 430,750 470,750"></polygon>
                <polygon fill="url(#accentGradientAlien5_lvl3_vc)" points="550,700 530,750 570,750"></polygon>
                <polygon fill="url(#exhaustGradientAlien5_lvl3_vc)" points="400,600 420,650 380,650"></polygon>
                <polygon fill="url(#exhaustGradientAlien5_lvl3_vc)" points="600,600 620,650 580,650"></polygon>
            </g>
        </svg>
    `;

    const DREAD_SCYTHE_SVG = `
        <svg viewBox="0 0 1000 1000">
            <defs>
                <linearGradient id="mainBodyGradientAlien6_lvl3_ds" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style="stop-color:#804000; stop-opacity:1" />
                    <stop offset="100%" style="stop-color:#402000; stop-opacity:1" />
                </linearGradient>
                <linearGradient id="wingGradientAlien6_lvl3_ds" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style="stop-color:#ff6600; stop-opacity:1" />
                    <stop offset="100%" style="stop-color:#ff3300; stop-opacity:1" />
                </linearGradient>
                <linearGradient id="cockpitGradientAlien6_lvl3_ds" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style="stop-color:#00aaff; stop-opacity:1" />
                    <stop offset="100%" style="stop-color:#0066cc; stop-opacity:1" />
                </linearGradient>
                <linearGradient id="exhaustGradientAlien6_lvl3_ds" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style="stop-color:#ff00ff; stop-opacity:1" />
                    <stop offset="100%" style="stop-color:#cc00cc; stop-opacity:1" />
                </linearGradient>
                <linearGradient id="accentGradientAlien6_lvl3_ds" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style="stop-color:#99ff00; stop-opacity:1" />
                    <stop offset="100%" style="stop-color:#66cc00; stop-opacity:1" />
                </linearGradient>
                <linearGradient id="trailPinkGradientAlien6_lvl3_ds" x1="0%" y1="100%" x2="0%" y2="0%">
                    <stop offset="0%" style="stop-color:#ff6600; stop-opacity:0.8" />
                    <stop offset="100%" style="stop-color:#ff6600; stop-opacity:0" />
                </linearGradient>
                <linearGradient id="trailBlueGradientAlien6_lvl3_ds" x1="0%" y1="100%" x2="0%" y2="0%">
                    <stop offset="0%" style="stop-color:#00aaff; stop-opacity:0.8" />
                    <stop offset="100%" style="stop-color:#00aaff; stop-opacity:0" />
                </linearGradient>
            </defs>
            <g transform="translate(500, 500) rotate(180) translate(-500, -500)">
                <polygon fill="url(#trailPinkGradientAlien6_lvl3_ds)" points="400,600 380,550 420,550"></polygon>
                <polygon fill="url(#trailBlueGradientAlien6_lvl3_ds)" points="600,600 580,550 620,550"></polygon>
                <polygon fill="url(#mainBodyGradientAlien6_lvl3_ds)" points="500,280 300,500 700,500"></polygon>
                <polygon fill="url(#mainBodyGradientAlien6_lvl3_ds)" points="300,500 700,500 500,700"></polygon>
                <polygon fill="url(#cockpitGradientAlien6_lvl3_ds)" points="500,320 490,400 510,400"></polygon>
                <polygon fill="url(#wingGradientAlien6_lvl3_ds)" points="300,500 150,600 250,700"></polygon>
                <polygon fill="url(#wingGradientAlien6_lvl3_ds)" points="700,500 850,600 750,700"></polygon>
                <polygon fill="url(#accentGradientAlien6_lvl3_ds)" points="400,650 380,700 420,700"></polygon>
                <polygon fill="url(#accentGradientAlien6_lvl3_ds)" points="600,650 580,700 620,700"></polygon>
                <polygon fill="url(#exhaustGradientAlien6_lvl3_ds)" points="400,600 420,650 380,650"></polygon>
                <polygon fill="url(#exhaustGradientAlien6_lvl3_ds)" points="600,600 620,650 580,650"></polygon>
            </g>
        </svg>
    `;

    const XENOMIND_SOVEREIGN_SVG = `
        <svg viewBox="0 0 1000 1000">
            <defs>
                <linearGradient id="mainBodyGradientAlien9_lvl3_xs" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style="stop-color:#74147b; stop-opacity:1" />
                    <stop offset="100%" style="stop-color:#0b2163; stop-opacity:1" />
                </linearGradient>
                <linearGradient id="wingGradientAlien9_lvl3_xs" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style="stop-color:#ff00ff; stop-opacity:1" />
                    <stop offset="100%" style="stop-color:#cc00cc; stop-opacity:1" />
                </linearGradient>
                <linearGradient id="cockpitGradientAlien9_lvl3_xs" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style="stop-color:#ffcc00; stop-opacity:1" />
                    <stop offset="100%" style="stop-color:#ff9900; stop-opacity:1" />
                </linearGradient>
                <linearGradient id="exhaustGradientAlien9_lvl3_xs" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style="stop-color:#00ff00; stop-opacity:1" />
                    <stop offset="100%" style="stop-color:#009900; stop-opacity:1" />
                </linearGradient>
                <linearGradient id="accentGradientAlien9_lvl3_xs" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style="stop-color:#ff0000; stop-opacity:1" />
                    <stop offset="100%" style="stop-color:#cc0000; stop-opacity:1" />
                </linearGradient>
                <linearGradient id="trailPinkGradientAlien9_lvl3_xs" x1="0%" y1="100%" x2="0%" y2="0%">
                    <stop offset="0%" style="stop-color:#ff00ff; stop-opacity:0.8" />
                    <stop offset="100%" style="stop-color:#ff00ff; stop-opacity:0" />
                </linearGradient>
                <linearGradient id="trailBlueGradientAlien9_lvl3_xs" x1="0%" y1="100%" x2="0%" y2="0%">
                    <stop offset="0%" style="stop-color:#ffcc00; stop-opacity:0.8" />
                    <stop offset="100%" style="stop-color:#ffcc00; stop-opacity:0" />
                </linearGradient>
            </defs>
            <g transform="translate(500, 500) rotate(180) translate(-500, -500)">
                <polygon fill="url(#trailPinkGradientAlien9_lvl3_xs)" points="350,750 330,700 370,700"></polygon>
                <polygon fill="url(#trailBlueGradientAlien9_lvl3_xs)" points="650,750 630,700 670,700"></polygon>
                <polygon fill="url(#mainBodyGradientAlien9_lvl3_xs)" points="500,100 400,250 600,250"></polygon>
                <polygon fill="url(#mainBodyGradientAlien9_lvl3_xs)" points="400,250 600,250 300,500 700,500"></polygon>
                <polygon fill="url(#mainBodyGradientAlien9_lvl3_xs)" points="300,500 700,500 200,800 800,800"></polygon>
                <polygon fill="url(#cockpitGradientAlien9_lvl3_xs)" points="500,130 490,200 510,200"></polygon>
                <polygon fill="url(#wingGradientAlien9_lvl3_xs)" points="300,200 100,600 200,800"></polygon>
                <polygon fill="url(#wingGradientAlien9_lvl3_xs)" points="700,200 900,600 800,800"></polygon>
                <polygon fill="url(#accentGradientAlien9_lvl3_xs)" points="300,700 250,750 350,750"></polygon>
                <polygon fill="url(#accentGradientAlien9_lvl3_xs)" points="700,700 750,750 650,750"></polygon>
                <polygon fill="url(#exhaustGradientAlien9_lvl3_xs)" points="200,800 250,850 150,850"></polygon>
                <polygon fill="url(#exhaustGradientAlien9_lvl3_xs)" points="800,800 850,850 750,850"></polygon>
                <polygon fill="url(#exhaustGradientAlien9_lvl3_xs)" points="500,800 520,850 480,850"></polygon>
            </g>
        </svg>
    `;

    // --- Helper Functions for Enemies (repeated for self-containment) ---
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

    // Viper Claw - Fast, erratic movement, slight player aiming
    function createViperClaw(x, y) {
        const enemy = {
            x: x,
            y: y,
            maxHealth: 6,
            health: 6,
            speed: 3.5, // Faster
            fireRate: 1500,
            lastShotTime: performance.now() + Math.random() * 500,
            width: ENEMY_WIDTH,
            height: ENEMY_HEIGHT,
            isBoss: false,
            points: ENEMY_POINTS,
            sineOffset: Math.random() * Math.PI * 2,
            sineSpeed: 0.01,
            sineMagnitude: 40,
            update: function(currentTime, frameRateFactor) {
                this.y += this.speed * frameRateFactor;
                // Erratic horizontal movement
                this.x += Math.sin(this.sineOffset + currentTime * this.sineSpeed) * this.sineMagnitude * 0.2 * frameRateFactor;
                // Ensure it stays within bounds
                this.x = Math.max(this.width / 2, Math.min(gameWidthRef - this.width / 2, this.x));
                updateEnemyElementPosition(this);
            },
            shoot: function(currentTime, playerX) { // Accepts playerX for aiming
                if (currentTime - this.lastShotTime > this.fireRate) {
                    // Aim slightly towards the player's current X position
                    const targetX = playerX !== undefined ? playerX : this.x; // Fallback if playerXRef isn't available
                    const projectileStartX = this.x + (targetX > this.x ? 10 : -10); // Offset slightly
                    enemyShootProjectile(projectileStartX, this.y + this.height / 2 - ENEMY_MUZZLE_OFFSET_Y, targetX); // Pass targetX for aiming
                    this.lastShotTime = currentTime;
                }
            }
        };
        createEnemyElement(enemy, VIPER_CLAW_SVG);
        updateEnemyHealthBar(enemy);
        return enemy;
    }

    // Dread Scythe - Stops, fires a spread, then continues
    function createDreadScythe(x, y) {
        const enemy = {
            x: x,
            y: y,
            maxHealth: 5,
            health: 5,
            speed: 2.8,
            fireRate: 2500, // Cooldown for the whole burst
            lastShotTime: performance.now() + Math.random() * 1000,
            width: ENEMY_WIDTH,
            height: ENEMY_HEIGHT,
            isBoss: false,
            points: ENEMY_POINTS,
            stopY: gameHeightRef * (0.3 + Math.random() * 0.3), // Random stop point
            hasStopped: false,
            // Added type for onResize to identify
            type: 'DreadScythe',
            update: function(currentTime, frameRateFactor) {
                if (!this.hasStopped && this.y < this.stopY) {
                    this.y += this.speed * frameRateFactor;
                } else if (this.y >= this.stopY && !this.hasStopped) {
                    this.hasStopped = true; // Stop moving
                } else if (this.hasStopped && currentTime - this.lastShotTime > this.fireRate) {
                    // After shooting, start moving again
                    this.hasStopped = false;
                    this.y += this.speed * frameRateFactor;
                    this.stopY = gameHeightRef * (0.3 + Math.random() * 0.3); // Set new random stop point
                } else if (this.hasStopped && currentTime - this.lastShotTime <= this.fireRate) {
                    // Stay still during cooldown after burst
                } else {
                     this.y += this.speed * frameRateFactor; // Continue if already past stopY
                }
                updateEnemyElementPosition(this);
            },
            shoot: function(currentTime, playerX) {
                // Fires a spread shot after stopping
                if (this.hasStopped && currentTime - this.lastShotTime > this.fireRate) {
                    // Aim for positions offset from playerX for spread
                    enemyShootProjectile(this.x - 20, this.y + this.height / 2 - ENEMY_MUZZLE_OFFSET_Y, playerX - 30);
                    enemyShootProjectile(this.x, this.y + this.height / 2 - ENEMY_MUZZLE_OFFSET_Y, playerX);
                    enemyShootProjectile(this.x + 20, this.y + this.height / 2 - ENEMY_MUZZLE_OFFSET_Y, playerX + 30);
                    this.lastShotTime = currentTime;
                }
            }
        };
        createEnemyElement(enemy, DREAD_SCYTHE_SVG);
        updateEnemyHealthBar(enemy);
        return enemy;
    }

    // Xenomind Sovereign - Level 3 Boss
    function createXenomindSovereign(x, y) {
        const boss = {
            x: x,
            y: y,
            maxHealth: 120, // Very high health
            health: 120,
            speed: 1.5, // Initial descent speed
            bossSpeedX: 2.5, // Horizontal movement speed
            fireRatePrimary: 600, // Rapid dual shot
            fireRateSecondary: 2000, // Spread shot
            fireRateSpecial: 5000, // Slow, powerful orb
            lastShotTimePrimary: performance.now(),
            lastShotTimeSecondary: performance.now() + 1000,
            lastShotTimeSpecial: performance.now() + 2000,
            width: ENEMY_WIDTH * 2.5, // Even larger boss
            height: ENEMY_HEIGHT * 2.5,
            isBoss: true,
            points: BOSS_POINTS,
            state: 'descend', // 'descend', 'patrol', 'aggro'
            targetY: gameHeightRef * 0.2, // Target Y position to stop descending
            phase2HealthThreshold: 60, // Health below which boss enters aggro phase
            isChargingBeam: false, // For special orb
            beamChargeStartTime: 0, // For special orb
            beamChargeTime: 1000, // Time to charge special orb
            update: function(currentTime, frameRateFactor) {
                if (this.state === 'descend') {
                    this.y += this.speed * frameRateFactor;
                    if (this.y >= this.targetY) {
                        this.y = this.targetY;
                        this.state = 'patrol';
                    }
                } else if (this.state === 'patrol') {
                    this.x += this.bossSpeedX * frameRateFactor;
                    this.y = this.targetY + Math.sin(currentTime * 0.0007) * 15; // More pronounced bob
                    if (this.x - this.width / 2 < 0 || this.x + this.width / 2 > gameWidthRef) {
                        this.bossSpeedX *= -1;
                        this.x = Math.max(this.width / 2, Math.min(gameWidthRef - this.width / 2, this.x));
                    }
                    if (this.health <= this.phase2HealthThreshold) {
                        this.state = 'aggro';
                        this.bossSpeedX *= 1.5; // Faster movement
                        this.fireRatePrimary *= 0.8; // Faster primary fire
                    }
                } else if (this.state === 'aggro') {
                    // More erratic horizontal movement
                    this.x += this.bossSpeedX * frameRateFactor + Math.sin(currentTime * 0.001) * 5;
                    this.y = this.targetY + Math.cos(currentTime * 0.0012) * 20; // More erratic vertical bob

                    if (this.x - this.width / 2 < 0 || this.x + this.width / 2 > gameWidthRef) {
                        this.bossSpeedX *= -1;
                        this.x = Math.max(this.width / 2, Math.min(gameWidthRef - this.width / 2, this.x));
                    }
                }
                updateEnemyElementPosition(this);
            },
            shoot: function(currentTime, playerX) { // Accepts playerX for aiming special orb
                // Primary weapon: rapid dual shot
                if (currentTime - this.lastShotTimePrimary > this.fireRatePrimary) {
                    enemyShootProjectile(this.x - 30, this.y + this.height / 2 - ENEMY_MUZZLE_OFFSET_Y, playerX);
                    enemyShootProjectile(this.x + 30, this.y + this.height / 2 - ENEMY_MUZZLE_OFFSET_Y, playerX);
                    this.lastShotTimePrimary = currentTime;
                }
                // Secondary weapon: wider spread shot
                if (currentTime - this.lastShotTimeSecondary > this.fireRateSecondary) {
                    // Spread shot, aim for positions offset from playerX
                    enemyShootProjectile(this.x - 50, this.y + this.height / 2 - ENEMY_MUZZLE_OFFSET_Y, playerX - 80);
                    enemyShootProjectile(this.x - 25, this.y + this.height / 2 - ENEMY_MUZZLE_OFFSET_Y, playerX - 40);
                    enemyShootProjectile(this.x, this.y + this.height / 2 - ENEMY_MUZZLE_OFFSET_Y, playerX);
                    enemyShootProjectile(this.x + 25, this.y + this.height / 2 - ENEMY_MUZZLE_OFFSET_Y, playerX + 40);
                    enemyShootProjectile(this.x + 50, this.y + this.height / 2 - ENEMY_MUZZLE_OFFSET_Y, playerX + 80);
                    this.lastShotTimeSecondary = currentTime;
                }
                // Special weapon: powerful slow orb (with charge-up)
                if (this.isChargingBeam) {
                    if (currentTime - this.beamChargeStartTime >= this.beamChargeTime) {
                        // Pass playerX for targeting the orb
                        enemyShootSpecialOrb(this.x, this.y + this.height / 2 - ENEMY_MUZZLE_OFFSET_Y + 10, playerX);
                        this.isChargingBeam = false;
                        this.lastShotTimeSpecial = currentTime;
                    }
                    // Visual cue for charging could be added here
                } else if (currentTime - this.lastShotTimeSpecial > this.fireRateSpecial) {
                    this.isChargingBeam = true;
                    this.beamChargeStartTime = currentTime;
                }
            }
        };
        createEnemyElement(boss, XENOMIND_SOVEREIGN_SVG);
        boss.element.style.width = `${boss.width}px`;
        boss.element.style.height = `${boss.height}px`;
        updateEnemyHealthBar(boss);
        return boss;
    }

    // --- Enemy Projectile Logic (including new special orb) ---
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

    function enemyShootSpecialOrb(startX, startY, targetPlayerX) {
        const orb = document.createElement('div');
        orb.classList.add('enemy-projectile'); // Reuse projectile class
        orb.style.width = '20px'; // Larger orb
        orb.style.height = '20px';
        orb.style.borderRadius = '50%';
        orb.style.background = 'radial-gradient(circle at center, #ff00ff 0%, #990099 100%)'; // Distinct color
        orb.style.boxShadow = '0 0 10px #ff00ff, 0 0 20px rgba(255,0,255,0.7)';
        orb.style.left = `${startX - 10}px`;
        orb.style.top = `${startY}px`;
        gameContainerRef.appendChild(orb);
        // Slower, tracks playerX - need to calculate initial speedX, speedY towards target
        let speedX = 0;
        let speedY = ENEMY_PROJECTILE_SPEED * 0.7; // Slower speed for orb

        if (targetPlayerX !== undefined) {
            const dx = targetPlayerX - startX;
            const dy = (gameHeightRef * 0.8) - startY; // Aim slightly ahead of player

            const angle = Math.atan2(dy, dx);
            speedX = Math.cos(angle) * speedY; // Use orb's speed as magnitude
            speedY = Math.sin(angle) * speedY;
        }

        enemyProjectiles.push({ element: orb, x: startX, y: startY, speedX: speedX, speedY: speedY, type: 'special_orb', targetX: targetPlayerX });
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
            level3Boss = null;
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
                enemy.update(currentTime, frameRateFactor, playerXRef); // Pass playerXRef to enemy update
                enemy.shoot(currentTime, playerXRef); // Pass playerXRef to enemy shoot

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
            if (Math.random() < 0.5) { // 50% chance for Viper Claw
                newEnemy = createViperClaw(x, y);
            } else { // 50% chance for Dread Scythe
                newEnemy = createDreadScythe(x, y);
            }
            gameContainerRef.appendChild(newEnemy.element);
            activeEnemies.push(newEnemy);
        },

        spawnBoss: function() {
            const x = gameWidthRef / 2;
            const y = -ENEMY_HEIGHT * 2.8; // Start boss further off-screen
            level3Boss = createXenomindSovereign(x, y);
            gameContainerRef.appendChild(level3Boss.element);
            activeEnemies.push(level3Boss);
        },

        updateEnemyProjectiles: function(frameRateFactor) {
            for (let i = enemyProjectiles.length - 1; i >= 0; i--) {
                const ep = enemyProjectiles[i];

                // All projectiles now use speedX and speedY
                ep.x += ep.speedX * frameRateFactor;
                ep.y += ep.speedY * frameRateFactor;
                
                ep.element.style.left = `${ep.x - ep.element.offsetWidth / 2}px`;
                ep.element.style.top = `${ep.y - ep.element.offsetHeight / 2}px`;


                // Remove if off-screen (consider all sides for tracking projectiles)
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
            if (level3Boss && level3Boss.state === 'patrol') {
                level3Boss.targetY = newHeight * 0.2;
            }
            // Update stopY for Dread Scythe if needed
            activeEnemies.forEach(enemy => {
                // Check for 'type' property to correctly identify Dread Scythes
                if (enemy.type === 'DreadScythe' && !enemy.hasStopped) {
                    enemy.stopY = newHeight * (0.3 + Math.random() * 0.3); // Recalculate based on new height
                }
            });
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