// enemies5.js
(function() {
    const ENEMY_WIDTH_REGULAR = 80;
    const ENEMY_HEIGHT_REGULAR = 80;
    const ENEMY_WIDTH_ELITE = 120; // Eliittialukset ovat suurempia
    const ENEMY_HEIGHT_ELITE = 120; 

    const ENEMY_PROJECTILE_SPEED = 9; // Hieman nopeampi Level 5 -tasolle
    const ENEMY_SCATTER_PROJECTILE_SPEED = 7; 
    const ENEMY_SCATTER_ANGLE_DEVIATION = 0.35; // Hieman laajempi hajonta
    const ENEMY_TRACKING_ORB_SPEED = 4.5; 
    const ENEMY_MUZZLE_OFFSET_Y = 55; 
    const ENEMY_POINTS_REGULAR = 300; // Korkeammat pisteet Level 5 -tasolla
    const ENEMY_POINTS_ELITE = 1500; 

    let gameContainerRef;
    let gameWidthRef;
    let gameHeightRef;
    let playerXRef; 

    let activeEnemies = [];
    let enemyProjectiles = [];
    let activeEliteEnemiesCount = 0; 

    let regularEnemySpawnRate = 1600; // Tiheämpi ilmestymisväli Level 5 -tasolla
    let lastRegularEnemySpawnTime = 0;
    let numRegularEnemiesSpawned = 0;
    const MAX_REGULAR_ENEMIES_BEFORE_ELITES = 18; // Enemmän perusvihollisia ennen pomoja
    let eliteSpawnStarted = false; 
    let numEliteEnemiesSpawnedTotal = 0;
    const MAX_ELITE_ENEMIES_TO_DEFEAT = 4; // Eliittivaiheessa molemmat pomot kohdataan kahdesti
    let levelCompleteFlag = false; 

    // --- SVG-määrittelyt planeset6.html-tiedostosta uniikeilla ID-tunnisteilla ---

    const OCULUS_PRIME_SVG = `
        <svg viewBox="0 0 1000 1000">
            <defs>
                <linearGradient id="bronzeGrad1_lvl5" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stop-color="#4a3b2c" />
                    <stop offset="50%" stop-color="#2d2218" />
                    <stop offset="100%" stop-color="#120c08" />
                </linearGradient>
                <linearGradient id="goldHighlight1_lvl5" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stop-color="#e5a93b" />
                    <stop offset="100%" stop-color="#8a5f1a" />
                </linearGradient>
                <radialGradient id="eyeGlow1_lvl5" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stop-color="#ff00ff" />
                    <stop offset="40%" stop-color="#8800aa" />
                    <stop offset="100%" stop-color="#150022" />
                </radialGradient>
                <filter id="neonGlow_lvl5_ufo1">
                    <feGaussianBlur stdDeviation="8" result="coloredBlur"/>
                    <feMerge>
                        <feMergeNode in="coloredBlur"/>
                        <feMergeNode in="SourceGraphic"/>
                    </feMerge>
                </filter>
            </defs>
            <g transform="translate(500, 500) rotate(180) translate(-500, -500)">
                <path fill="url(#bronzeGrad1_lvl5)" d="M 500,100 C 320,220 280,500 320,750 C 350,850 500,900 500,900 C 500,900 650,850 680,750 C 720,500 680,220 500,100 Z"></path>
                <path fill="url(#goldHighlight1_lvl5)" d="M 500,150 L 470,220 C 420,320 380,450 380,550 L 350,550 C 340,430 380,280 450,180 Z"></path>
                <path fill="url(#goldHighlight1_lvl5)" d="M 500,150 L 530,220 C 580,320 620,450 620,550 L 650,550 C 660,430 620,280 550,180 Z"></path>
                <path fill="url(#bronzeGrad1_lvl5)" d="M 320,750 C 270,780 250,850 280,900 C 310,900 350,820 350,780 Z"></path>
                <path fill="url(#bronzeGrad1_lvl5)" d="M 680,750 C 730,780 750,850 720,900 C 690,900 650,820 650,780 Z"></path>
                <path fill="url(#goldHighlight1_lvl5)" d="M 290,820 L 270,870 L 320,850 Z"></path>
                <path fill="url(#goldHighlight1_lvl5)" d="M 710,820 L 730,870 L 680,850 Z"></path>
                <ellipse fill="#000000" cx="500" cy="520" rx="95" ry="145"></ellipse>
                <ellipse fill="url(#eyeGlow1_lvl5)" filter="url(#neonGlow_lvl5_ufo1)" cx="500" cy="520" rx="75" ry="120"></ellipse>
                <ellipse fill="#ffffff" opacity="0.6" cx="480" cy="470" rx="20" ry="35" transform="rotate(-15 480 470)"></ellipse>
                <ellipse fill="#ffffff" opacity="0.3" cx="520" cy="560" rx="10" ry="10"></ellipse>
            </g>
        </svg>
    `;

    const VIPER_HELIX_SVG = `
        <svg viewBox="0 0 1000 1000">
            <defs>
                <linearGradient id="silverGrad2_lvl5" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stop-color="#b0b5bc" />
                    <stop offset="50%" stop-color="#555a62" />
                    <stop offset="100%" stop-color="#1d2024" />
                </linearGradient>
                <linearGradient id="darkMetal_lvl5_ufo2" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stop-color="#2a2c30" />
                    <stop offset="100%" stop-color="#111215" />
                </linearGradient>
                <linearGradient id="blueGlow_lvl5" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stop-color="#00ffff" />
                    <stop offset="100%" stop-color="#0033aa" />
                </linearGradient>
                <filter id="neonGlow_lvl5_ufo2">
                    <feGaussianBlur stdDeviation="8" result="coloredBlur"/>
                    <feMerge>
                        <feMergeNode in="coloredBlur"/>
                        <feMergeNode in="SourceGraphic"/>
                    </feMerge>
                </filter>
            </defs>
            <g transform="translate(500, 500) rotate(180) translate(-500, -500)">
                <path fill="url(#silverGrad2_lvl5)" d="M 500,50 L 470,250 L 470,420 L 500,480 L 530,420 L 530,250 Z"></path>
                <path fill="url(#darkMetal_lvl5_ufo2)" d="M 500,80 L 485,250 L 485,400 L 500,430 L 515,400 L 515,250 Z"></path>
                <line x1="500" y1="50" x2="500" y2="350" stroke="#000" stroke-width="4"></line>
                <path fill="url(#silverGrad2_lvl5)" d="M 470,300 L 320,480 L 210,320 L 250,580 L 210,850 L 290,650 L 350,600 L 470,450 Z"></path>
                <path fill="url(#darkMetal_lvl5_ufo2)" d="M 450,380 L 330,500 L 270,580 L 235,780 L 275,640 L 340,580 Z"></path>
                <path fill="url(#silverGrad2_lvl5)" d="M 530,300 L 680,480 L 790,320 L 750,580 L 790,850 L 710,650 L 650,600 L 530,450 Z"></path>
                <path fill="url(#darkMetal_lvl5_ufo2)" d="M 550,380 L 670,500 L 730,580 L 765,780 L 725,640 L 660,580 Z"></path>
                <path fill="url(#silverGrad2_lvl5)" d="M 460,650 L 410,820 L 430,900 L 450,820 L 460,700 Z"></path>
                <path fill="url(#silverGrad2_lvl5)" d="M 540,650 L 590,820 L 570,900 L 550,820 L 540,700 Z"></path>
                <path fill="url(#blueGlow_lvl5)" filter="url(#neonGlow_lvl5_ufo2)" d="M 235,600 C 235,600 220,700 225,780 L 235,780 C 230,700 245,620 245,600 Z"></path>
                <path fill="url(#blueGlow_lvl5)" filter="url(#neonGlow_lvl5_ufo2)" d="M 765,600 C 765,600 780,700 775,780 L 765,780 C 770,700 755,620 755,600 Z"></path>
            </g>
        </svg>
    `;

    const SCARLET_OBELISK_SVG = `
        <svg viewBox="0 0 1000 1000">
            <defs>
                <linearGradient id="crimsonGrad3_lvl5" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stop-color="#99001a" />
                    <stop offset="50%" stop-color="#55000a" />
                    <stop offset="100%" stop-color="#220002" />
                </linearGradient>
                <linearGradient id="redWoodGrad_lvl5" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stop-color="#6e000d" />
                    <stop offset="50%" stop-color="#bd1122" />
                    <stop offset="100%" stop-color="#3d0006" />
                </linearGradient>
                <radialGradient id="yellowOrbGlow_lvl5" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stop-color="#ffffff" />
                    <stop offset="30%" stop-color="#ffff00" />
                    <stop offset="70%" stop-color="#ff6600" />
                    <stop offset="100%" stop-color="#3d0006" stop-opacity="0" />
                </radialGradient>
                <filter id="neonGlow_lvl5_ufo3">
                    <feGaussianBlur stdDeviation="8" result="coloredBlur"/>
                    <feMerge>
                        <feMergeNode in="coloredBlur"/>
                        <feMergeNode in="SourceGraphic"/>
                    </feMerge>
                </filter>
            </defs>
            <g transform="translate(500, 500) rotate(180) translate(-500, -500)">
                <path fill="url(#crimsonGrad3_lvl5)" d="M 500,250 L 410,50 L 480,180 L 500,100 L 520,180 L 590,50 Z"></path>
                <path fill="url(#redWoodGrad_lvl5)" d="M 500,150 C 420,300 420,600 440,780 C 440,820 480,950 500,950 C 520,950 560,820 560,780 C 580,600 580,300 500,150 Z"></path>
                <path fill="#1a0003" d="M 500,380 C 470,440 470,550 500,600 C 530,550 530,440 500,380 Z"></path>
                <path fill="#ffffff" d="M 480,470 Q 500,450 520,470 Q 500,458 480,470 Z" filter="url(#neonGlow_lvl5_ufo3)"></path>
                <path fill="#ffffff" d="M 480,510 Q 500,490 520,510 Q 500,498 480,510 Z" filter="url(#neonGlow_lvl5_ufo3)"></path>
                <path fill="url(#crimsonGrad3_lvl5)" d="M 440,720 L 390,750 C 370,820 380,880 390,920 L 420,920 L 440,780 Z"></path>
                <path fill="url(#crimsonGrad3_lvl5)" d="M 560,720 L 610,750 C 630,820 620,880 610,920 L 580,920 L 560,780 Z"></path>
                <circle cx="435" cy="220" r="14" fill="url(#yellowOrbGlow_lvl5)" filter="url(#neonGlow_lvl5_ufo3)"></circle>
                <circle cx="420" cy="255" r="16" fill="url(#yellowOrbGlow_lvl5)" filter="url(#neonGlow_lvl5_ufo3)"></circle>
                <circle cx="410" cy="295" r="18" fill="url(#yellowOrbGlow_lvl5)" filter="url(#neonGlow_lvl5_ufo3)"></circle>
                <circle cx="405" cy="340" r="20" fill="url(#yellowOrbGlow_lvl5)" filter="url(#neonGlow_lvl5_ufo3)"></circle>
                <circle cx="460" cy="650" r="12" fill="url(#yellowOrbGlow_lvl5)" filter="url(#neonGlow_lvl5_ufo3)"></circle>
                <circle cx="455" cy="690" r="13" fill="url(#yellowOrbGlow_lvl5)" filter="url(#neonGlow_lvl5_ufo3)"></circle>
                <circle cx="450" cy="730" r="14" fill="url(#yellowOrbGlow_lvl5)" filter="url(#neonGlow_lvl5_ufo3)"></circle>
                <circle cx="445" cy="770" r="15" fill="url(#yellowOrbGlow_lvl5)" filter="url(#neonGlow_lvl5_ufo3)"></circle>
                <circle cx="400" cy="800" r="12" fill="url(#yellowOrbGlow_lvl5)" filter="url(#neonGlow_lvl5_ufo3)"></circle>
                <circle cx="395" cy="840" r="13" fill="url(#yellowOrbGlow_lvl5)" filter="url(#neonGlow_lvl5_ufo3)"></circle>
                <circle cx="392" cy="880" r="14" fill="url(#yellowOrbGlow_lvl5)" filter="url(#neonGlow_lvl5_ufo3)"></circle>
                <circle cx="565" cy="220" r="14" fill="url(#yellowOrbGlow_lvl5)" filter="url(#neonGlow_lvl5_ufo3)"></circle>
                <circle cx="580" cy="255" r="16" fill="url(#yellowOrbGlow_lvl5)" filter="url(#neonGlow_lvl5_ufo3)"></circle>
                <circle cx="590" cy="295" r="18" fill="url(#yellowOrbGlow_lvl5)" filter="url(#neonGlow_lvl5_ufo3)"></circle>
                <circle cx="595" cy="340" r="20" fill="url(#yellowOrbGlow_lvl5)" filter="url(#neonGlow_lvl5_ufo3)"></circle>
                <circle cx="540" cy="650" r="12" fill="url(#yellowOrbGlow_lvl5)" filter="url(#neonGlow_lvl5_ufo3)"></circle>
                <circle cx="545" cy="690" r="13" fill="url(#yellowOrbGlow_lvl5)" filter="url(#neonGlow_lvl5_ufo3)"></circle>
                <circle cx="550" cy="730" r="14" fill="url(#yellowOrbGlow_lvl5)" filter="url(#neonGlow_lvl5_ufo3)"></circle>
                <circle cx="555" cy="770" r="15" fill="url(#yellowOrbGlow_lvl5)" filter="url(#neonGlow_lvl5_ufo3)"></circle>
                <circle cx="600" cy="800" r="12" fill="url(#yellowOrbGlow_lvl5)" filter="url(#neonGlow_lvl5_ufo3)"></circle>
                <circle cx="605" cy="840" r="13" fill="url(#yellowOrbGlow_lvl5)" filter="url(#neonGlow_lvl5_ufo3)"></circle>
                <circle cx="608" cy="880" r="14" fill="url(#yellowOrbGlow_lvl5)" filter="url(#neonGlow_lvl5_ufo3)"></circle>
            </g>
        </svg>
    `;

    const AMBER_SENTINEL_SVG = `
        <svg viewBox="0 0 1000 1000">
            <defs>
                <linearGradient id="chitinDark_lvl5" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stop-color="#403c38" />
                    <stop offset="100%" stop-color="#191715" />
                </linearGradient>
                <linearGradient id="amberWing_lvl5" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stop-color="#ffb732" stop-opacity="0.8" />
                    <stop offset="50%" stop-color="#e66000" stop-opacity="0.9" />
                    <stop offset="100%" stop-color="#802000" stop-opacity="0.95" />
                </linearGradient>
                <filter id="neonGlow_lvl5_ufo4">
                    <feGaussianBlur stdDeviation="8" result="coloredBlur"/>
                    <feMerge>
                        <feMergeNode in="coloredBlur"/>
                        <feMergeNode in="SourceGraphic"/>
                    </feMerge>
                </filter>
            </defs>
            <g transform="translate(500, 500) rotate(180) translate(-500, -500)">
                <path fill="url(#amberWing_lvl5)" d="M 500,250 C 400,100 200,120 120,250 C 70,330 80,500 180,630 C 260,730 450,850 500,900 Z"></path>
                <path fill="url(#amberWing_lvl5)" d="M 500,250 C 600,100 800,120 880,250 C 930,330 920,500 820,630 C 740,730 550,850 500,900 Z"></path>
                <path fill="url(#chitinDark_lvl5)" d="M 120,250 Q 150,180 180,150 L 150,220 Z"></path>
                <path fill="url(#chitinDark_lvl5)" d="M 80,330 Q 120,310 160,300 L 100,360 Z"></path>
                <path fill="url(#chitinDark_lvl5)" d="M 100,450 Q 150,430 190,410 L 120,500 Z"></path>
                <path fill="url(#chitinDark_lvl5)" d="M 150,580 Q 210,550 250,510 L 180,640 Z"></path>
                <path fill="url(#chitinDark_lvl5)" d="M 880,250 Q 850,180 820,150 L 850,220 Z"></path>
                <path fill="url(#chitinDark_lvl5)" d="M 920,330 Q 880,310 840,300 L 900,360 Z"></path>
                <path fill="url(#chitinDark_lvl5)" d="M 900,450 Q 850,430 810,410 L 880,500 Z"></path>
                <path fill="url(#chitinDark_lvl5)" d="M 850,580 Q 790,550 750,510 L 820,640 Z"></path>
                <path fill="url(#chitinDark_lvl5)" d="M 500,100 C 470,200 460,400 470,700 L 500,950 L 530,700 C 540,400 530,200 500,100 Z"></path>
                <ellipse fill="#111" cx="500" cy="300" rx="20" ry="8"></ellipse>
                <ellipse fill="#111" cx="500" cy="350" rx="22" ry="8"></ellipse>
                <ellipse fill="#111" cx="500" cy="400" rx="25" ry="8"></ellipse>
                <ellipse fill="#111" cx="500" cy="450" rx="22" ry="8"></ellipse>
                <ellipse fill="#111" cx="500" cy="500" rx="18" ry="8"></ellipse>
                <circle cx="250" cy="300" r="10" fill="#ffff33" filter="url(#neonGlow_lvl5_ufo4)"></circle>
                <circle cx="210" cy="380" r="12" fill="#ffff33" filter="url(#neonGlow_lvl5_ufo4)"></circle>
                <circle cx="230" cy="480" r="11" fill="#ffff33" filter="url(#neonGlow_lvl5_ufo4)"></circle>
                <circle cx="300" cy="580" r="9" fill="#ffff33" filter="url(#neonGlow_lvl5_ufo4)"></circle>
                <circle cx="750" cy="300" r="10" fill="#ffff33" filter="url(#neonGlow_lvl5_ufo4)"></circle>
                <circle cx="790" cy="380" r="12" fill="#ffff33" filter="url(#neonGlow_lvl5_ufo4)"></circle>
                <circle cx="770" cy="480" r="11" fill="#ffff33" filter="url(#neonGlow_lvl5_ufo4)"></circle>
                <circle cx="700" cy="580" r="9" fill="#ffff33" filter="url(#neonGlow_lvl5_ufo4)"></circle>
            </g>
        </svg>
    `;

    const BRONZE_OVERLORD_SVG = `
        <svg viewBox="0 0 1000 1000">
            <defs>
                <linearGradient id="heavyBronze_lvl5" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stop-color="#5a4525" />
                    <stop offset="50%" stop-color="#a48446" />
                    <stop offset="100%" stop-color="#3d2c12" />
                </linearGradient>
                <linearGradient id="machineryDark_lvl5" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stop-color="#2c2a29" />
                    <stop offset="100%" stop-color="#0f0e0d" />
                </linearGradient>
                <linearGradient id="redWeaponTip_lvl5" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stop-color="#ff1a1a" />
                    <stop offset="100%" stop-color="#660000" />
                </linearGradient>
                <filter id="neonGlow_lvl5_ufo5">
                    <feGaussianBlur stdDeviation="8" result="coloredBlur"/>
                    <feMerge>
                        <feMergeNode in="coloredBlur"/>
                        <feMergeNode in="SourceGraphic"/>
                    </feMerge>
                </filter>
            </defs>
            <g transform="translate(500, 500) rotate(180) translate(-500, -500)">
                <rect fill="url(#machineryDark_lvl5)" x="320" y="550" width="360" height="250" rx="10"></rect>
                <rect fill="#111" x="380" y="800" width="60" height="50" rx="3"></rect>
                <rect fill="#111" x="560" y="800" width="60" height="50" rx="3"></rect>
                <polygon fill="url(#redWeaponTip_lvl5)" points="380,850 410,910 440,850" filter="url(#neonGlow_lvl5_ufo5)"></polygon>
                <polygon fill="url(#redWeaponTip_lvl5)" points="560,850 590,910 620,850" filter="url(#neonGlow_lvl5_ufo5)"></polygon>
                <path fill="url(#heavyBronze_lvl5)" d="M 500,200 L 350,420 L 320,550 L 350,750 L 650,750 L 680,550 L 650,420 Z"></path>
                <path fill="url(#redWeaponTip_lvl5)" d="M 420,250 Q 400,100 460,80 Q 440,180 440,230 Z"></path>
                <path fill="url(#redWeaponTip_lvl5)" d="M 580,250 Q 600,100 540,80 Q 560,180 560,230 Z"></path>
                <polygon fill="url(#redWeaponTip_lvl5)" points="500,50 475,150 525,150"></polygon>
                <rect fill="url(#machineryDark_lvl5)" x="280" y="480" width="50" height="150" rx="5"></rect>
                <rect fill="url(#machineryDark_lvl5)" x="670" y="480" width="50" height="150" rx="5"></rect>
                <polygon fill="url(#redWeaponTip_lvl5)" points="280,480 260,420 300,450"></polygon>
                <polygon fill="url(#redWeaponTip_lvl5)" points="720,480 740,420 700,450"></polygon>
                <line x1="350" y1="420" x2="650" y2="420" stroke="#1d1405" stroke-width="4"></line>
                <line x1="320" y1="550" x2="680" y2="550" stroke="#1d1405" stroke-width="4"></line>
                <line x1="350" y1="680" x2="650" y2="680" stroke="#1d1405" stroke-width="4"></line>
            </g>
        </svg>
    `;

    const EMERALD_TITAN_SVG = `
        <svg viewBox="0 0 1000 1000">
            <defs>
                <linearGradient id="goliathGreen_lvl5" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stop-color="#2a382c" />
                    <stop offset="50%" stop-color="#556b50" />
                    <stop offset="100%" stop-color="#141c15" />
                </linearGradient>
                <linearGradient id="reactorBlue_lvl5" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stop-color="#00f3ff" />
                    <stop offset="100%" stop-color="#0044bb" />
                </linearGradient>
                <linearGradient id="copperTrim_lvl5" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stop-color="#9e5e38" />
                    <stop offset="100%" stop-color="#4a2511" />
                </linearGradient>
                <linearGradient id="redWeaponTip_lvl5_ufo6" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stop-color="#ff1a1a" />
                    <stop offset="100%" stop-color="#660000" />
                </linearGradient>
                <filter id="neonGlow_lvl5_ufo6">
                    <feGaussianBlur stdDeviation="8" result="coloredBlur"/>
                    <feMerge>
                        <feMergeNode in="coloredBlur"/>
                        <feMergeNode in="SourceGraphic"/>
                    </feMerge>
                </filter>
            </defs>
            <g transform="translate(500, 500) rotate(180) translate(-500, -500)">
                <rect fill="url(#goliathGreen_lvl5)" x="300" y="600" width="400" height="250" rx="6"></rect>
                <rect fill="url(#copperTrim_lvl5)" x="340" y="800" width="320" height="50" rx="3"></rect>
                <circle fill="#000" cx="400" cy="700" r="45"></circle>
                <circle fill="url(#reactorBlue_lvl5)" filter="url(#neonGlow_lvl5_ufo6)" cx="400" cy="700" r="35"></circle>
                <circle fill="#000" cx="600" cy="700" r="45"></circle>
                <circle fill="url(#reactorBlue_lvl5)" filter="url(#neonGlow_lvl5_ufo6)" cx="600" cy="700" r="35"></circle>
                <rect fill="url(#goliathGreen_lvl5)" x="340" y="250" width="320" height="380" rx="4"></rect>
                <path fill="url(#copperTrim_lvl5)" d="M 340,300 L 300,450 L 340,600 Z"></path>
                <path fill="url(#copperTrim_lvl5)" d="M 660,300 L 700,450 L 660,600 Z"></path>
                <path fill="url(#goliathGreen_lvl5)" d="M 380,250 L 500,80 L 620,250 Z"></path>
                <path fill="url(#redWeaponTip_lvl5_ufo6)" d="M 380,250 Q 340,150 420,120 Z"></path>
                <path fill="url(#redWeaponTip_lvl5_ufo6)" d="M 620,250 Q 660,150 580,120 Z"></path>
                <polygon fill="url(#redWeaponTip_lvl5_ufo6)" points="500,80 480,180 520,180"></polygon>
                <line x1="340" y1="350" x2="660" y2="350" stroke="#0f140f" stroke-width="5"></line>
                <line x1="340" y1="480" x2="660" y2="480" stroke="#0f140f" stroke-width="5"></line>
                <line x1="340" y1="580" x2="660" y2="580" stroke="#0f140f" stroke-width="5"></line>
            </g>
        </svg>
    `;

    const OMEGA_NEMESIS_SVG = `
        <svg viewBox="0 0 1000 1000">
            <defs>
                <linearGradient id="bossGrad1_lvl5" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stop-color="#3d434d" />
                    <stop offset="50%" stop-color="#1b1d22" />
                    <stop offset="100%" stop-color="#08090a" />
                </linearGradient>
                <linearGradient id="darkMetal_lvl5_boss1" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stop-color="#2a2c30" />
                    <stop offset="100%" stop-color="#111215" />
                </linearGradient>
                <linearGradient id="blueGlow_lvl5_boss1" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stop-color="#00ffff" />
                    <stop offset="100%" stop-color="#0033aa" />
                </linearGradient>
                <linearGradient id="redWeaponTip_lvl5_boss1" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stop-color="#ff1a1a" />
                    <stop offset="100%" stop-color="#660000" />
                </linearGradient>
                <radialGradient id="eyeGlow1_lvl5_boss1" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stop-color="#ff00ff" />
                    <stop offset="40%" stop-color="#8800aa" />
                    <stop offset="100%" stop-color="#150022" />
                </radialGradient>
                <filter id="neonGlow_lvl5_boss1">
                    <feGaussianBlur stdDeviation="8" result="coloredBlur"/>
                    <feMerge>
                        <feMergeNode in="coloredBlur"/>
                        <feMergeNode in="SourceGraphic"/>
                    </feMerge>
                </filter>
            </defs>
            <g transform="translate(500, 500) rotate(180) translate(-500, -500)">
                <path fill="url(#bossGrad1_lvl5)" d="M 500,100 C 200,100 100,350 150,650 C 200,800 350,900 500,880 C 650,900 800,800 850,650 C 900,350 800,100 500,100 Z"></path>
                <path fill="url(#darkMetal_lvl5_boss1)" d="M 500,150 L 440,380 L 440,650 L 500,750 L 560,650 L 560,380 Z"></path>
                <line x1="500" y1="150" x2="500" y2="650" stroke="#000" stroke-width="6"></line>
                <path fill="url(#blueGlow_lvl5_boss1)" filter="url(#neonGlow_lvl5_boss1)" d="M 250,300 C 200,450 210,600 280,720 L 300,700 C 240,600 230,480 280,350 Z"></path>
                <path fill="url(#blueGlow_lvl5_boss1)" filter="url(#neonGlow_lvl5_boss1)" d="M 750,300 C 800,450 790,600 720,720 L 700,700 C 760,600 770,480 720,350 Z"></path>
                <polygon fill="url(#redWeaponTip_lvl5_boss1)" points="150,650 80,680 180,730"></polygon>
                <polygon fill="url(#redWeaponTip_lvl5_boss1)" points="850,650 920,680 820,730"></polygon>
                <circle fill="#000" cx="500" cy="500" r="60"></circle>
                <circle fill="url(#eyeGlow1_lvl5_boss1)" filter="url(#neonGlow_lvl5_boss1)" cx="500" cy="500" r="45"></circle>
            </g>
        </svg>
    `;

    const ASTRAL_CITADEL_SVG = `
        <svg viewBox="0 0 1000 1000">
            <defs>
                <linearGradient id="bossGrad2_lvl5" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stop-color="#4d3211" />
                    <stop offset="50%" stop-color="#241604" />
                    <stop offset="100%" stop-color="#080400" />
                </linearGradient>
                <linearGradient id="copperTrim_lvl5_boss2" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stop-color="#9e5e38" />
                    <stop offset="100%" stop-color="#4a2511" />
                </linearGradient>
                <linearGradient id="machineryDark_lvl5_boss2" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stop-color="#2c2a29" />
                    <stop offset="100%" stop-color="#0f0e0d" />
                </linearGradient>
                <radialGradient id="eyeGlow1_lvl5_boss2" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stop-color="#ff00ff" />
                    <stop offset="40%" stop-color="#8800aa" />
                    <stop offset="100%" stop-color="#150022" />
                </radialGradient>
                <radialGradient id="yellowOrbGlow_lvl5_boss2" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stop-color="#ffffff" />
                    <stop offset="30%" stop-color="#ffff00" />
                    <stop offset="70%" stop-color="#ff6600" />
                    <stop offset="100%" stop-color="#3d0006" stop-opacity="0" />
                </radialGradient>
                <filter id="neonGlow_lvl5_boss2">
                    <feGaussianBlur stdDeviation="8" result="coloredBlur"/>
                    <feMerge>
                        <feMergeNode in="coloredBlur"/>
                        <feMergeNode in="SourceGraphic"/>
                    </feMerge>
                </filter>
            </defs>
            <g transform="translate(500, 500) rotate(180) translate(-500, -500)">
                <path fill="url(#bossGrad2_lvl5)" d="M 500,50 L 250,250 L 150,550 L 250,850 L 500,950 L 750,850 L 850,550 L 750,250 Z"></path>
                <path fill="url(#copperTrim_lvl5_boss2)" d="M 500,120 L 290,300 L 220,550 L 290,800 L 500,900 L 710,800 L 780,550 L 710,300 Z"></path>
                <rect fill="url(#machineryDark_lvl5_boss2)" x="380" y="380" width="240" height="240" rx="15"></rect>
                <ellipse fill="#000" cx="500" cy="500" rx="90" ry="120"></ellipse>
                <ellipse fill="url(#eyeGlow1_lvl5_boss2)" filter="url(#neonGlow_lvl5_boss2)" cx="500" cy="500" rx="70" ry="95"></ellipse>
                <circle cx="280" cy="280" r="20" fill="url(#yellowOrbGlow_lvl5_boss2)" filter="url(#neonGlow_lvl5_boss2)"></circle>
                <circle cx="200" cy="400" r="22" fill="url(#yellowOrbGlow_lvl5_boss2)" filter="url(#neonGlow_lvl5_boss2)"></circle>
                <circle cx="170" cy="550" r="25" fill="url(#yellowOrbGlow_lvl5_boss2)" filter="url(#neonGlow_lvl5_boss2)"></circle>
                <circle cx="200" cy="700" r="22" fill="url(#yellowOrbGlow_lvl5_boss2)" filter="url(#neonGlow_lvl5_boss2)"></circle>
                <circle cx="280" cy="820" r="20" fill="url(#yellowOrbGlow_lvl5_boss2)" filter="url(#neonGlow_lvl5_boss2)"></circle>
                <circle cx="720" cy="280" r="20" fill="url(#yellowOrbGlow_lvl5_boss2)" filter="url(#neonGlow_lvl5_boss2)"></circle>
                <circle cx="800" cy="400" r="22" fill="url(#yellowOrbGlow_lvl5_boss2)" filter="url(#neonGlow_lvl5_boss2)"></circle>
                <circle cx="830" cy="550" r="25" fill="url(#yellowOrbGlow_lvl5_boss2)" filter="url(#neonGlow_lvl5_boss2)"></circle>
                <circle cx="800" cy="700" r="22" fill="url(#yellowOrbGlow_lvl5_boss2)" filter="url(#neonGlow_lvl5_boss2)"></circle>
                <circle cx="720" cy="820" r="20" fill="url(#yellowOrbGlow_lvl5_boss2)" filter="url(#neonGlow_lvl5_boss2)"></circle>
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

    // --- Tavalliset vihollistyypit (Factory-funktiot) ---

    // Oculus Prime: Heiluva liike, ampuu säännöllisesti
    function createOculusPrime(x, y) {
        const enemy = {
            x: x,
            y: y,
            maxHealth: 8,
            health: 8,
            speed: 3.2,
            fireRate: 1600,
            lastShotTime: performance.now() + Math.random() * 500,
            width: ENEMY_WIDTH_REGULAR,
            height: ENEMY_HEIGHT_REGULAR,
            isElite: false,
            points: ENEMY_POINTS_REGULAR,
            sineOffset: Math.random() * Math.PI * 2,
            sineSpeed: 0.015,
            sineMagnitude: 35,
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
        createEnemyElement(enemy, OCULUS_PRIME_SVG);
        updateEnemyHealthBar(enemy);
        return enemy;
    }

    // Viper Helix: Nopeampi, tekee pysähdyksen ladatakseen kolmoislaukauksen
    function createViperHelix(x, y) {
        const enemy = {
            x: x,
            y: y,
            maxHealth: 9,
            health: 9,
            speed: 3.5,
            fireRate: 2600,
            lastShotTime: performance.now() + Math.random() * 800,
            width: ENEMY_WIDTH_REGULAR,
            height: ENEMY_HEIGHT_REGULAR,
            isElite: false,
            points: ENEMY_POINTS_REGULAR,
            stopY: gameHeightRef * (0.25 + Math.random() * 0.3),
            hasStopped: false,
            type: 'ViperHelix',
            update: function(currentTime, frameRateFactor) {
                if (!this.hasStopped && this.y < this.stopY) {
                    this.y += this.speed * frameRateFactor;
                } else if (this.y >= this.stopY && !this.hasStopped) {
                    this.hasStopped = true;
                } else if (this.hasStopped && currentTime - this.lastShotTime > this.fireRate) {
                    this.hasStopped = false;
                    this.y += this.speed * frameRateFactor;
                    this.stopY = gameHeightRef * (0.25 + Math.random() * 0.3);
                } else if (this.hasStopped) {
                    // Pysyy paikallaan ladatessaan
                } else {
                     this.y += this.speed * frameRateFactor;
                }
                updateEnemyElementPosition(this);
            },
            shoot: function(currentTime, playerX) {
                if (this.hasStopped && currentTime - this.lastShotTime > this.fireRate) {
                    enemyShootProjectile(this.x - 15, this.y + this.height / 2 - ENEMY_MUZZLE_OFFSET_Y, playerX - 25);
                    enemyShootProjectile(this.x, this.y + this.height / 2 - ENEMY_MUZZLE_OFFSET_Y, playerX);
                    enemyShootProjectile(this.x + 15, this.y + this.height / 2 - ENEMY_MUZZLE_OFFSET_Y, playerX + 25);
                    this.lastShotTime = currentTime;
                }
            }
        };
        createEnemyElement(enemy, VIPER_HELIX_SVG);
        updateEnemyHealthBar(enemy);
        return enemy;
    }

    // Scarlet Obelisk: Vaakasuunnassa poukkoileva, ampuu tuplalaukauksia
    function createScarletObelisk(x, y) {
        const enemy = {
            x: x,
            y: y,
            maxHealth: 10,
            health: 10,
            speed: 2.8,
            horizontalSpeed: 1.8,
            fireRate: 1500,
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
                    enemyShootProjectile(this.x - 12, this.y + this.height / 2 - ENEMY_MUZZLE_OFFSET_Y, playerX);
                    enemyShootProjectile(this.x + 12, this.y + this.height / 2 - ENEMY_MUZZLE_OFFSET_Y, playerX);
                    this.lastShotTime = currentTime;
                }
            }
        };
        createEnemyElement(enemy, SCARLET_OBELISK_SVG);
        updateEnemyHealthBar(enemy);
        return enemy;
    }

    // Amber Sentinel: Hidas laskeutuminen, ampuu hakeutuvan bio-orbin
    function createAmberSentinel(x, y) {
        const enemy = {
            x: x,
            y: y,
            maxHealth: 11,
            health: 11,
            speed: 2.3,
            fireRate: 2200,
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
        createEnemyElement(enemy, AMBER_SENTINEL_SVG);
        updateEnemyHealthBar(enemy);
        return enemy;
    }

    // Bronze Overlord: Korkeaterveyksinen panssaroitu risteilijä, nopea pystysuuntainen siksak
    function createBronzeOverlord(x, y) {
        const enemy = {
            x: x,
            y: y,
            maxHealth: 12,
            health: 12,
            speed: 2.5,
            verticalSineOffset: Math.random() * Math.PI * 2,
            verticalSineSpeed: 0.01,
            verticalSineMagnitude: 25,
            fireRate: 1300,
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
        createEnemyElement(enemy, BRONZE_OVERLORD_SVG);
        updateEnemyHealthBar(enemy);
        return enemy;
    }

    // Emerald Titan: Erittäin hidas ja kestävä, laukaisee viiden ammuksen viuhkan
    function createEmeraldTitan(x, y) {
        const enemy = {
            x: x,
            y: y,
            maxHealth: 16,
            health: 16,
            speed: 1.8,
            fireRate: 3200,
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
                    for (let i = -2; i <= 2; i++) { 
                        enemyShootProjectile(this.x + i * 12, this.y + this.height / 2 - ENEMY_MUZZLE_OFFSET_Y, playerX + i * 20);
                    }
                    this.lastShotTime = currentTime;
                }
            }
        };
        createEnemyElement(enemy, EMERALD_TITAN_SVG);
        updateEnemyHealthBar(enemy);
        return enemy;
    }

    // --- ELIITTIVASTUKSET (POMOVASTUKSET) ---

    // Omega Nemesis: Nopeat tupla-aseet ja sivuttaisliike
    function createOmegaNemesis(x, y) {
        const elite = {
            x: x,
            y: y,
            maxHealth: 45,
            health: 45,
            speed: 1.8,
            patrolSpeedX: 2.2,
            fireRatePrimary: 550, // Tiheä tupla-ammus
            lastShotTimePrimary: performance.now(),
            width: ENEMY_WIDTH_ELITE,
            height: ENEMY_HEIGHT_ELITE,
            isElite: true,
            points: ENEMY_POINTS_ELITE,
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
                    this.y = this.targetY + Math.sin(currentTime * 0.0006) * 12;
                    if (this.x - this.width / 2 < 0 || this.x + this.width / 2 > gameWidthRef) {
                        this.patrolSpeedX *= -1;
                        this.x = Math.max(this.width / 2, Math.min(gameWidthRef - this.width / 2, this.x));
                    }
                }
                updateEnemyElementPosition(this);
            },
            shoot: function(currentTime, playerX) {
                if (currentTime - this.lastShotTimePrimary > this.fireRatePrimary) {
                    enemyShootProjectile(this.x - 25, this.y + this.height / 2 - ENEMY_MUZZLE_OFFSET_Y, playerX);
                    enemyShootProjectile(this.x + 25, this.y + this.height / 2 - ENEMY_MUZZLE_OFFSET_Y, playerX);
                    this.lastShotTimePrimary = currentTime;
                }
            }
        };
        createEnemyElement(elite, OMEGA_NEMESIS_SVG);
        elite.element.style.width = `${elite.width}px`;
        elite.element.style.height = `${elite.height}px`;
        updateEnemyHealthBar(elite);
        return elite;
    }

    // Astral Citadel: Laaja hajonta-aseistus sekä hakeutuva raskaampi bio-orbi
    function createAstralCitadel(x, y) {
        const elite = {
            x: x,
            y: y,
            maxHealth: 60,
            health: 60,
            speed: 1.5,
            patrolSpeedX: 1.8,
            fireRateScatter: 1600,
            fireRateTracking: 3000,
            lastShotTimeScatter: performance.now(),
            lastShotTimeTracking: performance.now() + 1500,
            width: ENEMY_WIDTH_ELITE * 1.2,
            height: ENEMY_HEIGHT_ELITE * 1.2,
            isElite: true,
            points: ENEMY_POINTS_ELITE * 1.2,
            state: 'descend',
            targetY: gameHeightRef * 0.22,
            update: function(currentTime, frameRateFactor) {
                if (this.state === 'descend') {
                    this.y += this.speed * frameRateFactor;
                    if (this.y >= this.targetY) {
                        this.y = this.targetY;
                        this.state = 'patrol';
                    }
                } else if (this.state === 'patrol') {
                    this.x += this.patrolSpeedX * frameRateFactor;
                    this.y = this.targetY + Math.cos(currentTime * 0.0005) * 15;
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
                    enemyShootSpecialOrb(this.x, this.y + this.height / 2 - ENEMY_MUZZLE_OFFSET_Y + 10, playerX, 'tracking_large');
                    this.lastShotTimeTracking = currentTime;
                }
            }
        };
        createEnemyElement(elite, ASTRAL_CITADEL_SVG);
        elite.element.style.width = `${elite.width}px`;
        elite.element.style.height = `${elite.height}px`;
        updateEnemyHealthBar(elite);
        return elite;
    }

    // --- Ammusten fysiikka ja logiikka ---
    function enemyShootProjectile(startX, startY, targetPlayerX, type = 'standard') {
        const projectile = document.createElement('div');
        projectile.classList.add('enemy-projectile');

        let speedX = 0;
        let speedY = ENEMY_PROJECTILE_SPEED;

        if (targetPlayerX !== undefined && playerXRef !== undefined) {
            const dx = targetPlayerX - startX;
            const dy = gameHeightRef - startY; 

            const angle = Math.atan2(dy, dx);
            speedX = Math.cos(angle) * ENEMY_PROJECTILE_SPEED;
            speedY = Math.sin(angle) * ENEMY_PROJECTILE_SPEED;
        }

        if (type === 'fast') {
            speedY *= 1.25; 
            speedX *= 1.25;
            projectile.style.background = 'linear-gradient(to right, #00ffff, #009999)';
            projectile.style.boxShadow = '0 0 5px #00ffff';
        }

        projectile.style.left = `${startX - 2.5}px`;
        projectile.style.top = `${startY}px`;
        gameContainerRef.appendChild(projectile);
        enemyProjectiles.push({ element: projectile, y: startY, x: startX, speedX: speedX, speedY: speedY, type: 'standard' });
    }

    function enemyShootScatterProjectile(startX, startY, numProjectiles, spreadAngle, targetPlayerX) {
        let initialAngle = Math.atan2(gameHeightRef - startY, targetPlayerX - startX);

        for (let i = 0; i < numProjectiles; i++) {
            const projectile = document.createElement('div');
            projectile.classList.add('enemy-projectile');
            projectile.style.width = '7px';
            projectile.style.height = '7px';
            projectile.style.borderRadius = '50%';
            projectile.style.background = 'radial-gradient(circle at center, #ff8c00 0%, #cc6600 100%)';
            projectile.style.boxShadow = '0 0 8px #ff8c00, 0 0 15px rgba(255,140,0,0.7)';

            const angleOffset = (i - (numProjectiles - 1) / 2) * (spreadAngle / (numProjectiles - 1 || 1));
            const currentAngle = initialAngle + angleOffset;

            const speedX = Math.cos(currentAngle) * ENEMY_SCATTER_PROJECTILE_SPEED;
            const speedY = Math.sin(currentAngle) * ENEMY_SCATTER_PROJECTILE_SPEED;

            projectile.style.left = `${startX - 3.5}px`; 
            projectile.style.top = `${startY}px`;
            gameContainerRef.appendChild(projectile);
            enemyProjectiles.push({ element: projectile, y: startY, x: startX, speedX: speedX, speedY: speedY, type: 'standard' });
        }
    }

    function enemyShootSpecialOrb(startX, startY, targetPlayerX, type = 'tracking') {
        const orb = document.createElement('div');
        orb.classList.add('enemy-projectile'); 
        let orbSize = 10;
        let orbColor = 'radial-gradient(circle at center, #ff00ff 0%, #990099 100%)';
        let orbShadow = '0 0 10px #ff00ff, 0 0 20px rgba(255,0,255,0.7)';
        let orbSpeed = ENEMY_TRACKING_ORB_SPEED;
        let orbClass = 'special-orb-tracking';

        if (type === 'tracking_large') {
            orbSize = 16;
            orbColor = 'radial-gradient(circle at center, #ffff00 0%, #cc9900 100%)';
            orbShadow = '0 0 10px #ffff00, 0 0 20px rgba(255,255,0,0.7)';
            orbSpeed = ENEMY_TRACKING_ORB_SPEED * 0.85;
            orbClass = 'special-orb-tracking-large';
        }

        orb.style.width = `${orbSize}px`;
        orb.style.height = `${orbSize}px`;
        orb.style.borderRadius = '50%';
        orb.style.background = orbColor;
        orb.style.boxShadow = orbShadow;
        orb.classList.add(orbClass); 

        orb.style.left = `${startX - orbSize / 2}px`;
        orb.style.top = `${startY}px`;
        gameContainerRef.appendChild(orb);

        let speedX = 0;
        let speedY = orbSpeed;

        if (targetPlayerX !== undefined) {
            const dx = targetPlayerX - startX;
            const dy = (gameHeightRef * 0.8) - startY; 

            const angle = Math.atan2(dy, dx);
            speedX = Math.cos(angle) * orbSpeed;
            speedY = Math.sin(angle) * orbSpeed;
        }

        enemyProjectiles.push({ element: orb, x: startX, y: startY, speedX: speedX, speedY: speedY, type: type, targetX: targetPlayerX, orbSize: orbSize });
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
            lastRegularEnemySpawnTime = 0;
            numRegularEnemiesSpawned = 0;
            eliteSpawnStarted = false;
            numEliteEnemiesSpawnedTotal = 0;
            activeEliteEnemiesCount = 0;
            levelCompleteFlag = false;
            playerXRef = undefined; 
        },

        updateEnemies: function(currentTime, frameRateFactor, activePlayerXRefs) {
            if (activePlayerXRefs && activePlayerXRefs.length > 0) {
                playerXRef = activePlayerXRefs[0];
            } else {
                playerXRef = undefined; 
            }

            // Vaihe 1: Tavallisten alusten spawn
            if (!eliteSpawnStarted && numRegularEnemiesSpawned < MAX_REGULAR_ENEMIES_BEFORE_ELITES) {
                if (currentTime - lastRegularEnemySpawnTime > regularEnemySpawnRate) {
                    this.spawnRegularEnemy();
                    lastRegularEnemySpawnTime = currentTime;
                    numRegularEnemiesSpawned++;
                }
            }
            // Vaihe 2: Eliittivaiheen käynnistys
            else if (!eliteSpawnStarted && numRegularEnemiesSpawned >= MAX_REGULAR_ENEMIES_BEFORE_ELITES) {
                eliteSpawnStarted = true;
            }

            // Eliittivaiheen spawn-logiikka
            if (eliteSpawnStarted && numEliteEnemiesSpawnedTotal < MAX_ELITE_ENEMIES_TO_DEFEAT) {
                if (activeEliteEnemiesCount < 1 && currentTime - lastRegularEnemySpawnTime > 3500) { 
                     this.spawnEliteEnemy();
                     lastRegularEnemySpawnTime = currentTime; 
                }
            } else if (eliteSpawnStarted && numEliteEnemiesSpawnedTotal >= MAX_ELITE_ENEMIES_TO_DEFEAT && activeEnemies.length === 0) {
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
                createOculusPrime,
                createViperHelix,
                createScarletObelisk,
                createAmberSentinel,
                createBronzeOverlord,
                createEmeraldTitan
            ];
            const randomEnemyCreator = enemyTypes[Math.floor(Math.random() * enemyTypes.length)];
            const newEnemy = randomEnemyCreator(x, y);

            gameContainerRef.appendChild(newEnemy.element);
            activeEnemies.push(newEnemy);
        },

        spawnEliteEnemy: function() {
            const x = gameWidthRef / 2 + (Math.random() * 200 - 100); 
            const y = -ENEMY_HEIGHT_ELITE; 

            const eliteTypes = [
                createOmegaNemesis,
                createAstralCitadel
            ];

            const randomEliteCreator = eliteTypes[numEliteEnemiesSpawnedTotal % eliteTypes.length]; 
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

                        if (!p.piercing) {
                            p.element.remove();
                            playerProjectiles.splice(i, 1);
                            i--; 
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
                        if (!p.piercing) break; 
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
            return levelCompleteFlag;
        },

        isBossLevel: function() {
            return eliteSpawnStarted || activeEliteEnemiesCount > 0;
        },

        onResize: function(newWidth, newHeight) {
            gameWidthRef = newWidth;
            gameHeightRef = newHeight;
            activeEnemies.forEach(enemy => {
                if (enemy.isElite && enemy.state === 'patrol') {
                    if (enemy.maxHealth === 45) enemy.targetY = newHeight * 0.2; // Omega Nemesis
                    else if (enemy.maxHealth === 60) enemy.targetY = newHeight * 0.22; // Astral Citadel
                }
                if (enemy.type === 'ViperHelix' && !enemy.hasStopped) {
                    enemy.stopY = newHeight * (0.25 + Math.random() * 0.3);
                }
            });
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