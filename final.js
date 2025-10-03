// final.js
(function() {
    const ENEMY_WIDTH = 80; // Base width for calculations, boss will be much larger
    const ENEMY_HEIGHT = 80; // Base height for calculations
    const ENEMY_PROJECTILE_SPEED = 9; // Very fast projectiles
    const ENEMY_MUZZLE_OFFSET_Y = 55;
    const BOSS_POINTS = 10000; // Huge score for defeating the final boss

    let gameContainerRef;
    let gameWidthRef;
    let gameHeightRef;
    let playerXRef; // Reference to player's X position for aiming (updated by updateEnemies)

    let activeEnemies = []; // Will only contain the boss
    let enemyProjectiles = [];
    let finalBoss = null;

    let bossSpawned = false;
    let bossDefeated = false;

    // SVG Definition for the FINAL BOSS: Oblivion Maw
    // Updated gradient IDs to be unique for this module and enemy type
    const OBLIVION_MAW_SVG = `
        <svg viewBox="0 0 1000 1000">
            <defs>
                <linearGradient id="mainBodyGradientAlien10_final_om" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style="stop-color:#6a0785; stop-opacity:1" />
                    <stop offset="100%" style="stop-color:#980eaa; stop-opacity:1" />
                </linearGradient>
                <linearGradient id="wingGradientAlien10_final_om" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style="stop-color:#6119d5; stop-opacity:1" />
                    <stop offset="100%" style="stop-color:#8100cc; stop-opacity:1" />
                </linearGradient>
                <linearGradient id="cockpitGradientAlien10_final_om" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style="stop-color:#18c6e1; stop-opacity:1" />
                    <stop offset="100%" style="stop-color:#1fa0cb; stop-opacity:1" />
                </linearGradient>
                <linearGradient id="exhaustGradientAlien10_final_om" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style="stop-color:#3c28ce85; stop-opacity:1" />
                    <stop offset="100%" style="stop-color:#1244a8; stop-opacity:1" />
                </linearGradient>
                <linearGradient id="accentGradientAlien10_final_om" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style="stop-color:#00ffff; stop-opacity:1" />
                    <stop offset="100%" style="stop-color:#0088cc; stop-opacity:1" />
                </linearGradient>
                <linearGradient id="trailPinkGradientAlien10_final_om" x1="0%" y1="100%" x2="0%" y2="0%">
                    <stop offset="0%" style="stop-color:#ff00f2; stop-opacity:0.8" />
                    <stop offset="100%" style="stop-color:#bb00ff; stop-opacity:0" />
                </linearGradient>
                <linearGradient id="trailBlueGradientAlien10_final_om" x1="0%" y1="100%" x2="0%" y2="0%">
                    <stop offset="0%" style="stop-color:#ffcc00; stop-opacity:0.8" />
                    <stop offset="100%" style="stop-color:#ffcc00; stop-opacity:0" />
                </linearGradient>
            </defs>
            <g transform="translate(500, 500) rotate(180) translate(-500, -500)">
                <polygon fill="url(#trailPinkGradientAlien10_final_om)" points="300,800 280,700 320,700"></polygon>
                <polygon fill="url(#trailBlueGradientAlien10_final_om)" points="700,800 680,700 720,700"></polygon>
                <polygon fill="url(#mainBodyGradientAlien10_final_om)" points="500,100 200,400 800,400"></polygon>
                <polygon fill="url(#mainBodyGradientAlien10_final_om)" points="200,400 800,400 500,800"></polygon>
                <polygon fill="url(#mainBodyGradientAlien10_final_om)" points="500,100 350,250 650,250"></polygon>
                <polygon fill="url(#cockpitGradientAlien10_final_om)" points="500,150 490,200 510,200"></polygon>
                <polygon fill="url(#wingGradientAlien10_final_om)" points="200,400 50,500 150,600"></polygon>
                <polygon fill="url(#wingGradientAlien10_final_om)" points="800,400 950,500 850,600"></polygon>
                <polygon fill="url(#accentGradientAlien10_final_om)" points="300,700 250,750 350,750"></polygon>
                <polygon fill="url(#accentGradientAlien10_final_om)" points="700,700 750,750 650,750"></polygon>
                <polygon fill="url(#exhaustGradientAlien10_final_om)" points="500,800 400,900 600,900"></polygon>
                <polygon fill="url(#exhaustGradientAlien10_final_om)" points="200,400 250,450 150,450"></polygon>
                <polygon fill="url(#exhaustGradientAlien10_final_om)" points="800,400 850,450 750,450"></polygon>
            </g>
        </svg>
    `;

    // --- Helper Functions (repeated for self-containment) ---
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

    // --- Final Boss: Oblivion Maw ---
    function createOblivionMaw(x, y) {
        const boss = {
            x: x,
            y: y,
            maxHealth: 250, // Massive health pool
            health: 250,
            speed: 1.0, // Initial descent speed
            bossSpeedX: 1.5, // Horizontal speed in phase 1
            bossSpeedY: 1.0, // Vertical speed in phase 2
            fireRateVolley: 500, // Rapid volley
            fireRateSpread: 2000, // Wide spread
            fireRateBeam: 4000, // Powerful beam/orb
            lastShotTimeVolley: performance.now(),
            lastShotTimeSpread: performance.now() + 1000,
            lastShotTimeBeam: performance.now() + 2000,
            width: ENEMY_WIDTH * 3, // HUGE boss
            height: ENEMY_HEIGHT * 3,
            isBoss: true,
            points: BOSS_POINTS,
            state: 'descend', // 'descend', 'phase1', 'phase2', 'phase3'
            targetY: gameHeightRef * 0.15, // Target Y position to stop descending
            phase2HealthThreshold: 150, // Transition to phase 2
            phase3HealthThreshold: 75, // Transition to phase 3
            phase2Counter: 0, // Used for phase 2 movement
            phase3WaveSpeed: 0.002,
            phase3WaveMagnitude: 50,
            beamChargeTime: 1000, // Time to charge the beam attack
            isChargingBeam: false,
            beamChargeStartTime: 0,
            update: function(currentTime, frameRateFactor) {
                if (this.state === 'descend') {
                    this.y += this.speed * frameRateFactor;
                    if (this.y >= this.targetY) {
                        this.y = this.targetY;
                        this.state = 'phase1';
                    }
                } else if (this.state === 'phase1') {
                    // Sweeping horizontal movement
                    this.x += this.bossSpeedX * frameRateFactor;
                    if (this.x - this.width / 2 < 0 || this.x + this.width / 2 > gameWidthRef) {
                        this.bossSpeedX *= -1;
                        this.x = Math.max(this.width / 2, Math.min(gameWidthRef - this.width / 2, this.x));
                    }
                    if (this.health <= this.phase2HealthThreshold) {
                        this.state = 'phase2';
                        this.bossSpeedX *= 0.5; // Slow down horizontal
                        this.bossSpeedY = 1.0; // Start vertical movement
                    }
                } else if (this.state === 'phase2') {
                    // Vertical bobbing + slow horizontal movement
                    this.y += this.bossSpeedY * frameRateFactor;
                    if (this.y < this.targetY * 0.8 || this.y > this.targetY * 1.2) {
                        this.bossSpeedY *= -1;
                        this.y = Math.max(this.targetY * 0.8, Math.min(this.targetY * 1.2, this.y));
                    }
                    this.x += this.bossSpeedX * frameRateFactor; // Still some horizontal drift
                    if (this.x - this.width / 2 < 0 || this.x + this.width / 2 > gameWidthRef) {
                        this.bossSpeedX *= -1;
                        this.x = Math.max(this.width / 2, Math.min(gameWidthRef - this.width / 2, this.x));
                    }

                    if (this.health <= this.phase3HealthThreshold) {
                        this.state = 'phase3';
                        this.bossSpeedX *= 2; // Increase horizontal speed again
                    }
                } else if (this.state === 'phase3') {
                    // Aggressive sine wave movement both horizontally and slightly vertically
                    this.x += this.bossSpeedX * frameRateFactor + Math.sin(currentTime * this.phase3WaveSpeed * 1.5) * this.phase3WaveMagnitude * 0.5;
                    this.y = this.targetY + Math.cos(currentTime * this.phase3WaveSpeed * 0.8) * this.phase3WaveMagnitude * 0.3;

                    if (this.x - this.width / 2 < 0 || this.x + this.width / 2 > gameWidthRef) {
                        this.bossSpeedX *= -1;
                        this.x = Math.max(this.width / 2, Math.min(gameWidthRef - this.width / 2, this.x));
                    }
                }
                updateEnemyElementPosition(this);
            },
            shoot: function(currentTime, playerX) {
                // Volley fire (faster as health drops)
                let currentVolleyFireRate = this.fireRateVolley;
                if (this.state === 'phase2') currentVolleyFireRate *= 0.8;
                if (this.state === 'phase3') currentVolleyFireRate *= 0.6;

                if (currentTime - this.lastShotTimeVolley > currentVolleyFireRate) {
                    enemyShootProjectile(this.x - 40, this.y + this.height / 2 - ENEMY_MUZZLE_OFFSET_Y, playerX);
                    enemyShootProjectile(this.x, this.y + this.height / 2 - ENEMY_MUZZLE_OFFSET_Y, playerX);
                    enemyShootProjectile(this.x + 40, this.y + this.height / 2 - ENEMY_MUZZLE_OFFSET_Y, playerX);
                    this.lastShotTimeVolley = currentTime;
                }

                // Wide Spread Shot (more projectiles in later phases)
                if (currentTime - this.lastShotTimeSpread > this.fireRateSpread) {
                    // Spread shot, aim for positions offset from playerX
                    enemyShootProjectile(this.x - 70, this.y + this.height / 2 - ENEMY_MUZZLE_OFFSET_Y, playerX - 100);
                    enemyShootProjectile(this.x - 35, this.y + this.height / 2 - ENEMY_MUZZLE_OFFSET_Y, playerX - 50);
                    enemyShootProjectile(this.x, this.y + this.height / 2 - ENEMY_MUZZLE_OFFSET_Y, playerX);
                    enemyShootProjectile(this.x + 35, this.y + this.height / 2 - ENEMY_MUZZLE_OFFSET_Y, playerX + 50);
                    enemyShootProjectile(this.x + 70, this.y + this.height / 2 - ENEMY_MUZZLE_OFFSET_Y, playerX + 100);
                    if (this.state === 'phase2' || this.state === 'phase3') {
                        enemyShootProjectile(this.x - 100, this.y + this.height / 2 - ENEMY_MUZZLE_OFFSET_Y, playerX - 150);
                        enemyShootProjectile(this.x + 100, this.y + this.height / 2 - ENEMY_MUZZLE_OFFSET_Y, playerX + 150);
                    }
                    this.lastShotTimeSpread = currentTime;
                }

                // Powerful Beam/Orb Attack (with charge-up)
                if (this.isChargingBeam) {
                    if (currentTime - this.beamChargeStartTime >= this.beamChargeTime) {
                        enemyShootBeam(this.x, this.y + this.height / 2 - ENEMY_MUZZLE_OFFSET_Y, playerX);
                        this.isChargingBeam = false;
                        this.lastShotTimeBeam = currentTime;
                    }
                    // Visual cue for charging could be added here (e.g., flash the boss's exhaust or create a charging effect)
                } else if (currentTime - this.lastShotTimeBeam > this.fireRateBeam) {
                    this.isChargingBeam = true;
                    this.beamChargeStartTime = currentTime;
                }
            }
        };
        createEnemyElement(boss, OBLIVION_MAW_SVG);
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
        // Added x and speed for consistency with later levels, even if not fully utilized here.
        enemyProjectiles.push({ element: projectile, y: startY, x: startX, speedX: speedX, speedY: speedY, type: 'standard' });
    }

    function enemyShootBeam(startX, startY, targetPlayerX) {
        // This could be a large, fast-moving projectile or a temporary 'laser' div
        const beam = document.createElement('div');
        beam.classList.add('enemy-projectile');
        beam.style.width = '20px'; // Wider beam
        beam.style.height = '60px'; // Longer beam
        beam.style.background = 'linear-gradient(to top, #00ffff 0%, #0088cc 100%)'; // Distinct color
        beam.style.boxShadow = '0 0 10px #00ffff, 0 0 20px rgba(0,255,255,0.7)';
        beam.style.borderRadius = '5px';
        beam.style.left = `${startX - 10}px`;
        beam.style.top = `${startY}px`;
        gameContainerRef.appendChild(beam);
        
        let speedX = 0;
        let speedY = ENEMY_PROJECTILE_SPEED * 1.5; // Very fast beam

        if (targetPlayerX !== undefined) {
            const dx = targetPlayerX - startX;
            const dy = gameHeightRef - startY; // Aim towards bottom of screen
            
            const angle = Math.atan2(dy, dx); 
            speedX = Math.cos(angle) * speedY;
            speedY = Math.sin(angle) * speedY;
        }

        enemyProjectiles.push({ element: beam, y: startY, x: startX, speedX: speedX, speedY: speedY, type: 'beam' });
    }

    // --- Module Exported Functions ---
    window.currentLevelModule = {
        initLevel: function(gameContainer, gameWidth, gameHeight) {
            gameContainerRef = gameContainer;
            gameWidthRef = gameWidth;
            gameHeightRef = gameHeight;
            // playerXRef is now updated in updateEnemies from the main game loop

            this.reset();
            this.spawnBoss(); // Directly spawn the final boss
            bossSpawned = true; // Set flag immediately
        },

        reset: function() {
            activeEnemies.forEach(e => e.element.remove());
            enemyProjectiles.forEach(p => p.element.remove());
            activeEnemies.length = 0;
            enemyProjectiles.length = 0;
            finalBoss = null;
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

            // Only update the final boss
            if (finalBoss) {
                // Pass playerXRef to boss update/shoot methods if they need it for targeting/movement
                finalBoss.update(currentTime, frameRateFactor, playerXRef);
                finalBoss.shoot(currentTime, playerXRef);
            }
        },

        spawnRegularEnemy: function() {
            // No regular enemies in final.js
        },

        spawnBoss: function() {
            const x = gameWidthRef / 2;
            const y = -ENEMY_HEIGHT * 3.5; // Start boss even further off-screen
            finalBoss = createOblivionMaw(x, y);
            gameContainerRef.appendChild(finalBoss.element);
            activeEnemies.push(finalBoss);
        },

        updateEnemyProjectiles: function(frameRateFactor) {
            for (let i = enemyProjectiles.length - 1; i >= 0; i--) {
                const ep = enemyProjectiles[i];

                // All projectiles now use speedX and speedY
                ep.x += ep.speedX * frameRateFactor;
                ep.y += ep.speedY * frameRateFactor;
                
                ep.element.style.left = `${ep.x - ep.element.offsetWidth / 2}px`;
                ep.element.style.top = `${ep.y - ep.element.offsetHeight / 2}px`;


                // Remove if off-screen
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

                // Only check against the final boss
                if (finalBoss) {
                    const bossRect = finalBoss.element.getBoundingClientRect();

                    if (checkCollision(pRect, bossRect)) {
                        finalBoss.health--;
                        
                        // Add flash effect to boss when hit
                        finalBoss.element.classList.add('damaged-flash');
                        setTimeout(() => {
                            finalBoss.element.classList.remove('damaged-flash');
                        }, 300); // Remove flash class after 300ms

                        p.element.remove();
                        playerProjectiles.splice(i, 1);
                        updateEnemyHealthBar(finalBoss);

                        if (finalBoss.health <= 0) {
                            addScoreCallback(finalBoss.points, p.owner); // Pass ownerId for scoring
                            createExplosionCallback(finalBoss.x, finalBoss.y);
                            finalBoss.element.remove();
                            activeEnemies.splice(activeEnemies.indexOf(finalBoss), 1); // Remove from activeEnemies
                            bossDefeated = true; // Signal boss is defeated
                        }
                        break; // Projectile hit, no need to check further
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
                    enemyProjectiles.splice(i, 1);
                }
            }

            // Boss (body) vs. Player (for direct collision damage)
            if (finalBoss) {
                const bossRect = finalBoss.element.getBoundingClientRect();
                if (checkCollision(bossRect, playerRect)) {
                    loseLifeCallback();
                    // Player crashing into final boss is instant defeat (or significant damage)
                    // For simplicity, we'll count it as taking damage and the boss remains
                    // if (finalBoss.health > 0) finalBoss.health -= 10; // Boss takes damage too
                    // updateEnemyHealthBar(finalBoss);
                    // if (finalBoss.health <= 0) bossDefeated = true;
                    // For now, let's just make player take damage.
                }
            }
        },

        isBossDefeated: function() {
            return bossDefeated;
        },

        isBossLevel: function() {
            return true; // This module is exclusively a boss level
        },

        onResize: function(newWidth, newHeight) {
            gameWidthRef = newWidth;
            gameHeightRef = newHeight;
            if (finalBoss) {
                finalBoss.targetY = newHeight * 0.15;
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