// enemies4.js
(function() {
    const ENEMY_WIDTH_REGULAR = 80;
    const ENEMY_HEIGHT_REGULAR = 80;
    const ENEMY_WIDTH_ELITE = 120; // Elite enemies are larger
    const ENEMY_HEIGHT_ELITE = 120; // Elite enemies are larger
    const BOSS_WIDTH_FINAL = 200; // Oblivion Sphere is largest elite, almost boss-sized
    const BOSS_HEIGHT_FINAL = 200;

    const ENEMY_PROJECTILE_SPEED = 8;
    const ENEMY_SCATTER_PROJECTILE_SPEED = 6; // Slower for scatter to allow spread
    const ENEMY_SCATTER_ANGLE_DEVIATION = 0.3; // Radians for scatter spread
    const ENEMY_TRACKING_ORB_SPEED = 4; // Slower for tracking orb
    const ENEMY_MUZZLE_OFFSET_Y = 55; // Common offset from center for muzzle
    const ENEMY_POINTS_REGULAR = 250; // Increased points for Level 4 regular enemies
    const ENEMY_POINTS_ELITE = 1000; // Points for Elite enemies

    let gameContainerRef;
    let gameWidthRef;
    let gameHeightRef;
    let playerXRef; // Reference to player's X position for aiming

    let activeEnemies = [];
    let enemyProjectiles = [];
    let activeEliteEnemiesCount = 0; // Track how many elites are currently active

    let regularEnemySpawnRate = 1800; // Even faster spawn rate
    let lastRegularEnemySpawnTime = 0;
    let numRegularEnemiesSpawned = 0;
    const MAX_REGULAR_ENEMIES_BEFORE_ELITES = 15; // Spawn more regular enemies before elites
    let eliteSpawnStarted = false; // Flag to indicate if elite spawning has begun
    let numEliteEnemiesSpawnedTotal = 0;
    const MAX_ELITE_ENEMIES_TO_DEFEAT = 5; // Total number of elite enemies that need to be defeated
    let levelCompleteFlag = false; // Set to true when the level's objective is met

    // SVG Definitions from planeset5.html - with unique gradient IDs for this module
    const CELESTIAL_DISC_SVG = `
        <svg viewBox="0 0 1000 1000">
            <defs>
                <linearGradient id="mainUfoGradient_lvl4_ufo1" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stop-color="#4a0000" /> <stop offset="100%" stop-color="#2a0000" />
                </linearGradient>
                <linearGradient id="domeUfoGradient_lvl4_ufo1" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stop-color="#ff0000" /> <stop offset="100%" stop-color="#aa0000" />
                </linearGradient>
                <linearGradient id="lightUfoGradient_lvl4_ufo1" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stop-color="#ff6600" /> <stop offset="100%" stop-color="#cc3300" />
                </linearGradient>
                <linearGradient id="exhaustUfoGradient_lvl4_ufo1" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stop-color="#990000" /> <stop offset="100%" stop-color="#660000" />
                </linearGradient>
                <linearGradient id="trailUfoGradient_lvl4_ufo1" x1="0%" y1="100%" x2="0%" y2="0%">
                    <stop offset="0%" stop-color="#ff0000" stop-opacity="0.8" /> <stop offset="100%" stop-color="#aa0000" stop-opacity="0" />
                </linearGradient>
            </defs>
            <g transform="translate(500, 500) rotate(180) translate(-500, -500)">
                <ellipse fill="url(#mainUfoGradient_lvl4_ufo1)" cx="500" cy="500" rx="200" ry="80"></ellipse>
                <circle fill="url(#domeUfoGradient_lvl4_ufo1)" cx="500" cy="450" r="100"></circle>
                <circle fill="url(#lightUfoGradient_lvl4_ufo1)" cx="350" cy="550" r="20"></circle>
                <circle fill="url(#lightUfoGradient_lvl4_ufo1)" cx="650" cy="550" r="20"></circle>
                <polygon fill="url(#exhaustUfoGradient_lvl4_ufo1)" points="500,600 480,650 520,650"></polygon>
                <polygon fill="url(#trailUfoGradient_lvl4_ufo1)" points="500,650 480,700 520,700"></polygon>
            </g>
        </svg>
    `;

    const PHANTOM_GLIDER_SVG = `
        <svg viewBox="0 0 1000 1000">
            <defs>
                <linearGradient id="mainUfoGradient_lvl4_ufo2" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stop-color="#2a004a" /> <stop offset="100%" stop-color="#0a002a" />
                </linearGradient>
                <linearGradient id="domeUfoGradient_lvl4_ufo2" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stop-color="#ff0066" /> <stop offset="100%" stop-color="#cc0033" />
                </linearGradient>
                <linearGradient id="lightUfoGradient_lvl4_ufo2" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stop-color="#ff0000" /> <stop offset="100%" stop-color="#aa0000" />
                </linearGradient>
                <linearGradient id="exhaustUfoGradient_lvl4_ufo2" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stop-color="#cc0000" /> <stop offset="100%" stop-color="#990000" />
                </linearGradient>
                <linearGradient id="trailUfoGradient_lvl4_ufo2" x1="0%" y1="100%" x2="0%" y2="0%">
                    <stop offset="0%" stop-color="#ff0000" stop-opacity="0.7" /> <stop offset="100%" stop-color="#aa0000" stop-opacity="0" />
                </linearGradient>
            </defs>
            <g transform="translate(500, 500) rotate(180) translate(-500, -500)">
                <polygon fill="url(#mainUfoGradient_lvl4_ufo2)" points="500,350 250,500 750,500"></polygon>
                <ellipse fill="url(#domeUfoGradient_lvl4_ufo2)" cx="500" cy="400" rx="80" ry="40"></ellipse>
                <circle fill="url(#lightUfoGradient_lvl4_ufo2)" cx="400" cy="600" r="15"></circle>
                <circle fill="url(#lightUfoGradient_lvl4_ufo2)" cx="600" cy="600" r="15"></circle>
                <polygon fill="url(#exhaustUfoGradient_lvl4_ufo2)" points="500,650 470,700 530,700"></polygon>
                <polygon fill="url(#trailUfoGradient_lvl4_ufo2)" points="500,700 470,750 530,750"></polygon>
            </g>
        </svg>
    `;

    const VOID_HUNTER_SVG = `
        <svg viewBox="0 0 1000 1000">
            <defs>
                <linearGradient id="mainUfoGradient_lvl4_ufo3" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stop-color="#333333" /> <stop offset="100%" stop-color="#111111" />
                </linearGradient>
                <linearGradient id="domeUfoGradient_lvl4_ufo3" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stop-color="#ff3300" /> <stop offset="100%" stop-color="#cc0000" />
                </linearGradient>
                <linearGradient id="lightUfoGradient_lvl4_ufo3" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stop-color="#ff0033" /> <stop offset="100%" stop-color="#cc0011" />
                </linearGradient>
                <linearGradient id="exhaustUfoGradient_lvl4_ufo3" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stop-color="#4a004a" /> <stop offset="100%" stop-color="#2a002a" />
                </linearGradient>
                <linearGradient id="trailUfoGradient_lvl4_ufo3" x1="0%" y1="100%" x2="0%" y2="0%">
                    <stop offset="0%" stop-color="#4a004a" stop-opacity="0.6" /> <stop offset="100%" stop-color="#2a002a" stop-opacity="0" />
                </linearGradient>
            </defs>
            <g transform="translate(500, 500) rotate(180) translate(-500, -500)">
                <circle fill="url(#mainUfoGradient_lvl4_ufo3)" cx="500" cy="500" r="150"></circle>
                <polygon fill="url(#mainUfoGradient_lvl4_ufo3)" points="500,450 200,600 500,700 800,600"></polygon>
                <polygon fill="url(#domeUfoGradient_lvl4_ufo3)" points="500,380 470,450 530,450"></polygon>
                <circle fill="url(#lightUfoGradient_lvl4_ufo3)" cx="500" cy="500" r="25"></circle>
                <circle fill="url(#exhaustUfoGradient_lvl4_ufo3)" cx="350" cy="650" r="20"></circle>
                <circle fill="url(#exhaustUfoGradient_lvl4_ufo3)" cx="650" cy="650" r="20"></circle>
                <polygon fill="url(#trailUfoGradient_lvl4_ufo3)" points="350,680 330,730 370,730"></polygon>
                <polygon fill="url(#trailUfoGradient_lvl4_ufo3)" points="650,680 630,730 670,730"></polygon>
            </g>
        </svg>
    `;

    const STARDUST_MANTIS_SVG = `
        <svg viewBox="0 0 1000 1000">
            <defs>
                <linearGradient id="mainUfoGradient_lvl4_ufo4" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stop-color="#002a2a" /> <stop offset="100%" stop-color="#001010" />
                </linearGradient>
                <linearGradient id="domeUfoGradient_lvl4_ufo4" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stop-color="#ff6600" /> <stop offset="100%" stop-color="#cc3300" />
                </linearGradient>
                <linearGradient id="lightUfoGradient_lvl4_ufo4" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stop-color="#ff0000" /> <stop offset="100%" stop-color="#aa0000" />
                </linearGradient>
                <linearGradient id="exhaustUfoGradient_lvl4_ufo4" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stop-color="#004a00" /> <stop offset="100%" stop-color="#002a00" />
                </linearGradient>
                <linearGradient id="trailUfoGradient_lvl4_ufo4" x1="0%" y1="100%" x2="0%" y2="0%">
                    <stop offset="0%" stop-color="#004a00" stop-opacity="0.6" /> <stop offset="100%" stop-color="#002a00" stop-opacity="0" />
                </linearGradient>
            </defs>
            <g transform="translate(500, 500) rotate(180) translate(-500, -500)">
                <polygon fill="url(#mainUfoGradient_lvl4_ufo4)" points="500,300 200,550 500,700 800,550"></polygon>
                <ellipse fill="url(#domeUfoGradient_lvl4_ufo4)" cx="500" cy="400" rx="60" ry="30"></ellipse>
                <polygon fill="url(#mainUfoGradient_lvl4_ufo4)" points="200,550 150,500 180,600"></polygon>
                <polygon fill="url(#mainUfoGradient_lvl4_ufo4)" points="800,550 850,500 820,600"></polygon>
                <circle fill="url(#lightUfoGradient_lvl4_ufo4)" cx="500" cy="550" r="20"></circle>
                <polygon fill="url(#exhaustUfoGradient_lvl4_ufo4)" points="500,700 470,750 530,750"></polygon>
                <polygon fill="url(#trailUfoGradient_lvl4_ufo4)" points="500,750 470,800 530,800"></polygon>
            </g>
        </svg>
    `;

    const GALACTIC_AMOEBA_SVG = `
        <svg viewBox="0 0 1000 1000">
            <defs>
                <linearGradient id="mainUfoGradient_lvl4_ufo5" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stop-color="#101030" /> <stop offset="100%" stop-color="#000010" />
                </linearGradient>
                <linearGradient id="domeUfoGradient_lvl4_ufo5" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stop-color="#990099" /> <stop offset="100%" stop-color="#660066" />
                </linearGradient>
                <linearGradient id="lightUfoGradient_lvl4_ufo5" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stop-color="#00ff00" /> <stop offset="100%" stop-color="#00cc00" />
                </linearGradient>
                <linearGradient id="exhaustUfoGradient_lvl4_ufo5" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stop-color="#990000" /> <stop offset="100%" stop-color="#660000" />
                </linearGradient>
                <linearGradient id="trailUfoGradient_lvl4_ufo5" x1="0%" y1="100%" x2="0%" y2="0%">
                    <stop offset="0%" stop-color="#990000" stop-opacity="0.6" /> <stop offset="100%" stop-color="#660000" stop-opacity="0" />
                </linearGradient>
            </defs>
            <g transform="translate(500, 500) rotate(180) translate(-500, -500)">
                <path fill="url(#mainUfoGradient_lvl4_ufo5)" d="M500,300 Q300,400 350,600 Q400,750 500,700 Q600,750 650,600 Q700,400 500,300 Z"></path>
                <circle fill="url(#domeUfoGradient_lvl4_ufo5)" cx="500" cy="450" r="40"></circle>
                <circle fill="url(#lightUfoGradient_lvl4_ufo5)" cx="400" cy="650" r="10"></circle>
                <circle fill="url(#lightUfoGradient_lvl4_ufo5)" cx="600" cy="650" r="10"></circle>
                <polygon fill="url(#exhaustUfoGradient_lvl4_ufo5)" points="500,700 480,750 520,750"></polygon>
                <polygon fill="url(#trailUfoGradient_lvl4_ufo5)" points="500,750 480,800 520,800"></polygon>
            </g>
        </svg>
    `;

    const WARP_JELLYFISH_SVG = `
        <svg viewBox="0 0 1000 1000">
            <defs>
                <linearGradient id="mainUfoGradient_lvl4_ufo6" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stop-color="#300030" /> <stop offset="100%" stop-color="#100010" />
                </linearGradient>
                <linearGradient id="domeUfoGradient_lvl4_ufo6" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stop-color="#00ff00" /> <stop offset="100%" stop-color="#00cc00" />
                </linearGradient>
                <linearGradient id="lightUfoGradient_lvl4_ufo6" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stop-color="#ff0000" /> <stop offset="100%" stop-color="#cc0000" />
                </linearGradient>
                <linearGradient id="exhaustUfoGradient_lvl4_ufo6" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stop-color="#006600" /> <stop offset="100%" stop-color="#003300" />
                </linearGradient>
                <linearGradient id="trailUfoGradient_lvl4_ufo6" x1="0%" y1="100%" x2="0%" y2="0%">
                    <stop offset="0%" stop-color="#006600" stop-opacity="0.6" /> <stop offset="100%" stop-color="#003300" stop-opacity="0" />
                </linearGradient>
            </defs>
            <g transform="translate(500, 500) rotate(180) translate(-500, -500)">
                <ellipse fill="url(#mainUfoGradient_lvl4_ufo6)" cx="500" cy="400" rx="180" ry="100"></ellipse>
                <circle fill="url(#domeUfoGradient_lvl4_ufo6)" cx="500" cy="350" r="70"></circle>
                <polygon fill="url(#lightUfoGradient_lvl4_ufo6)" points="400,600 380,650 420,650"></polygon>
                <polygon fill="url(#lightUfoGradient_lvl4_ufo6)" points="600,600 580,650 620,650"></polygon>
                <polygon fill="url(#lightUfoGradient_lvl4_ufo6)" points="500,650 480,700 520,700"></polygon>
                <circle fill="url(#exhaustUfoGradient_lvl4_ufo6)" cx="500" cy="750" r="20"></circle>
                <polygon fill="url(#trailUfoGradient_lvl4_ufo6)" points="500,750 480,800 520,800"></polygon>
            </g>
        </svg>
    `;

    const NEXUS_CRUSHER_SVG = `
        <svg viewBox="0 0 1000 1000">
            <defs>
                <linearGradient id="mainUfoGradient_lvl4_boss1" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stop-color="#6a0000" /> <stop offset="100%" stop-color="#4a0000" />
                </linearGradient>
                <linearGradient id="domeUfoGradient_lvl4_boss1" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stop-color="#ff6600" /> <stop offset="100%" stop-color="#cc3300" />
                </linearGradient>
                <linearGradient id="lightUfoGradient_lvl4_boss1" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stop-color="#ff0000" /> <stop offset="100%" stop-color="#aa0000" />
                </linearGradient>
                <linearGradient id="exhaustUfoGradient_lvl4_boss1" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stop-color="#6a006a" /> <stop offset="100%" stop-color="#4a004a" />
                </linearGradient>
                <linearGradient id="trailUfoGradient_lvl4_boss1" x1="0%" y1="100%" x2="0%" y2="0%">
                    <stop offset="0%" stop-color="#ff6600" stop-opacity="0.8" /> <stop offset="100%" stop-color="#cc3300" stop-opacity="0" />
                </linearGradient>
            </defs>
            <g transform="translate(500, 500) rotate(180) translate(-500, -500)">
                <ellipse fill="url(#mainUfoGradient_lvl4_boss1)" cx="500" cy="500" rx="250" ry="100"></ellipse>
                <circle fill="url(#domeUfoGradient_lvl4_boss1)" cx="500" cy="450" r="120"></circle>
                <circle fill="url(#lightUfoGradient_lvl4_boss1)" cx="300" cy="580" r="25"></circle>
                <circle fill="url(#lightUfoGradient_lvl4_boss1)" cx="700" cy="580" r="25"></circle>
                <circle fill="url(#lightUfoGradient_lvl4_boss1)" cx="500" cy="650" r="25"></circle>
                <polygon fill="url(#exhaustUfoGradient_lvl4_boss1)" points="500,700 470,750 530,750"></polygon>
                <polygon fill="url(#trailUfoGradient_lvl4_boss1)" points="500,750 470,800 530,800"></polygon>
            </g>
        </svg>
    `;

    const GALACTIC_WARDEN_SVG = `
        <svg viewBox="0 0 1000 1000">
            <defs>
                <linearGradient id="mainUfoGradient_lvl4_boss2" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stop-color="#102030" /> <stop offset="100%" stop-color="#000010" />
                </linearGradient>
                <linearGradient id="domeUfoGradient_lvl4_boss2" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stop-color="#ff0000" /> <stop offset="100%" stop-color="#aa0000" />
                </linearGradient>
                <linearGradient id="lightUfoGradient_lvl4_boss2" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stop-color="#ff0000" /> <stop offset="100%" stop-color="#cc0000" />
                </linearGradient>
                <linearGradient id="exhaustUfoGradient_lvl4_boss2" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stop-color="#6a006a" /> <stop offset="100%" stop-color="#4a004a" />
                </linearGradient>
                <linearGradient id="trailUfoGradient_lvl4_boss2" x1="0%" y1="100%" x2="0%" y2="0%">
                    <stop offset="0%" stop-color="#ff0000" stop-opacity="0.8" /> <stop offset="100%" stop-color="#aa0000" stop-opacity="0" />
                </linearGradient>
            </defs>
            <g transform="translate(500, 500) rotate(180) translate(-500, -500)">
                <circle fill="url(#mainUfoGradient_lvl4_boss2)" cx="500" cy="500" r="280"></circle>
                <ellipse fill="url(#domeUfoGradient_lvl4_boss2)" cx="500" cy="400" rx="150" ry="70"></ellipse>
                <polygon fill="url(#mainUfoGradient_lvl4_boss2)" points="500,220 480,180 520,180"></polygon>
                <polygon fill="url(#mainUfoGradient_lvl4_boss2)" points="500,780 480,820 520,820"></polygon>
                <polygon fill="url(#mainUfoGradient_lvl4_boss2)" points="220,500 180,480 180,520"></polygon>
                <polygon fill="url(#mainUfoGradient_lvl4_boss2)" points="780,500 820,480 820,520"></polygon>
                <polygon fill="url(#mainUfoGradient_lvl4_boss2)" points="300,300 270,250 330,250"></polygon>
                <polygon fill="url(#mainUfoGradient_lvl4_boss2)" points="700,300 670,250 730,250"></polygon>
                <polygon fill="url(#mainUfoGradient_lvl4_boss2)" points="300,700 270,750 330,750"></polygon>
                <polygon fill="url(#mainUfoGradient_lvl4_boss2)" points="700,700 670,750 730,750"></polygon>

                <polygon fill="url(#exhaustUfoGradient_lvl4_boss2)" points="500,750 470,800 530,800"></polygon>
                <polygon fill="url(#trailUfoGradient_lvl4_boss2)" points="500,800 470,850 530,850"></polygon>
            </g>
        </svg>
    `;

    const STELLAR_DEVOURER_SVG = `
        <svg viewBox="0 0 1000 1000">
            <defs>
                <linearGradient id="mainUfoGradient_lvl4_boss3" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stop-color="#301030" /> <stop offset="100%" stop-color="#100010" />
                </linearGradient>
                <linearGradient id="domeUfoGradient_lvl4_boss3" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stop-color="#00ff00" /> <stop offset="100%" stop-color="#00aa00" />
                </linearGradient>
                <linearGradient id="lightUfoGradient_lvl4_boss3" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stop-color="#ff6600" /> <stop offset="100%" stop-color="#cc3300" />
                </linearGradient>
                <linearGradient id="exhaustUfoGradient_lvl4_boss3" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stop-color="#006600" /> <stop offset="100%" stop-color="#003300" />
                </linearGradient>
                <linearGradient id="trailUfoGradient_lvl4_boss3" x1="0%" y1="100%" x2="0%" y2="0%">
                    <stop offset="0%" stop-color="#006600" stop-opacity="0.8" /> <stop offset="100%" stop-color="#003300" stop-opacity="0" />
                </linearGradient>
            </defs>
            <g transform="translate(500, 500) rotate(180) translate(-500, -500)">
                <path fill="url(#mainUfoGradient_lvl4_boss3)" d="M500,200 Q200,400 250,700 Q500,850 750,700 Q800,400 500,200 Z"></path>
                <circle fill="url(#domeUfoGradient_lvl4_boss3)" cx="500" cy="350" r="80"></circle>
                <polygon fill="url(#mainUfoGradient_lvl4_boss3)" points="500,150 480,100 520,100"></polygon>
                <polygon fill="url(#mainUfoGradient_lvl4_boss3)" points="200,600 150,650 250,650"></polygon>
                <polygon fill="url(#mainUfoGradient_lvl4_boss3)" points="800,600 750,650 850,650"></polygon>
                <polygon fill="url(#mainUfoGradient_lvl4_boss3)" points="500,750 480,800 520,800"></polygon>
                <polygon fill="url(#mainUfoGradient_lvl4_boss3)" points="300,300 270,250 330,250"></polygon>
                <polygon fill="url(#mainUfoGradient_lvl4_boss3)" points="700,300 670,250 730,250"></polygon>
                <polygon fill="url(#exhaustUfoGradient_lvl4_boss3)" points="500,800 450,850 550,850"></polygon>
                <polygon fill="url(#trailUfoGradient_lvl4_boss3)" points="500,850 450,900 550,900"></polygon>
            </g>
        </svg>
    `;

    const OBLIVION_SPHERE_SVG = `
        <svg viewBox="0 0 1000 1000">
            <defs>
                <linearGradient id="mainUfoGradient_lvl4_boss4" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stop-color="#222222" /> <stop offset="100%" stop-color="#000000" />
                </linearGradient>
                <linearGradient id="domeUfoGradient_lvl4_boss4" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stop-color="#ff0000" /> <stop offset="100%" stop-color="#cc0000" />
                </linearGradient>
                <linearGradient id="lightUfoGradient_lvl4_boss4" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stop-color="#0000ff" /> <stop offset="100%" stop-color="#0000aa" />
                </linearGradient>
                <linearGradient id="exhaustUfoGradient_lvl4_boss4" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stop-color="#6a006a" /> <stop offset="100%" stop-color="#4a004a" />
                </linearGradient>
                <linearGradient id="trailUfoGradient_lvl4_boss4" x1="0%" y1="100%" x2="0%" y2="0%">
                    <stop offset="0%" stop-color="#6a006a" stop-opacity="0.8" /> <stop offset="100%" stop-color="#4a004a" stop-opacity="0" />
                </linearGradient>
            </defs>
            <g transform="translate(500, 500) rotate(180) translate(-500, -500)">
                <circle fill="url(#mainUfoGradient_lvl4_boss4)" cx="500" cy="500" r="350"></circle>
                <polygon fill="url(#mainUfoGradient_lvl4_boss4)" points="500,900 450,800 550,800"></polygon>
                <polygon fill="url(#mainUfoGradient_lvl4_boss4)" points="500,100 450,200 550,200"></polygon>
                <polygon fill="url(#mainUfoGradient_lvl4_boss4)" points="100,500 200,470 200,530"></polygon>
                <polygon fill="url(#mainUfoGradient_lvl4_boss4)" points="900,500 800,470 800,530"></polygon>
                <polygon fill="url(#mainUfoGradient_lvl4_boss4)" points="350,850 300,750 400,750"></polygon>
                <polygon fill="url(#mainUfoGradient_lvl4_boss4)" points="650,850 600,750 700,750"></polygon>
                <polygon fill="url(#mainUfoGradient_lvl4_boss4)" points="350,150 300,250 400,250"></polygon>
                <polygon fill="url(#mainUfoGradient_lvl4_boss4)" points="650,150 600,250 700,250"></polygon>
                <polygon fill="url(#mainUfoGradient_lvl4_boss4)" points="150,350 100,300 200,300"></polygon>
                <polygon fill="url(#mainUfoGradient_lvl4_boss4)" points="150,650 100,700 200,700"></polygon>
                <polygon fill="url(#mainUfoGradient_lvl4_boss4)" points="850,350 800,300 900,300"></polygon>
                <polygon fill="url(#mainUfoGradient_lvl4_boss4)" points="850,650 800,700 900,700"></polygon>
                <circle fill="url(#domeUfoGradient_lvl4_boss4)" cx="500" cy="400" r="180"></circle>
                <polygon fill="url(#exhaustUfoGradient_lvl4_boss4)" points="500,750 400,850 600,850"></polygon>
                <polygon fill="url(#trailUfoGradient_lvl4_boss4)" points="500,850 400,900 600,900"></polygon>
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

    // --- Enemy Types (Factory Functions) ---

    // Celestial Disc (UFO 1) - Basic, subtle sine wave
    function createCelestialDisc(x, y) {
        const enemy = {
            x: x,
            y: y,
            maxHealth: 6,
            health: 6,
            speed: 3.0,
            fireRate: 1700,
            lastShotTime: performance.now() + Math.random() * 500,
            width: ENEMY_WIDTH_REGULAR,
            height: ENEMY_HEIGHT_REGULAR,
            isElite: false,
            points: ENEMY_POINTS_REGULAR,
            sineOffset: Math.random() * Math.PI * 2,
            sineSpeed: 0.012,
            sineMagnitude: 30,
            update: function(currentTime, frameRateFactor) {
                this.y += this.speed * frameRateFactor;
                this.x += Math.sin(this.sineOffset + currentTime * this.sineSpeed) * this.sineMagnitude * frameRateFactor;
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
        createEnemyElement(enemy, CELESTIAL_DISC_SVG);
        updateEnemyHealthBar(enemy);
        return enemy;
    }

    // Phantom Glider (UFO 2) - Stops, fires triple spread, continues
    function createPhantomGlider(x, y) {
        const enemy = {
            x: x,
            y: y,
            maxHealth: 8,
            health: 8,
            speed: 3.2,
            fireRate: 2800, // Cooldown for the whole burst
            lastShotTime: performance.now() + Math.random() * 800,
            width: ENEMY_WIDTH_REGULAR,
            height: ENEMY_HEIGHT_REGULAR,
            isElite: false,
            points: ENEMY_POINTS_REGULAR,
            stopY: gameHeightRef * (0.3 + Math.random() * 0.3),
            hasStopped: false,
            type: 'PhantomGlider',
            update: function(currentTime, frameRateFactor) {
                if (!this.hasStopped && this.y < this.stopY) {
                    this.y += this.speed * frameRateFactor;
                } else if (this.y >= this.stopY && !this.hasStopped) {
                    this.hasStopped = true;
                } else if (this.hasStopped && currentTime - this.lastShotTime > this.fireRate) {
                    this.hasStopped = false;
                    this.y += this.speed * frameRateFactor;
                    this.stopY = gameHeightRef * (0.3 + Math.random() * 0.3);
                } else if (this.hasStopped && currentTime - this.lastShotTime <= this.fireRate) {
                    // Stay still
                } else {
                     this.y += this.speed * frameRateFactor;
                }
                updateEnemyElementPosition(this);
            },
            shoot: function(currentTime, playerX) {
                if (this.hasStopped && currentTime - this.lastShotTime > this.fireRate) {
                    enemyShootProjectile(this.x - 15, this.y + this.height / 2 - ENEMY_MUZZLE_OFFSET_Y, playerX - 20);
                    enemyShootProjectile(this.x, this.y + this.height / 2 - ENEMY_MUZZLE_OFFSET_Y, playerX);
                    enemyShootProjectile(this.x + 15, this.y + this.height / 2 - ENEMY_MUZZLE_OFFSET_Y, playerX + 20);
                    this.lastShotTime = currentTime;
                }
            }
        };
        createEnemyElement(enemy, PHANTOM_GLIDER_SVG);
        updateEnemyHealthBar(enemy);
        return enemy;
    }

    // Void Hunter (UFO 3) - Bouncing horizontal, dual shot
    function createVoidHunter(x, y) {
        const enemy = {
            x: x,
            y: y,
            maxHealth: 7,
            health: 7,
            speed: 2.8,
            horizontalSpeed: 1.5,
            fireRate: 1600,
            lastShotTime: performance.now() + Math.random() * 600,
            width: ENEMY_WIDTH_REGULAR,
            height: ENEMY_HEIGHT_REGULAR,
            isElite: false,
            points: ENEMY_POINTS_REGULAR,
            update: function(currentTime, frameRateFactor) {
                this.y += this.speed * frameRateFactor;
                this.x += this.horizontalSpeed * frameRateFactor;
                if (this.x - this.width / 2 < 0 || this.x + this.width / 2 > gameWidthRef) {
                    this.horizontalSpeed *= -1;
                    this.x = Math.max(this.width / 2, Math.min(gameWidthRef - this.width / 2, this.x));
                }
                updateEnemyElementPosition(this);
            },
            shoot: function(currentTime, playerX) {
                if (currentTime - this.lastShotTime > this.fireRate) {
                    enemyShootProjectile(this.x - 10, this.y + this.height / 2 - ENEMY_MUZZLE_OFFSET_Y, playerX);
                    enemyShootProjectile(this.x + 10, this.y + this.height / 2 - ENEMY_MUZZLE_OFFSET_Y, playerX);
                    this.lastShotTime = currentTime;
                }
            }
        };
        createEnemyElement(enemy, VOID_HUNTER_SVG);
        updateEnemyHealthBar(enemy);
        return enemy;
    }

    // Stardust Mantis (UFO 4) - Slow descent, tracking projectile
    function createStardustMantis(x, y) {
        const enemy = {
            x: x,
            y: y,
            maxHealth: 9,
            health: 9,
            speed: 2.5,
            fireRate: 2000,
            lastShotTime: performance.now() + Math.random() * 700,
            width: ENEMY_WIDTH_REGULAR,
            height: ENEMY_HEIGHT_REGULAR,
            isElite: false,
            points: ENEMY_POINTS_REGULAR,
            update: function(currentTime, frameRateFactor) {
                this.y += this.speed * frameRateFactor;
                updateEnemyElementPosition(this);
            },
            shoot: function(currentTime, playerX) {
                if (currentTime - this.lastShotTime > this.fireRate) {
                    enemyShootSpecialOrb(this.x, this.y + this.height / 2 - ENEMY_MUZZLE_OFFSET_Y + 10, playerX, 'tracking');
                    this.lastShotTime = currentTime;
                }
            }
        };
        createEnemyElement(enemy, STARDUST_MANTIS_SVG);
        updateEnemyHealthBar(enemy);
        return enemy;
    }

    // Galactic Amoeba (UFO 5) - Wavy vertical, fast single shot
    function createGalacticAmoeba(x, y) {
        const enemy = {
            x: x,
            y: y,
            maxHealth: 6,
            health: 6,
            speed: 2.7,
            verticalSineOffset: Math.random() * Math.PI * 2,
            verticalSineSpeed: 0.008,
            verticalSineMagnitude: 20,
            fireRate: 1400,
            lastShotTime: performance.now() + Math.random() * 400,
            width: ENEMY_WIDTH_REGULAR,
            height: ENEMY_HEIGHT_REGULAR,
            isElite: false,
            points: ENEMY_POINTS_REGULAR,
            update: function(currentTime, frameRateFactor) {
                this.y += this.speed * frameRateFactor;
                this.y += Math.sin(this.verticalSineOffset + currentTime * this.verticalSineSpeed) * this.verticalSineMagnitude * frameRateFactor;
                updateEnemyElementPosition(this);
            },
            shoot: function(currentTime, playerX) {
                if (currentTime - this.lastShotTime > this.fireRate) {
                    enemyShootProjectile(this.x, this.y + this.height / 2 - ENEMY_MUZZLE_OFFSET_Y, playerX, 'fast');
                    this.lastShotTime = currentTime;
                }
            }
        };
        createEnemyElement(enemy, GALACTIC_AMOEBA_SVG);
        updateEnemyHealthBar(enemy);
        return enemy;
    }

    // Warp Jellyfish (UFO 6) - Slow, high health, 5-shot burst
    function createWarpJellyfish(x, y) {
        const enemy = {
            x: x,
            y: y,
            maxHealth: 10,
            health: 10,
            speed: 2.0,
            fireRate: 3000, // Cooldown for the burst
            lastShotTime: performance.now() + Math.random() * 1000,
            width: ENEMY_WIDTH_REGULAR,
            height: ENEMY_HEIGHT_REGULAR,
            isElite: false,
            points: ENEMY_POINTS_REGULAR,
            update: function(currentTime, frameRateFactor) {
                this.y += this.speed * frameRateFactor;
                updateEnemyElementPosition(this);
            },
            shoot: function(currentTime, playerX) {
                if (currentTime - this.lastShotTime > this.fireRate) {
                    for (let i = -2; i <= 2; i++) { // 5-shot burst
                        enemyShootProjectile(this.x + i * 10, this.y + this.height / 2 - ENEMY_MUZZLE_OFFSET_Y, playerX + i * 15);
                    }
                    this.lastShotTime = currentTime;
                }
            }
        };
        createEnemyElement(enemy, WARP_JELLYFISH_SVG);
        updateEnemyHealthBar(enemy);
        return enemy;
    }

    // --- ELITE ENEMIES (MINI-BOSSES) ---

    // Nexus Crusher (BOSS UFO 1) - Dual rapid fire
    function createNexusCrusher(x, y) {
        const elite = {
            x: x,
            y: y,
            maxHealth: 30,
            health: 30,
            speed: 1.8, // Initial descent speed
            patrolSpeedX: 2.0, // Horizontal movement speed
            fireRatePrimary: 600, // Rapid dual shot
            lastShotTimePrimary: performance.now(),
            width: ENEMY_WIDTH_ELITE,
            height: ENEMY_HEIGHT_ELITE,
            isElite: true,
            points: ENEMY_POINTS_ELITE,
            state: 'descend', // 'descend', 'patrol'
            targetY: gameHeightRef * 0.2,
            update: function(currentTime, frameRateFactor) {
                if (this.state === 'descend') {
                    this.y += this.speed * frameRateFactor;
                    if (this.y >= this.targetY) {
                        this.y = this.targetY;
                        this.state = 'patrol';
                    }
                } else if (this.state === 'patrol') {
                    this.x += this.patrolSpeedX * frameRateFactor;
                    this.y = this.targetY + Math.sin(currentTime * 0.0005) * 10; // Gentle bob
                    if (this.x - this.width / 2 < 0 || this.x + this.width / 2 > gameWidthRef) {
                        this.patrolSpeedX *= -1;
                        this.x = Math.max(this.width / 2, Math.min(gameWidthRef - this.width / 2, this.x));
                    }
                }
                updateEnemyElementPosition(this);
            },
            shoot: function(currentTime, playerX) {
                if (currentTime - this.lastShotTimePrimary > this.fireRatePrimary) {
                    enemyShootProjectile(this.x - 20, this.y + this.height / 2 - ENEMY_MUZZLE_OFFSET_Y, playerX);
                    enemyShootProjectile(this.x + 20, this.y + this.height / 2 - ENEMY_MUZZLE_OFFSET_Y, playerX);
                    this.lastShotTimePrimary = currentTime;
                }
            }
        };
        createEnemyElement(elite, NEXUS_CRUSHER_SVG);
        elite.element.style.width = `${elite.width}px`;
        elite.element.style.height = `${elite.height}px`;
        updateEnemyHealthBar(elite);
        return elite;
    }

    // Galactic Warden (BOSS UFO 2) - Wide 3-shot spread
    function createGalacticWarden(x, y) {
        const elite = {
            x: x,
            y: y,
            maxHealth: 40,
            health: 40,
            speed: 2.0, // Initial descent speed
            patrolSpeedX: 2.5, // Faster horizontal movement
            fireRate: 1800,
            lastShotTime: performance.now() + Math.random() * 800,
            width: ENEMY_WIDTH_ELITE * 1.2, // Slightly larger
            height: ENEMY_HEIGHT_ELITE * 1.2,
            isElite: true,
            points: ENEMY_POINTS_ELITE,
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
                    this.x += this.patrolSpeedX * frameRateFactor;
                    this.y = this.targetY + Math.cos(currentTime * 0.0007) * 15; // More pronounced bob
                    if (this.x - this.width / 2 < 0 || this.x + this.width / 2 > gameWidthRef) {
                        this.patrolSpeedX *= -1;
                        this.x = Math.max(this.width / 2, Math.min(gameWidthRef - this.width / 2, this.x));
                    }
                }
                updateEnemyElementPosition(this);
            },
            shoot: function(currentTime, playerX) {
                if (currentTime - this.lastShotTime > this.fireRate) {
                    enemyShootProjectile(this.x - 30, this.y + this.height / 2 - ENEMY_MUZZLE_OFFSET_Y, playerX - 40);
                    enemyShootProjectile(this.x, this.y + this.height / 2 - ENEMY_MUZZLE_OFFSET_Y, playerX);
                    enemyShootProjectile(this.x + 30, this.y + this.height / 2 - ENEMY_MUZZLE_OFFSET_Y, playerX + 40);
                    this.lastShotTime = currentTime;
                }
            }
        };
        createEnemyElement(elite, GALACTIC_WARDEN_SVG);
        elite.element.style.width = `${elite.width}px`;
        elite.element.style.height = `${elite.height}px`;
        updateEnemyHealthBar(elite);
        return elite;
    }

    // Stellar Devourer (BOSS UFO 3) - Triple shot + tracking shot
    function createStellarDevourer(x, y) {
        const elite = {
            x: x,
            y: y,
            maxHealth: 50,
            health: 50,
            speed: 2.2,
            patrolSpeedX: 3.0,
            fireRateTriple: 800,
            fireRateTracking: 2500,
            lastShotTimeTriple: performance.now(),
            lastShotTimeTracking: performance.now() + 1000,
            width: ENEMY_WIDTH_ELITE * 1.4,
            height: ENEMY_HEIGHT_ELITE * 1.4,
            isElite: true,
            points: ENEMY_POINTS_ELITE,
            state: 'descend',
            targetY: gameHeightRef * 0.3,
            update: function(currentTime, frameRateFactor) {
                if (this.state === 'descend') {
                    this.y += this.speed * frameRateFactor;
                    if (this.y >= this.targetY) {
                        this.y = this.targetY;
                        this.state = 'patrol';
                    }
                } else if (this.state === 'patrol') {
                    this.x += this.patrolSpeedX * frameRateFactor + Math.sin(currentTime * 0.0008) * 8; // Erratic horizontal
                    this.y = this.targetY + Math.sin(currentTime * 0.001) * 20; // Erratic vertical
                    if (this.x - this.width / 2 < 0 || this.x + this.width / 2 > gameWidthRef) {
                        this.patrolSpeedX *= -1;
                        this.x = Math.max(this.width / 2, Math.min(gameWidthRef - this.width / 2, this.x));
                    }
                }
                updateEnemyElementPosition(this);
            },
            shoot: function(currentTime, playerX) {
                if (currentTime - this.lastShotTimeTriple > this.fireRateTriple) {
                    enemyShootProjectile(this.x - 25, this.y + this.height / 2 - ENEMY_MUZZLE_OFFSET_Y, playerX - 25);
                    enemyShootProjectile(this.x, this.y + this.height / 2 - ENEMY_MUZZLE_OFFSET_Y, playerX);
                    enemyShootProjectile(this.x + 25, this.y + this.height / 2 - ENEMY_MUZZLE_OFFSET_Y, playerX + 25);
                    this.lastShotTimeTriple = currentTime;
                }
                if (currentTime - this.lastShotTimeTracking > this.fireRateTracking) {
                    enemyShootSpecialOrb(this.x, this.y + this.height / 2 - ENEMY_MUZZLE_OFFSET_Y + 10, playerX, 'tracking_large');
                    this.lastShotTimeTracking = currentTime;
                }
            }
        };
        createEnemyElement(elite, STELLAR_DEVOURER_SVG);
        elite.element.style.width = `${elite.width}px`;
        elite.element.style.height = `${elite.height}px`;
        updateEnemyHealthBar(elite);
        return elite;
    }

    // Oblivion Sphere (BOSS UFO 4) - Scatter shot and tracking orb
    function createOblivionSphere(x, y) {
        const elite = {
            x: x,
            y: y,
            maxHealth: 70,
            health: 70,
            speed: 1.5,
            patrolSpeedX: 1.8,
            fireRateScatter: 1500,
            fireRateTracking: 3000,
            lastShotTimeScatter: performance.now(),
            lastShotTimeTracking: performance.now() + 1500,
            width: BOSS_WIDTH_FINAL,
            height: BOSS_HEIGHT_FINAL,
            isElite: true,
            points: ENEMY_POINTS_ELITE * 1.5, // Even more points for the "final" elite
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
                    this.x += this.patrolSpeedX * frameRateFactor;
                    this.y = this.targetY + Math.sin(currentTime * 0.0006) * 10;
                    if (this.x - this.width / 2 < 0 || this.x + this.width / 2 > gameWidthRef) {
                        this.patrolSpeedX *= -1;
                        this.x = Math.max(this.width / 2, Math.min(gameWidthRef - this.width / 2, this.x));
                    }
                }
                updateEnemyElementPosition(this);
            },
            shoot: function(currentTime, playerX) {
                if (currentTime - this.lastShotTimeScatter > this.fireRateScatter) {
                    enemyShootScatterProjectile(this.x, this.y + this.height / 2 - ENEMY_MUZZLE_OFFSET_Y, 5, ENEMY_SCATTER_ANGLE_DEVIATION, playerX);
                    this.lastShotTimeScatter = currentTime;
                }
                if (currentTime - this.lastShotTimeTracking > this.fireRateTracking) {
                    enemyShootSpecialOrb(this.x, this.y + this.height / 2 - ENEMY_MUZZLE_OFFSET_Y + 10, playerX, 'tracking_bomb');
                    this.lastShotTimeTracking = currentTime;
                }
            }
        };
        createEnemyElement(elite, OBLIVION_SPHERE_SVG);
        elite.element.style.width = `${elite.width}px`;
        elite.element.style.height = `${elite.height}px`;
        updateEnemyHealthBar(elite);
        return elite;
    }

    // --- Enemy Projectile Logic (including new special orb types) ---
    function enemyShootProjectile(startX, startY, targetPlayerX, type = 'standard') {
        const projectile = document.createElement('div');
        projectile.classList.add('enemy-projectile');

        let speedX = 0;
        let speedY = ENEMY_PROJECTILE_SPEED;

        // Aim towards targetPlayerX (if provided and valid)
        if (targetPlayerX !== undefined && playerXRef !== undefined) {
            const dx = targetPlayerX - startX;
            const dy = gameHeightRef - startY; // Aim towards bottom of screen

            const angle = Math.atan2(dy, dx);
            speedX = Math.cos(angle) * ENEMY_PROJECTILE_SPEED;
            speedY = Math.sin(angle) * ENEMY_PROJECTILE_SPEED;
        }

        if (type === 'fast') {
            speedY *= 1.2; // 20% faster
            speedX *= 1.2;
            projectile.style.background = 'linear-gradient(to right, #00ffff, #009999)';
            projectile.style.boxShadow = '0 0 5px #00ffff';
        }

        projectile.style.left = `${startX - 2.5}px`;
        projectile.style.top = `${startY}px`;
        gameContainerRef.appendChild(projectile);
        enemyProjectiles.push({ element: projectile, y: startY, x: startX, speedX: speedX, speedY: speedY, type: 'standard' });
    }

    function enemyShootScatterProjectile(startX, startY, numProjectiles, spreadAngle, targetPlayerX) {
        // Calculate initial angle towards the player
        let initialAngle = Math.atan2(gameHeightRef - startY, targetPlayerX - startX);

        for (let i = 0; i < numProjectiles; i++) {
            const projectile = document.createElement('div');
            projectile.classList.add('enemy-projectile');
            projectile.style.width = '7px';
            projectile.style.height = '7px';
            projectile.style.borderRadius = '50%';
            projectile.style.background = 'radial-gradient(circle at center, #ff8c00 0%, #cc6600 100%)';
            projectile.style.boxShadow = '0 0 8px #ff8c00, 0 0 15px rgba(255,140,0,0.7)';

            // Distribute angles around the initial angle
            const angleOffset = (i - (numProjectiles - 1) / 2) * (spreadAngle / (numProjectiles - 1 || 1));
            const currentAngle = initialAngle + angleOffset;

            const speedX = Math.cos(currentAngle) * ENEMY_SCATTER_PROJECTILE_SPEED;
            const speedY = Math.sin(currentAngle) * ENEMY_SCATTER_PROJECTILE_SPEED;

            projectile.style.left = `${startX - 3.5}px`; // Adjust for projectile size
            projectile.style.top = `${startY}px`;
            gameContainerRef.appendChild(projectile);
            enemyProjectiles.push({ element: projectile, y: startY, x: startX, speedX: speedX, speedY: speedY, type: 'standard' });
        }
    }


    function enemyShootSpecialOrb(startX, startY, targetPlayerX, type = 'tracking') {
        const orb = document.createElement('div');
        orb.classList.add('enemy-projectile'); // Reuse projectile class
        let orbSize = 10;
        let orbColor = 'radial-gradient(circle at center, #ff00ff 0%, #990099 100%)';
        let orbShadow = '0 0 10px #ff00ff, 0 0 20px rgba(255,0,255,0.7)';
        let orbSpeed = ENEMY_TRACKING_ORB_SPEED;
        let orbClass = 'special-orb-tracking';

        if (type === 'tracking_large') {
            orbSize = 15;
            orbColor = 'radial-gradient(circle at center, #ffff00 0%, #cc9900 100%)';
            orbShadow = '0 0 10px #ffff00, 0 0 20px rgba(255,255,0,0.7)';
            orbSpeed = ENEMY_TRACKING_ORB_SPEED * 0.8; // Slightly slower large orb
            orbClass = 'special-orb-tracking-large';
        } else if (type === 'tracking_bomb') {
            orbSize = 25;
            orbColor = 'radial-gradient(circle at center, #FF0000 0%, #800000 100%)';
            orbShadow = '0 0 15px #FF0000, 0 0 30px rgba(255,0,0,0.7)';
            orbSpeed = ENEMY_TRACKING_ORB_SPEED * 0.6; // Very slow, powerful orb
            orbClass = 'special-orb-tracking-bomb';
        }

        orb.style.width = `${orbSize}px`;
        orb.style.height = `${orbSize}px`;
        orb.style.borderRadius = '50%';
        orb.style.background = orbColor;
        orb.style.boxShadow = orbShadow;
        orb.classList.add(orbClass); // Add specific class for potential unique styling

        orb.style.left = `${startX - orbSize / 2}px`;
        orb.style.top = `${startY}px`;
        gameContainerRef.appendChild(orb);

        let speedX = 0;
        let speedY = orbSpeed;

        if (targetPlayerX !== undefined) {
            const dx = targetPlayerX - startX;
            const dy = (gameHeightRef * 0.8) - startY; // Aim slightly ahead of player

            const angle = Math.atan2(dy, dx);
            speedX = Math.cos(angle) * orbSpeed;
            speedY = Math.sin(angle) * orbSpeed;
        }

        enemyProjectiles.push({ element: orb, x: startX, y: startY, speedX: speedX, speedY: speedY, type: type, targetX: targetPlayerX, orbSize: orbSize });
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
            lastRegularEnemySpawnTime = 0;
            numRegularEnemiesSpawned = 0;
            eliteSpawnStarted = false;
            numEliteEnemiesSpawnedTotal = 0;
            activeEliteEnemiesCount = 0;
            levelCompleteFlag = false;
            playerXRef = undefined; // Reset playerXRef
        },

        updateEnemies: function(currentTime, frameRateFactor, activePlayerXRefs) {
            // Update playerXRef from the first active player, if any
            if (activePlayerXRefs && activePlayerXRefs.length > 0) {
                playerXRef = activePlayerXRefs[0];
            } else {
                playerXRef = undefined; // No active players
            }

            // Phase 1: Spawn regular enemies
            if (!eliteSpawnStarted && numRegularEnemiesSpawned < MAX_REGULAR_ENEMIES_BEFORE_ELITES) {
                if (currentTime - lastRegularEnemySpawnTime > regularEnemySpawnRate) {
                    this.spawnRegularEnemy();
                    lastRegularEnemySpawnTime = currentTime;
                    numRegularEnemiesSpawned++;
                }
            }
            // Phase 2: Start spawning elite enemies
            else if (!eliteSpawnStarted && numRegularEnemiesSpawned >= MAX_REGULAR_ENEMIES_BEFORE_ELITES) {
                eliteSpawnStarted = true;
                // Maybe spawn the first elite immediately or after a small delay
            }

            // Elite spawning logic (if elite phase started)
            if (eliteSpawnStarted && numEliteEnemiesSpawnedTotal < MAX_ELITE_ENEMIES_TO_DEFEAT) {
                // Only spawn a new elite if previous one has been around for a bit or if there are few active elites
                if (activeEliteEnemiesCount < 1 && currentTime - lastRegularEnemySpawnTime > 3000) { // Keep some delay
                     this.spawnEliteEnemy();
                     lastRegularEnemySpawnTime = currentTime; // Reuse this for elite spawn timing
                }
            } else if (eliteSpawnStarted && numEliteEnemiesSpawnedTotal >= MAX_ELITE_ENEMIES_TO_DEFEAT && activeEnemies.length === 0) {
                // All elites spawned and defeated
                levelCompleteFlag = true;
            }


            for (let i = activeEnemies.length - 1; i >= 0; i--) {
                const enemy = activeEnemies[i];
                enemy.update(currentTime, frameRateFactor, playerXRef);
                enemy.shoot(currentTime, playerXRef);

                if (!enemy.isElite && enemy.y > gameHeightRef + enemy.height / 2) {
                    enemy.element.remove();
                    activeEnemies.splice(i, 1);
                }
            }
        },

        spawnRegularEnemy: function() {
            const x = Math.random() * (gameWidthRef - ENEMY_WIDTH_REGULAR) + ENEMY_WIDTH_REGULAR / 2;
            const y = -ENEMY_HEIGHT_REGULAR;

            const enemyTypes = [
                createCelestialDisc,
                createPhantomGlider,
                createVoidHunter,
                createStardustMantis,
                createGalacticAmoeba,
                createWarpJellyfish
            ];
            const randomEnemyCreator = enemyTypes[Math.floor(Math.random() * enemyTypes.length)];
            const newEnemy = randomEnemyCreator(x, y);

            gameContainerRef.appendChild(newEnemy.element);
            activeEnemies.push(newEnemy);
        },

        spawnEliteEnemy: function() {
            const x = gameWidthRef / 2 + (Math.random() * 200 - 100); // Slightly randomized X
            const y = -BOSS_HEIGHT_FINAL; // Start elite further off-screen

            const eliteTypes = [
                createNexusCrusher,
                createGalacticWarden,
                createStellarDevourer,
                createOblivionSphere
            ];

            const randomEliteCreator = eliteTypes[numEliteEnemiesSpawnedTotal % eliteTypes.length]; // Cycle through elites
            const newElite = randomEliteCreator(x, y);

            gameContainerRef.appendChild(newElite.element);
            activeEnemies.push(newElite);
            activeEliteEnemiesCount++;
            numEliteEnemiesSpawnedTotal++;
        },


        updateEnemyProjectiles: function(frameRateFactor) {
            for (let i = enemyProjectiles.length - 1; i >= 0; i--) {
                const ep = enemyProjectiles[i];

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

                        enemy.element.classList.add('damaged-flash');
                        setTimeout(() => {
                            enemy.element.classList.remove('damaged-flash');
                        }, 300);

                        // If not a piercing projectile, remove it
                        if (!p.piercing) {
                            p.element.remove();
                            playerProjectiles.splice(i, 1);
                            i--; // Adjust index due to removal
                        }

                        updateEnemyHealthBar(enemy);

                        if (enemy.health <= 0) {
                            addScoreCallback(enemy.points, p.owner);
                            createExplosionCallback(enemy.x, enemy.y);
                            enemy.element.remove();
                            activeEnemies.splice(j, 1);
                            if (enemy.isElite) {
                                activeEliteEnemiesCount--;
                            }
                        }
                        if (!p.piercing) break; // If projectile removed, no more collision checks for this projectile
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
                    if (enemy.isElite) {
                        activeEliteEnemiesCount--;
                    }
                }
            }
        },

        isBossDefeated: function() {
            // Level is complete when all regular enemies are spawned and all elite enemies spawned have been defeated
            return levelCompleteFlag;
        },

        isBossLevel: function() {
            // This level has an "elite" phase rather than a single boss
            return eliteSpawnStarted || activeEliteEnemiesCount > 0;
        },

        onResize: function(newWidth, newHeight) {
            gameWidthRef = newWidth;
            gameHeightRef = newHeight;
            // Update target Y for any active elites
            activeEnemies.forEach(enemy => {
                if (enemy.isElite && enemy.state === 'patrol') {
                    // Update targetY, ensuring it's relative to the new height
                    // The factor 0.2, 0.25, 0.3 should be re-applied
                    if (enemy.maxHealth === 30) enemy.targetY = newHeight * 0.2; // Nexus Crusher
                    else if (enemy.maxHealth === 40) enemy.targetY = newHeight * 0.25; // Galactic Warden
                    else if (enemy.maxHealth === 50) enemy.targetY = newHeight * 0.3; // Stellar Devourer
                    else if (enemy.maxHealth === 70) enemy.targetY = newHeight * 0.2; // Oblivion Sphere
                }
                // Update stopY for Phantom Gliders if needed
                if (enemy.type === 'PhantomGlider' && !enemy.hasStopped) {
                    enemy.stopY = newHeight * (0.3 + Math.random() * 0.3);
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