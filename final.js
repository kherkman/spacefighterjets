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

    // Upotettu ultra-yksityiskohtainen ja kiiltävä loppuvastustajan SVG-määrittely
    const OBLIVION_MAW_SVG = `
        <svg viewBox="0 0 1000 1000">
            <defs>
                <linearGradient id="mainBodyGradientAlien10_final_om" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stop-color="#4d0e6b" />
                    <stop offset="50%" stop-color="#24023c" />
                    <stop offset="100%" stop-color="#0a001a" />
                </linearGradient>
                <linearGradient id="wingGradientAlien10_final_om" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stop-color="#7c22ff" />
                    <stop offset="100%" stop-color="#3d0099" />
                </linearGradient>
                <linearGradient id="cockpitGradientAlien10_final_om" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stop-color="#ffffff" />
                    <stop offset="40%" stop-color="#00ffff" />
                    <stop offset="100%" stop-color="#005580" />
                </linearGradient>
                <linearGradient id="exhaustGradientAlien10_final_om" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stop-color="#3b089c" />
                    <stop offset="100%" stop-color="#120233" />
                </linearGradient>
                <linearGradient id="accentGradientAlien10_final_om" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stop-color="#00ffff" />
                    <stop offset="100%" stop-color="#0088cc" />
                </linearGradient>
                <linearGradient id="trailPinkGradientAlien10_final_om" x1="0%" y1="100%" x2="0%" y2="0%">
                    <stop offset="0%" stop-color="#ff00f2" stop-opacity="0.8" />
                    <stop offset="100%" stop-color="#bb00ff" stop-opacity="0" />
                </linearGradient>
                <linearGradient id="trailBlueGradientAlien10_final_om" x1="0%" y1="100%" x2="0%" y2="0%">
                    <stop offset="0%" stop-color="#00ffff" stop-opacity="0.8" />
                    <stop offset="100%" stop-color="#00ffff" stop-opacity="0" />
                </linearGradient>
                <filter id="neonGlow_final_om">
                    <feGaussianBlur stdDeviation="8" result="coloredBlur"/>
                    <feMerge>
                        <feMergeNode in="coloredBlur"/>
                        <feMergeNode in="SourceGraphic"/>
                    </feMerge>
                </filter>
            </defs>
            <g transform="translate(500, 500) rotate(180) translate(-500, -500)">
                <!-- Massiiviset ja leveät pakokaasut -->
                <polygon fill="url(#trailPinkGradientAlien10_final_om)" opacity="0.35" points="500,800 400,950 600,950" filter="url(#neonGlow_final_om)"></polygon>
                <polygon fill="url(#trailPinkGradientAlien10_final_om)" opacity="0.25" points="300,700 240,850 360,850" filter="url(#neonGlow_final_om)"></polygon>
                <polygon fill="url(#trailBlueGradientAlien10_final_om)" points="700,700 680,850 720,850" filter="url(#neonGlow_final_om)"></polygon>

                <!-- Jättiläismäiset kristallisiivet -->
                <path fill="url(#wingGradientAlien10_final_om)" d="M 500,350 C 250,150 100,200 50,450 C 10,650 120,800 300,850 C 200,680 250,450 400,380 Z"></path>
                <path fill="url(#wingGradientAlien10_final_om)" d="M 500,350 C 750,150 900,200 950,450 C 990,650 880,800 700,850 C 800,680 750,450 600,380 Z"></path>

                <!-- Siipien hienovaraiset kyber-valolinjat -->
                <path fill="url(#accentGradientAlien10_final_om)" filter="url(#neonGlow_final_om)" d="M 280,500 L 150,450 L 220,650 Z" opacity="0.8"></path>
                <path fill="url(#accentGradientAlien10_final_om)" filter="url(#neonGlow_final_om)" d="M 720,500 L 850,450 L 780,650 Z" opacity="0.8"></path>

                <!-- Monoliittimainen raskaasti panssaroitu keskushytti -->
                <path fill="url(#mainBodyGradientAlien10_final_om)" d="M 500,100 L 300,280 L 200,550 L 300,800 L 500,920 L 700,800 L 800,550 L 700,280 Z"></path>

                <!-- Särmikkäät ja pahaenteiset keulapiikit -->
                <polygon fill="url(#mainBodyGradientAlien10_final_om)" points="400,250 340,100 430,220"></polygon>
                <polygon fill="url(#mainBodyGradientAlien10_final_om)" points="600,250 660,100 570,220"></polygon>
                <polygon fill="url(#mainBodyGradientAlien10_final_om)" points="500,50 460,180 540,180"></polygon>

                <!-- Mahtava ja hohtava "Oblivion Maw" -pääase ja sensorisilmä -->
                <ellipse fill="#000000" cx="500" cy="500" rx="110" ry="160"></ellipse>
                <ellipse fill="url(#cockpitGradientAlien10_final_om)" filter="url(#neonGlow_final_om)" cx="500" cy="500" rx="90" ry="130"></ellipse>
                <!-- Korkeakiiltoiset heijastumat -->
                <ellipse fill="#ffffff" opacity="0.6" cx="460" cy="430" rx="25" ry="50" transform="rotate(-15 460 430)"></ellipse>
                <ellipse fill="#ffffff" opacity="0.3" cx="530" cy="560" rx="15" ry="25"></ellipse>

                <!-- Sivuasetornit ja lisäkoristeet -->
                <circle cx="280" cy="720" r="25" fill="url(#accentGradientAlien10_final_om)" filter="url(#neonGlow_final_om)"></circle>
                <circle cx="720" cy="720" r="25" fill="url(#accentGradientAlien10_final_om)" filter="url(#neonGlow_final_om)"></circle>
                <polygon fill="url(#exhaustGradientAlien10_final_om)" points="500,800 400,900 600,900"></polygon>
                <polygon fill="url(#exhaustGradientAlien10_final_om)" points="200,400 250,450 150,450"></polygon>
                <polygon fill="url(#exhaustGradientAlien10_final_om)" points="800,400 850,450 750,450"></polygon>

                <!-- Geometriset paneelirajat -->
                <line x1="300" y1="280" x2="700" y2="280" stroke="#000000" stroke-width="5" opacity="0.6"></line>
                <line x1="200" y1="550" x2="800" y2="550" stroke="#000000" stroke-width="5" opacity="0.6"></line>
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
            enemy.healthBar.style.background = 'linear-gradient(to right, #00ff66, #009933)'; 
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

    // --- Final Boss: Oblivion Maw ---
    function createOblivionMaw(x, y) {
        const boss = {
            x: x,
            y: y,
            maxHealth: 250, // Massiivinen määrä terveyttä
            health: 250,
            speed: 1.0, 
            bossSpeedX: 1.5, 
            bossSpeedY: 1.0, 
            fireRateVolley: 500, 
            fireRateSpread: 2000, 
            fireRateBeam: 4000, 
            lastShotTimeVolley: performance.now(),
            lastShotTimeSpread: performance.now() + 1000,
            lastShotTimeBeam: performance.now() + 2000,
            width: ENEMY_WIDTH * 3, // Jättimäinen alus peliin
            height: ENEMY_HEIGHT * 3,
            isBoss: true,
            points: BOSS_POINTS,
            state: 'descend', 
            targetY: gameHeightRef * 0.15, 
            phase2HealthThreshold: 150, 
            phase3HealthThreshold: 75, 
            phase2Counter: 0, 
            phase3WaveSpeed: 0.002,
            phase3WaveMagnitude: 50,
            beamChargeTime: 1000, 
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
                    this.x += this.bossSpeedX * frameRateFactor;
                    if (this.x - this.width / 2 < 0 || this.x + this.width / 2 > gameWidthRef) {
                        this.bossSpeedX *= -1;
                        this.x = Math.max(this.width / 2, Math.min(gameWidthRef - this.width / 2, this.x));
                    }
                    if (this.health <= this.phase2HealthThreshold) {
                        this.state = 'phase2';
                        this.bossSpeedX *= 0.5; 
                        this.bossSpeedY = 1.0; 
                    }
                } else if (this.state === 'phase2') {
                    this.y += this.bossSpeedY * frameRateFactor;
                    if (this.y < this.targetY * 0.8 || this.y > this.targetY * 1.2) {
                        this.bossSpeedY *= -1;
                        this.y = Math.max(this.targetY * 0.8, Math.min(this.targetY * 1.2, this.y));
                    }
                    this.x += this.bossSpeedX * frameRateFactor; 
                    if (this.x - this.width / 2 < 0 || this.x + this.width / 2 > gameWidthRef) {
                        this.bossSpeedX *= -1;
                        this.x = Math.max(this.width / 2, Math.min(gameWidthRef - this.width / 2, this.x));
                    }

                    if (this.health <= this.phase3HealthThreshold) {
                        this.state = 'phase3';
                        this.bossSpeedX *= 2; 
                    }
                } else if (this.state === 'phase3') {
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
                let currentVolleyFireRate = this.fireRateVolley;
                if (this.state === 'phase2') currentVolleyFireRate *= 0.8;
                if (this.state === 'phase3') currentVolleyFireRate *= 0.6;

                if (currentTime - this.lastShotTimeVolley > currentVolleyFireRate) {
                    enemyShootProjectile(this.x - 40, this.y + this.height / 2 - ENEMY_MUZZLE_OFFSET_Y, playerX);
                    enemyShootProjectile(this.x, this.y + this.height / 2 - ENEMY_MUZZLE_OFFSET_Y, playerX);
                    enemyShootProjectile(this.x + 40, this.y + this.height / 2 - ENEMY_MUZZLE_OFFSET_Y, playerX);
                    this.lastShotTimeVolley = currentTime;
                }

                if (currentTime - this.lastShotTimeSpread > this.fireRateSpread) {
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

                if (this.isChargingBeam) {
                    if (currentTime - this.beamChargeStartTime >= this.beamChargeTime) {
                        enemyShootBeam(this.x, this.y + this.height / 2 - ENEMY_MUZZLE_OFFSET_Y, playerX);
                        this.isChargingBeam = false;
                        this.lastShotTimeBeam = currentTime;
                    }
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

    function enemyShootBeam(startX, startY, targetPlayerX) {
        const beam = document.createElement('div');
        beam.classList.add('enemy-projectile');
        beam.style.width = '20px'; 
        beam.style.height = '60px'; 
        beam.style.background = 'linear-gradient(to top, #00ffff 0%, #0088cc 100%)'; 
        beam.style.boxShadow = '0 0 10px #00ffff, 0 0 20px rgba(0,255,255,0.7)';
        beam.style.borderRadius = '5px';
        beam.style.left = `${startX - 10}px`;
        beam.style.top = `${startY}px`;
        gameContainerRef.appendChild(beam);
        
        let speedX = 0;
        let speedY = ENEMY_PROJECTILE_SPEED * 1.5; 

        if (targetPlayerX !== undefined) {
            const dx = targetPlayerX - startX;
            const dy = gameHeightRef - startY; 
            
            const angle = Math.atan2(dy, dx); 
            speedX = Math.cos(angle) * speedY;
            speedY = Math.sin(angle) * speedY;
        }

        enemyProjectiles.push({ element: beam, y: startY, x: startX, speedX: speedX, speedY: speedY, type: 'beam' });
    }

    // --- Rajapinta pääpelin käyttöön ---
    window.currentLevelModule = {
        initLevel: function(gameContainer, gameWidth, gameHeight) {
            gameContainerRef = gameContainer;
            gameWidthRef = gameWidth;
            gameHeightRef = gameHeight;

            this.reset();
            this.spawnBoss(); 
            bossSpawned = true; 
        },

        reset: function() {
            activeEnemies.forEach(e => e.element.remove());
            enemyProjectiles.forEach(p => p.element.remove());
            activeEnemies.length = 0;
            enemyProjectiles.length = 0;
            finalBoss = null;
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

            if (finalBoss) {
                finalBoss.update(currentTime, frameRateFactor, playerXRef);
                finalBoss.shoot(currentTime, playerXRef);
            }
        },

        spawnRegularEnemy: function() {
            // Viimeisellä tasolla ei ole perusvihollisia
        },

        spawnBoss: function() {
            const x = gameWidthRef / 2;
            const y = -ENEMY_HEIGHT * 3.5; 
            finalBoss = createOblivionMaw(x, y);
            gameContainerRef.appendChild(finalBoss.element);
            activeEnemies.push(finalBoss);
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

                if (finalBoss) {
                    const bossRect = finalBoss.element.getBoundingClientRect();

                    if (checkCollision(pRect, bossRect)) {
                        finalBoss.health--;
                        
                        finalBoss.element.classList.add('damaged-flash');
                        setTimeout(() => {
                            finalBoss.element.classList.remove('damaged-flash');
                        }, 300); 

                        p.element.remove();
                        playerProjectiles.splice(i, 1);
                        updateEnemyHealthBar(finalBoss);

                        if (finalBoss.health <= 0) {
                            addScoreCallback(finalBoss.points, p.owner); 
                            createExplosionCallback(finalBoss.x, finalBoss.y);
                            finalBoss.element.remove();
                            activeEnemies.splice(activeEnemies.indexOf(finalBoss), 1); 
                            bossDefeated = true; 
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

            if (finalBoss) {
                const bossRect = finalBoss.element.getBoundingClientRect();
                if (checkCollision(bossRect, playerRect)) {
                    loseLifeCallback();
                }
            }
        },

        isBossDefeated: function() {
            return bossDefeated;
        },

        isBossLevel: function() {
            return true; 
        },

        onResize: function(newWidth, newHeight) {
            gameWidthRef = newWidth;
            gameHeightRef = newHeight;
            if (finalBoss) {
                finalBoss.targetY = newHeight * 0.15;
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