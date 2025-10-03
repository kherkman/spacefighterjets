// playerPlanes.js

// Player Plane Data
const planesData = [
    {
        id: 'interceptor',
        name: 'Interceptor',
        description: 'A balanced fighter with standard speed and firepower.',
        startingWeapon: 'standard',
        initialHealth: 17,
        maxSpeedX: 7,
        maxSpeedY: 5,
        accelerationX: 0.5,
        decelerationX: 0.8,
        accelerationY: 0.4,
        decelerationY: 0.7,
        shotCooldownMs: 150,
        svg: `
            <svg viewBox="0 0 1000 1000">
                <defs>
                    <!-- Changed IDs for Interceptor to be unique -->
                    <linearGradient id="mainBodyGradient_interceptor" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:#8e2de2; stop-opacity:1" /><stop offset="100%" style="stop-color:#4a00e0; stop-opacity:1" /></linearGradient>
                    <linearGradient id="wingGradient_interceptor" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:#FF00CC; stop-opacity:1" /><stop offset="100%" style="stop-color:#3333FF; stop-opacity:1" /></linearGradient>
                    <linearGradient id="cockpitGradient_interceptor" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:#00DBDE; stop-opacity:1" /><stop offset="100%" style="stop-color:#FC00FF; stop-opacity:1" /></linearGradient>
                    <linearGradient id="exhaustGradient_interceptor" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:#FF9900; stop-opacity:1" /><stop offset="100%" style="stop-color:#FF0000; stop-opacity:1" /></linearGradient>
                    <linearGradient id="accentGradient_interceptor" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:#7F00FF; stop-opacity:1" /><stop offset="100%" style="stop-color:#E100FF; stop-opacity:1" /></linearGradient>
                    <linearGradient id="trailPinkGradient_interceptor" x1="0%" y1="100%" x2="0%" y2="0%"><stop offset="0%" style="stop-color:#FF00CC; stop-opacity:0.8" /><stop offset="100%" style="stop-color:#FF00CC; stop-opacity:0" /></linearGradient>
                    <linearGradient id="trailBlueGradient_interceptor" x1="0%" y1="100%" x2="0%" y2="0%"><stop offset="0%" style="stop-color:#00FFFF; stop-opacity:0.8" /><stop offset="100%" style="stop-color:#00FFFF; stop-opacity:0" /></linearGradient>
                </defs>
                <g transform="translate(500, 500) rotate(0) translate(-500, -500)">
                    <!-- Updated fill references to new unique IDs -->
                    <polygon fill="url(#mainBodyGradient_interceptor)" points="500,300 450,450 550,450"></polygon>
                    <polygon fill="url(#mainBodyGradient_interceptor)" points="450,450 550,450 400,600 600,600"></polygon>
                    <polygon fill="url(#mainBodyGradient_interceptor)" points="450,450 400,600 500,525"></polygon>
                    <polygon fill="url(#mainBodyGradient_interceptor)" points="550,450 600,600 500,525"></polygon>
                    <polygon fill="url(#cockpitGradient_interceptor)" points="500,330 480,420 520,420"></polygon>
                    <polygon fill="url(#cockpitGradient_interceptor)" points="480,420 490,400 500,430"></polygon>
                    <polygon fill="url(#cockpitGradient_interceptor)" points="520,420 510,400 500,430"></polygon>
                    <polygon fill="url(#wingGradient_interceptor)" points="450,450 300,550 400,600"></polygon>
                    <polygon fill="url(#wingGradient_interceptor)" points="400,600 300,550 350,650"></polygon>
                    <polygon fill="url(#wingGradient_interceptor)" points="550,450 700,550 600,600"></polygon>
                    <polygon fill="url(#wingGradient_interceptor)" points="600,600 700,550 650,650"></polygon>
                    <polygon fill="url(#accentGradient_interceptor)" points="420,680 400,730 440,730"></polygon>
                    <polygon fill="url(#accentGradient_interceptor)" points="580,680 560,730 600,730"></polygon>
                    <polygon fill="url(#exhaustGradient_interceptor)" points="400,600 420,650 380,650"></polygon>
                    <polygon fill="url(#exhaustGradient_interceptor)" points="600,600 620,650 580,650"></polygon>
                    <polygon fill="url(#mainBodyGradient_interceptor)" points="400,600 600,600 500,700"></polygon>
                    <polygon fill="url(#trailPinkGradient_interceptor)" points="400,600 380,550 420,550"></polygon>
                    <polygon fill="url(#trailPinkGradient_interceptor)" points="405,620 385,570 425,570"></polygon>
                    <polygon fill="url(#trailBlueGradient_interceptor)" points="600,600 580,550 620,550"></polygon>
                    <polygon fill="url(#trailBlueGradient_interceptor)" points="595,620 575,570 615,570"></polygon>
                </g>
            </svg>
        `
    },
    {
        id: 'speedster',
        name: 'Speedster',
        description: 'High speed and maneuverability, but lower fire rate. Less durable.',
        startingWeapon: 'standard',
        initialHealth: 22,
        maxSpeedX: 9,
        maxSpeedY: 7,
        accelerationX: 0.6,
        decelerationX: 0.9,
        accelerationY: 0.5,
        decelerationY: 0.8,
        shotCooldownMs: 200,
        svg: `
            <svg viewBox="0 0 1000 1000">
                <defs>
                    <linearGradient id="mainBodyGradient_speedster" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:#00ffff; stop-opacity:1" /><stop offset="100%" style="stop-color:#00bbff; stop-opacity:1" /></linearGradient>
                    <linearGradient id="wingGradient_speedster" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:#ff9900; stop-opacity:1" /><stop offset="100%" style="stop-color:#ff6600; stop-opacity:1" /></linearGradient>
                    <linearGradient id="cockpitGradient_speedster" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:#ccff00; stop-opacity:1" /><stop offset="100%" style="stop-color:#99ff00; stop-opacity:1" /></linearGradient>
                    <linearGradient id="exhaustGradient_speedster" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:#ff00cc; stop-opacity:1" /><stop offset="100%" style="stop-color:#ff3399; stop-opacity:1" /></linearGradient>
                    <linearGradient id="accentGradient_speedster" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:#cc00ff; stop-opacity:1" /><stop offset="100%" style="stop-color:#9900cc; stop-opacity:1" /></linearGradient>
                </defs>
                <g transform="translate(500, 500) rotate(0) translate(-500, -500)">
                    <polygon fill="url(#mainBodyGradient_speedster)" points="500,250 470,400 530,400"></polygon>
                    <polygon fill="url(#mainBodyGradient_speedster)" points="470,400 530,400 420,550 580,550"></polygon>
                    <polygon fill="url(#cockpitGradient_speedster)" points="500,280 490,350 510,350"></polygon>
                    <polygon fill="url(#wingGradient_speedster)" points="470,400 300,500 420,550"></polygon>
                    <polygon fill="url(#wingGradient_speedster)" points="530,400 700,500 580,550"></polygon>
                    <polygon fill="url(#mainBodyGradient_speedster)" points="420,550 580,550 500,650"></polygon>
                    <polygon fill="url(#exhaustGradient_speedster)" points="430,600 410,650 450,650"></polygon>
                    <polygon fill="url(#exhaustGradient_speedster)" points="570,600 550,650 590,650"></polygon>
                </g>
            </svg>
        `
    },
    {
        id: 'heavygunner',
        name: 'Heavy Gunner',
        description: 'Slower, but starts with an upgraded weapon and higher fire rate. More durable.',
        startingWeapon: 'triple',
        initialHealth: 14,
        maxSpeedX: 5,
        maxSpeedY: 3,
        accelerationX: 0.4,
        decelerationX: 0.7,
        accelerationY: 0.3,
        decelerationY: 0.6,
        shotCooldownMs: 100,
        svg: `
            <svg viewBox="0 0 1000 1000">
                <defs>
                    <linearGradient id="mainBodyGradient_heavygunner" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:#ff0000; stop-opacity:1" /><stop offset="100%" style="stop-color:#bb0000; stop-opacity:1" /></linearGradient>
                    <linearGradient id="wingGradient_heavygunner" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:#33ff33; stop-opacity:1" /><stop offset="100%" style="stop-color:#00cc00; stop-opacity:1" /></linearGradient>
                    <linearGradient id="cockpitGradient_heavygunner" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:#ffcc00; stop-opacity:1" /><stop offset="100%" style="stop-color:#cc9900; stop-opacity:1" /></linearGradient>
                    <linearGradient id="exhaustGradient_heavygunner" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:#0033ff; stop-opacity:1" /><stop offset="100%" style="stop-color:#0000cc; stop-opacity:1" /></linearGradient>
                    <linearGradient id="accentGradient_heavygunner" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:#ff66cc; stop-opacity:1" /><stop offset="100%" style="stop-color:#cc3399; stop-opacity:1" /></linearGradient>
                </defs>
                <g transform="translate(500, 500) rotate(0) translate(-500, -500)">
                    <polygon fill="url(#mainBodyGradient_heavygunner)" points="500,350 460,500 540,500"></polygon>
                    <polygon fill="url(#mainBodyGradient_heavygunner)" points="460,500 540,500 400,650 600,650"></polygon>
                    <polygon fill="url(#cockpitGradient_heavygunner)" points="500,380 490,450 510,450"></polygon>
                    <polygon fill="url(#wingGradient_heavygunner)" points="460,500 250,600 400,650"></polygon>
                    <polygon fill="url(#wingGradient_heavygunner)" points="540,500 750,600 600,650"></polygon>
                    <rect x="440" y="550" width="20" height="80" fill="url(#accentGradient_heavygunner)"></rect>
                    <rect x="540" y="550" width="20" height="80" fill="url(#accentGradient_heavygunner)"></rect>
                    <polygon fill="url(#mainBodyGradient_heavygunner)" points="400,650 600,650 500,750"></polygon>
                    <polygon fill="url(#exhaustGradient_heavygunner)" points="410,700 390,750 430,750"></polygon>
                    <polygon fill="url(#exhaustGradient_heavygunner)" points="590,700 570,750 610,750"></polygon>
                </g>
            </svg>
        `
    },
    {
        id: 'crimsonserpent',
        name: 'Crimson Serpent',
        description: 'An aggressive fighter with good health and average speed.',
        startingWeapon: 'standard',
        initialHealth: 16,
        maxSpeedX: 6,
        maxSpeedY: 4,
        accelerationX: 0.45,
        decelerationX: 0.75,
        accelerationY: 0.35,
        decelerationY: 0.65,
        shotCooldownMs: 140,
        svg: `
            <svg viewBox="0 0 1000 1000">
                <defs>
                    <linearGradient id="mainBodyGradient_crimson" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" style="stop-color:#990000; stop-opacity:1" />
                        <stop offset="100%" style="stop-color:#CC3300; stop-opacity:1" />
                    </linearGradient>
                    <linearGradient id="wingGradient_crimson" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" style="stop-color:#FF6600; stop-opacity:1" />
                        <stop offset="100%" style="stop-color:#FF3366; stop-opacity:1" />
                    </linearGradient>
                    <linearGradient id="cockpitGradient_crimson" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" style="stop-color:#FFCC00; stop-opacity:1" />
                        <stop offset="100%" style="stop-color:#FF6600; stop-opacity:1" />
                    </linearGradient>
                    <linearGradient id="exhaustGradient_crimson" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" style="stop-color:#FF0000; stop-opacity:1" />
                        <stop offset="100%" style="stop-color:#CC0000; stop-opacity:1" />
                    </linearGradient>
                    <linearGradient id="accentGradient_crimson" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" style="stop-color:#660066; stop-opacity:1" />
                        <stop offset="100%" style="stop-color:#CC00CC; stop-opacity:1" />
                    </linearGradient>
                    <linearGradient id="trailPinkGradient_crimson" x1="0%" y1="100%" x2="0%" y2="0%">
                        <stop offset="0%" style="stop-color:#FF3366; stop-opacity:0.8" />
                        <stop offset="100%" style="stop-color:#FF3366; stop-opacity:0" />
                    </linearGradient>
                    <linearGradient id="trailBlueGradient_crimson" x1="0%" y1="100%" x2="0%" y2="0%">
                        <stop offset="0%" style="stop-color:#FFCC00; stop-opacity:0.8" />
                        <stop offset="100%" style="stop-color:#FFCC00; stop-opacity:0" />
                    </linearGradient>
                </defs>

                <g transform="translate(500, 500) rotate(0) translate(-500, -500)">
                    <polygon fill="url(#trailPinkGradient_crimson)" points="410,610 390,560 430,560"></polygon>
                    <polygon fill="url(#trailPinkGradient_crimson)" points="415,630 395,580 435,580"></polygon>
                    <polygon fill="url(#trailBlueGradient_crimson)" points="590,610 570,560 610,560"></polygon>
                    <polygon fill="url(#trailBlueGradient_crimson)" points="585,630 565,580 605,580"></polygon>
                    <polygon fill="url(#mainBodyGradient_crimson)" points="500,300 440,460 560,460"></polygon>
                    <polygon fill="url(#mainBodyGradient_crimson)" points="440,460 560,460 380,620 620,620"></polygon>
                    <polygon fill="url(#mainBodyGradient_crimson)" points="440,460 380,620 500,540"></polygon>
                    <polygon fill="url(#mainBodyGradient_crimson)" points="560,460 620,620 500,540"></polygon>
                    <polygon fill="url(#cockpitGradient_crimson)" points="500,340 475,430 525,430"></polygon>
                    <polygon fill="url(#cockpitGradient_crimson)" points="475,430 490,410 500,440"></polygon>
                    <polygon fill="url(#cockpitGradient_crimson)" points="525,430 510,410 500,440"></polygon>
                    <polygon fill="url(#wingGradient_crimson)" points="440,460 280,580 390,630"></polygon>
                    <polygon fill="url(#wingGradient_crimson)" points="390,630 280,580 340,680"></polygon>
                    <polygon fill="url(#wingGradient_crimson)" points="560,460 720,580 610,630"></polygon>
                    <polygon fill="url(#wingGradient_crimson)" points="610,630 720,580 660,680"></polygon>
                    <polygon fill="url(#accentGradient_crimson)" points="430,690 415,720 445,720"></polygon>
                    <polygon fill="url(#accentGradient_crimson)" points="570,690 555,720 585,720"></polygon>
                    <polygon fill="url(#exhaustGradient_crimson)" points="380,620 430,680 370,680"></polygon>
                    <polygon fill="url(#exhaustGradient_crimson)" points="620,620 630,680 570,680"></polygon>
                    <polygon fill="url(#mainBodyGradient_crimson)" points="380,620 620,620 500,720"></polygon>
                </g>
            </svg>
        `
    },
    {
        id: 'neonstingray',
        name: 'Neon Stingray',
        description: 'An agile fighter with a high fire rate, but lower durability. Starts with a "fast" weapon effect.',
        startingWeapon: 'fast',
        initialHealth: 15,
        maxSpeedX: 8,
        maxSpeedY: 6,
        accelerationX: 0.55,
        decelerationX: 0.85,
        accelerationY: 0.45,
        decelerationY: 0.75,
        shotCooldownMs: 130,
        svg: `
            <svg viewBox="0 0 1000 1000">
                <defs>
                    <linearGradient id="mainBodyGradient_stingray" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" style="stop-color:#00FFFF; stop-opacity:1" />
                        <stop offset="100%" style="stop-color:#0077FF; stop-opacity:1" />
                    </linearGradient>
                    <linearGradient id="wingGradient_stingray" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" style="stop-color:#FF33CC; stop-opacity:1" />
                        <stop offset="100%" style="stop-color:#6600FF; stop-opacity:1" />
                    </linearGradient>
                    <linearGradient id="cockpitGradient_stingray" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" style="stop-color:#33FF00; stop-opacity:1" />
                        <stop offset="100%" style="stop-color:#00CCFF; stop-opacity:1" />
                    </linearGradient>
                    <linearGradient id="exhaustGradient_stingray" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" style="stop-color:#FFFF00; stop-opacity:1" />
                        <stop offset="100%" style="stop-color:#FF00FF; stop-opacity:1" />
                    </linearGradient>
                    <linearGradient id="accentGradient_stingray" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" style="stop-color:#00FF99; stop-opacity:1" />
                        <stop offset="100%" style="stop-color:#99FFCC; stop-opacity:1" />
                    </linearGradient>
                    <linearGradient id="trailPinkGradient_stingray" x1="0%" y1="100%" x2="0%" y2="0%">
                        <stop offset="0%" style="stop-color:#FF33CC; stop-opacity:0.8" />
                        <stop offset="100%" style="stop-color:#FF33CC; stop-opacity:0" />
                    </linearGradient>
                    <linearGradient id="trailBlueGradient_stingray" x1="0%" y1="100%" x2="0%" y2="0%">
                        <stop offset="0%" style="stop-color:#00FFFF; stop-opacity:0.8" />
                        <stop offset="100%" style="stop-color:#00FFFF; stop-opacity:0" />
                    </linearGradient>
                </defs>

                <g transform="translate(500, 500) rotate(0) translate(-500, -500)">
                    <polygon fill="url(#trailPinkGradient_stingray)" points="400,600 380,550 420,550"></polygon>
                    <polygon fill="url(#trailPinkGradient_stingray)" points="405,620 385,570 425,570"></polygon>
                    <polygon fill="url(#trailBlueGradient_stingray)" points="600,600 580,550 620,550"></polygon>
                    <polygon fill="url(#trailBlueGradient_stingray)" points="595,620 575,570 615,570"></polygon>
                    <polygon fill="url(#mainBodyGradient_stingray)" points="500,320 460,450 540,450"></polygon>
                    <polygon fill="url(#mainBodyGradient_stingray)" points="460,450 540,450 380,600 620,600"></polygon>
                    <polygon fill="url(#mainBodyGradient_stingray)" points="460,450 380,600 500,520"></polygon>
                    <polygon fill="url(#mainBodyGradient_stingray)" points="540,450 620,600 500,520"></polygon>
                    <polygon fill="url(#cockpitGradient_stingray)" points="500,340 485,430 515,430"></polygon>
                    <polygon fill="url(#cockpitGradient_stingray)" points="485,430 495,410 500,440"></polygon>
                    <polygon fill="url(#cockpitGradient_stingray)" points="515,430 505,410 500,440"></polygon>
                    <polygon fill="url(#wingGradient_stingray)" points="460,450 250,560 380,600"></polygon>
                    <polygon fill="url(#wingGradient_stingray)" points="380,600 250,560 330,680"></polygon>
                    <polygon fill="url(#wingGradient_stingray)" points="540,450 750,560 620,600"></polygon>
                    <polygon fill="url(#wingGradient_stingray)" points="620,600 750,560 670,680"></polygon>
                    <polygon fill="url(#accentGradient_stingray)" points="400,670 380,740 420,740"></polygon>
                    <polygon fill="url(#accentGradient_stingray)" points="600,670 580,740 620,740"></polygon>
                    <polygon fill="url(#exhaustGradient_stingray)" points="390,600 400,660 380,660"></polygon>
                    <polygon fill="url(#exhaustGradient_stingray)" points="610,600 620,660 600,660"></polygon>
                    <polygon fill="url(#mainBodyGradient_stingray)" points="380,600 620,600 500,700"></polygon>
                </g>
            </svg>
        `
    },
    {
        id: 'starrunner',
        name: 'Star Runner',
        description: 'A versatile fighter with balanced stats, starting with a piercing weapon effect.',
        startingWeapon: 'piercing',
        initialHealth: 15,
        maxSpeedX: 7,
        maxSpeedY: 5,
        accelerationX: 0.5,
        decelerationX: 0.8,
        accelerationY: 0.4,
        decelerationY: 0.7,
        shotCooldownMs: 160,
        svg: `
            <svg viewBox="0 0 1000 1000">
                <defs>
                    <linearGradient id="mainBodyGradient_starrunner" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" style="stop-color:#FFD700; stop-opacity:1" />
                        <stop offset="100%" style="stop-color:#FFA500; stop-opacity:1" />
                    </linearGradient>
                    <linearGradient id="wingGradient_starrunner" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" style="stop-color:#00BFFF; stop-opacity:1" />
                        <stop offset="100%" style="stop-color:#1E90FF; stop-opacity:1" />
                    </linearGradient>
                    <linearGradient id="cockpitGradient_starrunner" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" style="stop-color:#98FB98; stop-opacity:1" />
                        <stop offset="100%" style="stop-color:#00FF00; stop-opacity:1" />
                    </linearGradient>
                    <linearGradient id="exhaustGradient_starrunner" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" style="stop-color:#FF4500; stop-opacity:1" />
                        <stop offset="100%" style="stop-color:#FF0000; stop-opacity:1" />
                    </linearGradient>
                    <linearGradient id="accentGradient_starrunner" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" style="stop-color:#FFD700; stop-opacity:1" />
                        <stop offset="100%" style="stop-color:#FFFFFF; stop-opacity:1" />
                    </linearGradient>
                    <linearGradient id="trailPinkGradient_starrunner" x1="0%" y1="100%" x2="0%" y2="0%">
                        <stop offset="0%" style="stop-color:#FFD700; stop-opacity:0.8" />
                        <stop offset="100%" style="stop-color:#FFD700; stop-opacity:0" />
                    </linearGradient>
                    <linearGradient id="trailBlueGradient_starrunner" x1="0%" y1="100%" x2="0%" y2="0%">
                        <stop offset="0%" style="stop-color:#00BFFF; stop-opacity:0.8" />
                        <stop offset="100%" style="stop-color:#00BFFF; stop-opacity:0" />
                    </linearGradient>
                </defs>

                <g transform="translate(500, 500) rotate(0) translate(-500, -500)">
                    <polygon fill="url(#trailPinkGradient_starrunner)" points="400,600 380,550 420,550"></polygon>
                    <polygon fill="url(#trailPinkGradient_starrunner)" points="405,620 385,570 425,570"></polygon>
                    <polygon fill="url(#trailBlueGradient_starrunner)" points="600,600 580,550 620,550"></polygon>
                    <polygon fill="url(#trailBlueGradient_starrunner)" points="595,620 575,570 615,570"></polygon>
                    <polygon fill="url(#mainBodyGradient_starrunner)" points="500,280 470,420 530,420"></polygon>
                    <polygon fill="url(#mainBodyGradient_starrunner)" points="470,420 530,420 420,600 580,600"></polygon>
                    <polygon fill="url(#mainBodyGradient_starrunner)" points="470,420 420,600 500,510"></polygon>
                    <polygon fill="url(#mainBodyGradient_starrunner)" points="530,420 580,600 500,510"></polygon>
                    <polygon fill="url(#cockpitGradient_starrunner)" points="500,310 480,400 520,400"></polygon>
                    <polygon fill="url(#cockpitGradient_starrunner)" points="480,400 490,380 500,410"></polygon>
                    <polygon fill="url(#cockpitGradient_starrunner)" points="520,400 510,380 500,410"></polygon>
                    <polygon fill="url(#wingGradient_starrunner)" points="470,420 290,500 420,600"></polygon>
                    <polygon fill="url(#wingGradient_starrunner)" points="420,600 290,500 380,680"></polygon>
                    <polygon fill="url(#wingGradient_starrunner)" points="530,420 710,500 580,600"></polygon>
                    <polygon fill="url(#wingGradient_starrunner)" points="580,600 710,500 620,680"></polygon>
                    <polygon fill="url(#accentGradient_starrunner)" points="420,680 400,730 440,730"></polygon>
                    <polygon fill="url(#accentGradient_starrunner)" points="580,680 560,730 600,730"></polygon>
                    <polygon fill="url(#exhaustGradient_starrunner)" points="420,600 440,660 400,660"></polygon>
                    <polygon fill="url(#exhaustGradient_starrunner)" points="580,600 600,660 560,660"></polygon>
                    <polygon fill="url(#mainBodyGradient_starrunner)" points="420,600 580,600 500,700"></polygon>
                </g>
            </svg>
        `
    },
    {
        id: 'quantumray',
        name: 'Quantum Ray',
        description: 'A slower fighter with high durability, starting with a powerful "burst" weapon effect.',
        startingWeapon: 'burst',
        initialHealth: 14,
        maxSpeedX: 5,
        maxSpeedY: 4,
        accelerationX: 0.4,
        decelerationX: 0.7,
        accelerationY: 0.3,
        decelerationY: 0.6,
        shotCooldownMs: 180, // Burst weapon will override this to be faster
        svg: `
            <svg viewBox="0 0 1000 1000">
                <defs>
                    <linearGradient id="mainBodyGradient_quantum" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" style="stop-color:#00FF00; stop-opacity:1" />
                        <stop offset="100%" style="stop-color:#33FF33; stop-opacity:1" />
                    </linearGradient>
                    <linearGradient id="wingGradient_quantum" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" style="stop-color:#FFCC00; stop-opacity:1" />
                        <stop offset="100%" style="stop-color:#FF00FF; stop-opacity:1" />
                    </linearGradient>
                    <linearGradient id="cockpitGradient_quantum" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" style="stop-color:#99FF99; stop-opacity:1" />
                        <stop offset="100%" style="stop-color:#CCFFCC; stop-opacity:1" />
                    </linearGradient>
                    <linearGradient id="exhaustGradient_quantum" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" style="stop-color:#FF00FF; stop-opacity:1" />
                        <stop offset="100%" style="stop-color:#FF66FF; stop-opacity:1" />
                    </linearGradient>
                    <linearGradient id="accentGradient_quantum" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" style="stop-color:#009900; stop-opacity:1" />
                        <stop offset="100%" style="stop-color:#66CC66; stop-opacity:1" />
                    </linearGradient>
                    <linearGradient id="trailPinkGradient_quantum" x1="0%" y1="100%" x2="0%" y2="0%">
                        <stop offset="0%" style="stop-color:#FF00FF; stop-opacity:0.8" />
                        <stop offset="100%" style="stop-color:#FF00FF; stop-opacity:0" />
                    </linearGradient>
                    <linearGradient id="trailBlueGradient_quantum" x1="0%" y1="100%" x2="0%" y2="0%">
                        <stop offset="0%" style="stop-color:#00FF00; stop-opacity:0.8" />
                        <stop offset="100%" style="stop-color:#00FF00; stop-opacity:0" />
                    </linearGradient>
                </defs>

                <g transform="translate(500, 500) rotate(0) translate(-500, -500)">
                    <polygon fill="url(#trailPinkGradient_quantum)" points="390,620 370,570 410,570"></polygon>
                    <polygon fill="url(#trailPinkGradient_quantum)" points="395,640 375,590 415,590"></polygon>
                    <polygon fill="url(#trailBlueGradient_quantum)" points="610,620 590,570 630,570"></polygon>
                    <polygon fill="url(#trailBlueGradient_quantum)" points="605,640 585,590 625,590"></polygon>

                    <!-- Main Body - fragmented, angular -->
                    <polygon fill="url(#mainBodyGradient_quantum)" points="500,280 460,400 540,400"></polygon>
                    <polygon fill="url(#mainBodyGradient_quantum)" points="460,400 540,400 420,550 580,550"></polygon>
                    <polygon fill="url(#mainBodyGradient_quantum)" points="420,550 580,550 500,650"></polygon>
                    <polygon fill="url(#mainBodyGradient_quantum)" points="460,400 420,550 500,475"></polygon>
                    <polygon fill="url(#mainBodyGradient_quantum)" points="540,400 580,550 500,475"></polygon>

                    <!-- Cockpit - sharp, single point -->
                    <polygon fill="url(#cockpitGradient_quantum)" points="500,300 490,380 510,380"></polygon>

                    <!-- Wings - multiple sharp angles -->
                    <polygon fill="url(#wingGradient_quantum)" points="460,400 300,500 420,550"></polygon>
                    <polygon fill="url(#wingGradient_quantum)" points="300,500 250,580 350,600"></polygon>
                    <polygon fill="url(#wingGradient_quantum)" points="540,400 700,500 580,550"></polygon>
                    <polygon fill="url(#wingGradient_quantum)" points="700,500 750,580 650,600"></polygon>

                    <!-- Rear Fins - small, almost part of the wing -->
                    <polygon fill="url(#accentGradient_quantum)" points="420,600 410,650 430,650"></polygon>
                    <polygon fill="url(#accentGradient_quantum)" points="580,600 570,650 590,650"></polygon>

                    <!-- Engine Exhausts - wide, glowing -->
                    <polygon fill="url(#exhaustGradient_quantum)" points="400,650 430,700 370,700"></polygon>
                    <polygon fill="url(#exhaustGradient_quantum)" points="600,650 630,700 570,700"></polygon>
                </g>
            </svg>
        `
    },
    {
        id: 'vaporglide',
        name: 'Vapor Glide',
        description: 'A heavily armored fighter with superior health, but sacrifices speed for durability.',
        startingWeapon: 'standard',
        initialHealth: 18,
        maxSpeedX: 4,
        maxSpeedY: 3,
        accelerationX: 0.35,
        decelerationX: 0.6,
        accelerationY: 0.25,
        decelerationY: 0.5,
        shotCooldownMs: 170,
        svg: `
            <svg viewBox="0 0 1000 1000">
                <defs>
                    <linearGradient id="mainBodyGradient_vaporglide" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" style="stop-color:#9370DB; stop-opacity:1" />
                        <stop offset="100%" style="stop-color:#BA55D3; stop-opacity:1" />
                    </linearGradient>
                    <linearGradient id="wingGradient_vaporglide" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" style="stop-color:#ADD8E6; stop-opacity:1" />
                        <stop offset="100%" style="stop-color:#87CEFA; stop-opacity:1" />
                    </linearGradient>
                    <linearGradient id="cockpitGradient_vaporglide" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" style="stop-color:#FFFFFF; stop-opacity:1" />
                        <stop offset="100%" style="stop-color:#F0F8FF; stop-opacity:1" />
                    </linearGradient>
                    <linearGradient id="exhaustGradient_vaporglide" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" style="stop-color:#FFB6C1; stop-opacity:1" />
                        <stop offset="100%" style="stop-color:#FF69B4; stop-opacity:1" />
                    </linearGradient>
                    <linearGradient id="accentGradient_vaporglide" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" style="stop-color:#FFFACD; stop-opacity:1" />
                        <stop offset="100%" style="stop-color:#F0E68C; stop-opacity:1" />
                    </linearGradient>
                    <linearGradient id="trailPinkGradient_vaporglide" x1="0%" y1="100%" x2="0%" y2="0%">
                        <stop offset="0%" style="stop-color:#FFB6C1; stop-opacity:0.8" />
                        <stop offset="100%" style="stop-color:#FFB6C1; stop-opacity:0" />
                    </linearGradient>
                    <linearGradient id="trailBlueGradient_vaporglide" x1="0%" y1="100%" x2="0%" y2="0%">
                        <stop offset="0%" style="stop-color:#ADD8E6; stop-opacity:0.8" />
                        <stop offset="100%" style="stop-color:#ADD8E6; stop-opacity:0" />
                    </linearGradient>
                </defs>

                <g transform="translate(500, 500) rotate(0) translate(-500, -500)">
                    <polygon fill="url(#trailPinkGradient_vaporglide)" points="400,600 380,550 420,550"></polygon>
                    <polygon fill="url(#trailPinkGradient_vaporglide)" points="405,620 385,570 425,570"></polygon>
                    <polygon fill="url(#trailBlueGradient_vaporglide)" points="600,600 580,550 620,550"></polygon>
                    <polygon fill="url(#trailBlueGradient_vaporglide)" points="595,620 575,570 615,570"></polygon>

                    <!-- Main Body - smooth, wide front, narrow rear -->
                    <polygon fill="url(#mainBodyGradient_vaporglide)" points="500,280 430,450 570,450"></polygon>
                    <polygon fill="url(#mainBodyGradient_vaporglide)" points="430,450 570,450 460,600 540,600"></polygon>
                    <polygon fill="url(#mainBodyGradient_vaporglide)" points="460,600 540,600 500,700"></polygon>
                    <polygon fill="url(#mainBodyGradient_vaporglide)" points="430,450 460,600 500,525"></polygon>
                    <polygon fill="url(#mainBodyGradient_vaporglide)" points="570,450 540,600 500,525"></polygon>

                    <!-- Cockpit - sleek, integrated -->
                    <polygon fill="url(#cockpitGradient_vaporglide)" points="500,310 490,400 510,400"></polygon>

                    <!-- Wings - very wide, delta-like -->
                    <polygon fill="url(#wingGradient_vaporglide)" points="430,450 200,550 460,600"></polygon>
                    <polygon fill="url(#wingGradient_vaporglide)" points="570,450 800,550 540,600"></polygon>

                    <!-- Rear Fins - very small, barely visible -->
                    <polygon fill="url(#accentGradient_vaporglide)" points="470,680 465,700 475,700"></polygon>
                    <polygon fill="url(#accentGradient_vaporglide)" points="530,680 525,700 535,700"></polygon>

                    <!-- Engine Exhausts - twin, central -->
                    <polygon fill="url(#exhaustGradient_vaporglide)" points="470,600 480,650 460,650"></polygon>
                    <polygon fill="url(#exhaustGradient_vaporglide)" points="530,600 540,650 520,650"></polygon>
                </g>
            </svg>
        `
    },
    {
        id: 'chromesentinel',
        name: 'Chrome Sentinel',
        description: 'A robust, defensive fighter with solid health and consistent firepower.',
        startingWeapon: 'standard',
        initialHealth: 15,
        maxSpeedX: 6,
        maxSpeedY: 4,
        accelerationX: 0.45,
        decelerationX: 0.75,
        accelerationY: 0.35,
        decelerationY: 0.65,
        shotCooldownMs: 160,
        svg: `
            <svg viewBox="0 0 1000 1000">
                <defs>
                    <linearGradient id="mainBodyGradient_chrome" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" style="stop-color:#C0C0C0; stop-opacity:1" />
                        <stop offset="100%" style="stop-color:#808080; stop-opacity:1" />
                    </linearGradient>
                    <linearGradient id="wingGradient_chrome" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" style="stop-color:#A9A9A9; stop-opacity:1" />
                        <stop offset="100%" style="stop-color:#696969; stop-opacity:1" />
                    </linearGradient>
                    <linearGradient id="cockpitGradient_chrome" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" style="stop-color:#00008B; stop-opacity:1" />
                        <stop offset="100%" style="stop-color:#4169E1; stop-opacity:1" />
                    </linearGradient>
                    <linearGradient id="exhaustGradient_chrome" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" style="stop-color:#FF0000; stop-opacity:1" />
                        <stop offset="100%" style="stop-color:#8B0000; stop-opacity:1" />
                    </linearGradient>
                    <linearGradient id="accentGradient_chrome" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" style="stop-color:#FFFF00; stop-opacity:1" />
                        <stop offset="100%" style="stop-color:#FFD700; stop-opacity:1" />
                    </linearGradient>
                    <linearGradient id="trailPinkGradient_chrome" x1="0%" y1="100%" x2="0%" y2="0%">
                        <stop offset="0%" style="stop-color:#FF0000; stop-opacity:0.8" />
                        <stop offset="100%" style="stop-color:#FF0000; stop-opacity:0" />
                    </linearGradient>
                    <linearGradient id="trailBlueGradient_chrome" x1="0%" y1="100%" x2="0%" y2="0%">
                        <stop offset="0%" style="stop-color:#00008B; stop-opacity:0.8" />
                        <stop offset="100%" style="stop-color:#00008B; stop-opacity:0" />
                    </linearGradient>
                </defs>

                <g transform="translate(500, 500) rotate(0) translate(-500, -500)">
                    <polygon fill="url(#trailPinkGradient_chrome)" points="400,600 380,550 420,550"></polygon>
                    <polygon fill="url(#trailPinkGradient_chrome)" points="405,620 385,570 425,570"></polygon>
                    <polygon fill="url(#trailBlueGradient_chrome)" points="600,600 580,550 620,550"></polygon>
                    <polygon fill="url(#trailBlueGradient_chrome)" points="595,620 575,570 615,570"></polygon>

                    <!-- Main Body - bulky, robust -->
                    <polygon fill="url(#mainBodyGradient_chrome)" points="500,300 440,460 560,460"></polygon>
                    <polygon fill="url(#mainBodyGradient_chrome)" points="440,460 560,460 400,620 600,620"></polygon>
                    <polygon fill="url(#mainBodyGradient_chrome)" points="400,620 600,620 500,720"></polygon>
                    <polygon fill="url(#mainBodyGradient_chrome)" points="440,460 400,620 500,540"></polygon>
                    <polygon fill="url(#mainBodyGradient_chrome)" points="560,460 600,620 500,540"></polygon>

                    <!-- Cockpit - wide, low-profile -->
                    <polygon fill="url(#cockpitGradient_chrome)" points="500,330 470,420 530,420"></polygon>

                    <!-- Wings - thick, swept-forward look -->
                    <polygon fill="url(#wingGradient_chrome)" points="440,460 300,500 400,620"></polygon>
                    <polygon fill="url(#wingGradient_chrome)" points="560,460 700,500 600,620"></polygon>

                    <!-- Rear Fins - prominent, blocky -->
                    <polygon fill="url(#accentGradient_chrome)" points="400,680 380,730 420,730"></polygon>
                    <polygon fill="url(#accentGradient_chrome)" points="600,680 580,730 620,730"></polygon>

                    <!-- Engine Exhausts - massive, twin -->
                    <polygon fill="url(#exhaustGradient_chrome)" points="400,620 440,680 360,680"></polygon>
                    <polygon fill="url(#exhaustGradient_chrome)" points="600,620 640,680 560,680"></polygon>
                </g>
            </svg>
        `
    },
    {
        id: 'aeroserpent',
        name: 'Aero Serpent',
        description: 'A very fast and nimble fighter, but with less health.',
        startingWeapon: 'standard',
        initialHealth: 14,
        maxSpeedX: 8.5,
        maxSpeedY: 6.5,
        accelerationX: 0.6,
        decelerationX: 0.9,
        accelerationY: 0.5,
        decelerationY: 0.8,
        shotCooldownMs: 140,
        svg: `
            <svg viewBox="0 0 1000 1000">
                <defs>
                    <linearGradient id="mainBodyGradient_aero" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" style="stop-color:#B22222; stop-opacity:1" />
                        <stop offset="100%" style="stop-color:#8B0000; stop-opacity:1" />
                    </linearGradient>
                    <linearGradient id="wingGradient_aero" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" style="stop-color:#0000CD; stop-opacity:1" />
                        <stop offset="100%" style="stop-color:#00008B; stop-opacity:1" />
                    </linearGradient>
                    <linearGradient id="cockpitGradient_aero" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" style="stop-color:#FF8C00; stop-opacity:1" />
                        <stop offset="100%" style="stop-color:#FF4500; stop-opacity:1" />
                    </linearGradient>
                    <linearGradient id="exhaustGradient_aero" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" style="stop-color:#FFD700; stop-opacity:1" />
                        <stop offset="100%" style="stop-color:#FFA500; stop-opacity:1" />
                    </linearGradient>
                    <linearGradient id="accentGradient_aero" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" style="stop-color:#6A5ACD; stop-opacity:1" />
                        <stop offset="100%" style="stop-color:#483D8B; stop-opacity:1" />
                    </linearGradient>
                    <linearGradient id="trailPinkGradient_aero" x1="0%" y1="100%" x2="0%" y2="0%">
                        <stop offset="0%" style="stop-color:#B22222; stop-opacity:0.8" />
                        <stop offset="100%" style="stop-color:#B22222; stop-opacity:0" />
                    </linearGradient>
                    <linearGradient id="trailBlueGradient_aero" x1="0%" y1="100%" x2="0%" y2="0%">
                        <stop offset="0%" style="stop-color:#0000CD; stop-opacity:0.8" />
                        <stop offset="100%" style="stop-color:#0000CD; stop-opacity:0" />
                    </linearGradient>
                </defs>

                <g transform="translate(500, 500) rotate(0) translate(-500, -500)">
                    <polygon fill="url(#trailPinkGradient_aero)" points="400,600 380,550 420,550"></polygon>
                    <polygon fill="url(#trailPinkGradient_aero)" points="405,620 385,570 425,570"></polygon>
                    <polygon fill="url(#trailBlueGradient_aero)" points="600,600 580,550 620,550"></polygon>
                    <polygon fill="url(#trailBlueGradient_aero)" points="595,620 575,570 615,570"></polygon>

                    <!-- Main Body - long, thin, snakelike -->
                    <polygon fill="url(#mainBodyGradient_aero)" points="500,250 480,400 520,400"></polygon>
                    <polygon fill="url(#mainBodyGradient_aero)" points="480,400 520,400 490,600 510,600"></polygon>
                    <polygon fill="url(#mainBodyGradient_aero)" points="490,600 510,600 500,750"></polygon>

                    <!-- Cockpit - very sharp, minimal -->
                    <polygon fill="url(#cockpitGradient_aero)" points="500,270 495,350 505,350"></polygon>

                    <!-- Wings - highly swept-forward, aggressive -->
                    <polygon fill="url(#wingGradient_aero)" points="480,400 200,450 490,600"></polygon>
                    <polygon fill="url(#wingGradient_aero)" points="520,400 800,450 510,600"></polygon>

                    <!-- Rear Fins - small, horizontal stabilizers -->
                    <polygon fill="url(#accentGradient_aero)" points="490,700 480,720 500,720"></polygon>
                    <polygon fill="url(#accentGradient_aero)" points="510,700 520,720 500,720"></polygon>

                    <!-- Engine Exhausts - single, central, powerful -->
                    <polygon fill="url(#exhaustGradient_aero)" points="500,700 490,750 510,750"></polygon>
                </g>
            </svg>
        `
    },
    {
        id: 'solardrifter',
        name: 'Solar Drifter',
        description: 'A powerful heavy hitter with good health, sacrificing some speed for offense. Starts with "triple" shot.',
        startingWeapon: 'triple',
        initialHealth: 13,
        maxSpeedX: 5.5,
        maxSpeedY: 3.5,
        accelerationX: 0.4,
        decelerationX: 0.7,
        accelerationY: 0.3,
        decelerationY: 0.6,
        shotCooldownMs: 120,
        svg: `
            <svg viewBox="0 0 1000 1000">
                <defs>
                    <linearGradient id="mainBodyGradient_solar" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" style="stop-color:#FFD700; stop-opacity:1" />
                        <stop offset="100%" style="stop-color:#FFA500; stop-opacity:1" />
                    </linearGradient>
                    <linearGradient id="wingGradient_solar" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" style="stop-color:#FF6347; stop-opacity:1" />
                        <stop offset="100%" style="stop-color:#FF4500; stop-opacity:1" />
                    </linearGradient>
                    <linearGradient id="cockpitGradient_solar" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" style="stop-color:#ADFF2F; stop-opacity:1" />
                        <stop offset="100%" style="stop-color:#7CFC00; stop-opacity:1" />
                    </linearGradient>
                    <linearGradient id="exhaustGradient_solar" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" style="stop-color:#FF00FF; stop-opacity:1" />
                        <stop offset="100%" style="stop-color:#800080; stop-opacity:1" />
                    </linearGradient>
                    <linearGradient id="accentGradient_solar" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" style="stop-color:#F0E68C; stop-opacity:1" />
                        <stop offset="100%" style="stop-color:#DAA520; stop-opacity:1" />
                    </linearGradient>
                    <linearGradient id="trailPinkGradient_solar" x1="0%" y1="100%" x2="0%" y2="0%">
                        <stop offset="0%" style="stop-color:#FFA500; stop-opacity:0.8" />
                        <stop offset="100%" style="stop-color:#FFA500; stop-opacity:0" />
                    </linearGradient>
                    <linearGradient id="trailBlueGradient_solar" x1="0%" y1="100%" x2="0%" y2="0%">
                        <stop offset="0%" style="stop-color:#FFD700; stop-opacity:0.8" />
                        <stop offset="100%" style="stop-color:#FFD700; stop-opacity:0" />
                    </linearGradient>
                </defs>

                <g transform="translate(500, 500) rotate(0) translate(-500, -500)">
                    <polygon fill="url(#trailPinkGradient_solar)" points="400,600 380,550 420,550"></polygon>
                    <polygon fill="url(#trailPinkGradient_solar)" points="405,620 385,570 425,570"></polygon>
                    <polygon fill="url(#trailBlueGradient_solar)" points="600,600 580,550 620,550"></polygon>
                    <polygon fill="url(#trailBlueGradient_solar)" points="595,620 575,570 615,570"></polygon>

                    <!-- Main Body - large, central delta shape -->
                    <polygon fill="url(#mainBodyGradient_solar)" points="500,280 250,700 750,700"></polygon>
                    <polygon fill="url(#mainBodyGradient_solar)" points="500,280 250,700 500,500"></polygon>
                    <polygon fill="url(#mainBodyGradient_solar)" points="500,280 750,700 500,500"></polygon>

                    <!-- Cockpit - small, at the tip -->
                    <polygon fill="url(#cockpitGradient_solar)" points="500,300 490,380 510,380"></polygon>

                    <!-- Wings - integrated into the main body, very subtle -->
                    <polygon fill="url(#wingGradient_solar)" points="250,700 300,650 400,680"></polygon>
                    <polygon fill="url(#wingGradient_solar)" points="750,700 700,650 600,680"></polygon>

                    <!-- Rear Fins - none, relies on shape -->

                    <!-- Engine Exhausts - wide, flat bar -->
                    <polygon fill="url(#exhaustGradient_solar)" points="400,680 600,680 550,730 450,730"></polygon>

                    <!-- Accents to define rear edge -->
                    <polygon fill="url(#accentGradient_solar)" points="400,680 450,730 500,700"></polygon>
                    <polygon fill="url(#accentGradient_solar)" points="600,680 550,730 500,700"></polygon>
                </g>
            </svg>
        `
    },
    {
        id: 'vanguardnova',
        name: 'Vanguard Nova',
        description: 'Unleashes a triple scatter shot, covering a wider area. Moderate speed and health.',
        startingWeapon: 'scatter',
        initialHealth: 13,
        maxSpeedX: 6.5,
        maxSpeedY: 4.5,
        accelerationX: 0.5,
        decelerationX: 0.8,
        accelerationY: 0.4,
        decelerationY: 0.7,
        shotCooldownMs: 180, // Slightly slower than standard for the spread effect
        svg: `
            <svg viewBox="0 0 1000 1000">
                <defs>
                    <linearGradient id="mainBodyGradient_nova" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" style="stop-color:#7B68EE; stop-opacity:1" />
                        <stop offset="100%" style="stop-color:#483D8B; stop-opacity:1" />
                    </linearGradient>
                    <linearGradient id="wingGradient_nova" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" style="stop-color:#DA70D6; stop-opacity:1" />
                        <stop offset="100%" style="stop-color:#9932CC; stop-opacity:1" />
                    </linearGradient>
                    <linearGradient id="cockpitGradient_nova" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" style="stop-color:#FFD700; stop-opacity:1" />
                        <stop offset="100%" style="stop-color:#FFA500; stop-opacity:1" />
                    </linearGradient>
                    <linearGradient id="exhaustGradient_nova" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" style="stop-color:#00FF00; stop-opacity:1" />
                        <stop offset="100%" style="stop-color:#008000; stop-opacity:1" />
                    </linearGradient>
                    <linearGradient id="accentGradient_nova" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" style="stop-color:#FFFFFF; stop-opacity:1" />
                        <stop offset="100%" style="stop-color:#E0E0E0; stop-opacity:1" />
                    </linearGradient>
                    <linearGradient id="trailPinkGradient_nova" x1="0%" y1="100%" x2="0%" y2="0%">
                        <stop offset="0%" style="stop-color:#DA70D6; stop-opacity:0.8" />
                        <stop offset="100%" style="stop-color:#DA70D6; stop-opacity:0" />
                    </linearGradient>
                    <linearGradient id="trailBlueGradient_nova" x1="0%" y1="100%" x2="0%" y2="0%">
                        <stop offset="0%" style="stop-color:#7B68EE; stop-opacity:0.8" />
                        <stop offset="100%" style="stop-color:#7B68EE; stop-opacity:0" />
                    </linearGradient>
                </defs>

                <g transform="translate(500, 500) rotate(0) translate(-500, -500)">
                    <polygon fill="url(#trailPinkGradient_nova)" points="400,600 380,550 420,550"></polygon>
                    <polygon fill="url(#trailPinkGradient_nova)" points="405,620 385,570 425,570"></polygon>
                    <polygon fill="url(#trailBlueGradient_nova)" points="600,600 580,550 620,550"></polygon>
                    <polygon fill="url(#trailBlueGradient_nova)" points="595,620 575,570 615,570"></polygon>
                    
                    <!-- Main Body - sleek, defined central mass -->
                    <polygon fill="url(#mainBodyGradient_nova)" points="500,280 450,450 550,450"></polygon>
                    <polygon fill="url(#mainBodyGradient_nova)" points="450,450 550,450 400,600 600,600"></polygon>
                    <polygon fill="url(#mainBodyGradient_nova)" points="450,450 400,600 500,520"></polygon>
                    <polygon fill="url(#mainBodyGradient_nova)" points="550,450 600,600 500,520"></polygon>

                    <!-- Cockpit - prominent, clear canopy -->
                    <polygon fill="url(#cockpitGradient_nova)" points="500,310 480,420 520,420"></polygon>

                    <!-- Wings - sharp, swept-back, extending from main body -->
                    <polygon fill="url(#wingGradient_nova)" points="450,450 280,500 400,600"></polygon>
                    <polygon fill="url(#wingGradient_nova)" points="550,450 720,500 600,600"></polygon>

                    <!-- Accent lines/panels on wings -->
                    <polygon fill="url(#accentGradient_nova)" points="380,550 420,550 400,500"></polygon>
                    <polygon fill="url(#accentGradient_nova)" points="580,550 620,550 600,500"></polygon>

                    <!-- Engines/Exhaust - twin exhausts -->
                    <polygon fill="url(#exhaustGradient_nova)" points="400,600 420,650 380,650"></polygon>
                    <polygon fill="url(#exhaustGradient_nova)" points="600,600 620,650 580,650"></polygon>
                    
                    <polygon fill="url(#mainBodyGradient_nova)" points="400,600 600,600 500,700"></polygon>
                </g>
            </svg>
        `
    },
    {
        id: 'ghoststalker',
        name: 'Ghost Stalker',
        description: 'Fires heatballs. Poor health, average speed, slow fire rate.',
        startingWeapon: 'heatseeker',
        initialHealth: 13,
        maxSpeedX: 6,
        maxSpeedY: 4,
        accelerationX: 0.45,
        decelerationX: 0.75,
        accelerationY: 0.35,
        decelerationY: 0.65,
        shotCooldownMs: 350, // Heatseeker specific cooldown, slower to balance tracking
        svg: `
            <svg viewBox="0 0 1000 1000">
                <defs>
                    <linearGradient id="mainBodyGradient_stalker" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" style="stop-color:#36454F; stop-opacity:1" />
                        <stop offset="100%" style="stop-color:#2F4F4F; stop-opacity:1" />
                    </linearGradient>
                    <linearGradient id="wingGradient_stalker" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" style="stop-color:#708090; stop-opacity:1" />
                        <stop offset="100%" style="stop-color:#5F9EA0; stop-opacity:1" />
                    </linearGradient>
                    <linearGradient id="cockpitGradient_stalker" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" style="stop-color:#C0C0C0; stop-opacity:1" />
                        <stop offset="100%" style="stop-color:#A9A9A9; stop-opacity:1" />
                    </linearGradient>
                    <linearGradient id="exhaustGradient_stalker" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" style="stop-color:#FFD700; stop-opacity:1" />
                        <stop offset="100%" style="stop-color:#FF8C00; stop-opacity:1" />
                    </linearGradient>
                    <linearGradient id="accentGradient_stalker" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" style="stop-color:#696969; stop-opacity:1" />
                        <stop offset="100%" style="stop-color:#484848; stop-opacity:1" />
                    </linearGradient>
                    <linearGradient id="trailPinkGradient_stalker" x1="0%" y1="100%" x2="0%" y2="0%">
                        <stop offset="0%" style="stop-color:#FFD700; stop-opacity:0.8" />
                        <stop offset="100%" style="stop-color:#FFD700; stop-opacity:0" />
                    </linearGradient>
                    <linearGradient id="trailBlueGradient_stalker" x1="0%" y1="100%" x2="0%" y2="0%">
                        <stop offset="0%" style="stop-color:#708090; stop-opacity:0.8" />
                        <stop offset="100%" style="stop-color:#708090; stop-opacity:0" />
                    </linearGradient>
                </defs>

                <g transform="translate(500, 500) rotate(0) translate(-500, -500)">
                    <polygon fill="url(#trailPinkGradient_stalker)" points="400,600 380,550 420,550"></polygon>
                    <polygon fill="url(#trailPinkGradient_stalker)" points="405,620 385,570 425,570"></polygon>
                    <polygon fill="url(#trailBlueGradient_stalker)" points="600,600 580,550 620,550"></polygon>
                    <polygon fill="url(#trailBlueGradient_stalker)" points="595,620 575,570 615,570"></polygon>
                    
                    <!-- Main Body - stealthy, angular, dark tones -->
                    <polygon fill="url(#mainBodyGradient_stalker)" points="500,280 420,480 580,480"></polygon>
                    <polygon fill="url(#mainBodyGradient_stalker)" points="420,480 580,480 380,650 620,650"></polygon>
                    <polygon fill="url(#mainBodyGradient_stalker)" points="420,480 380,650 500,560"></polygon>
                    <polygon fill="url(#mainBodyGradient_stalker)" points="580,480 620,650 500,560"></polygon>

                    <!-- Cockpit - sleek, almost hidden -->
                    <polygon fill="url(#cockpitGradient_stalker)" points="500,310 485,420 515,420"></polygon>

                    <!-- Wings - wide, swept-back for speed and maneuverability -->
                    <polygon fill="url(#wingGradient_stalker)" points="420,480 250,550 380,650"></polygon>
                    <polygon fill="url(#wingGradient_stalker)" points="580,480 750,550 620,650"></polygon>

                    <!-- Accent lines/panels -->
                    <polygon fill="url(#accentGradient_stalker)" points="390,600 410,600 400,550"></polygon>
                    <polygon fill="url(#accentGradient_stalker)" points="590,600 610,600 600,550"></polygon>

                    <!-- Engines/Exhaust - subtle, powerful -->
                    <polygon fill="url(#exhaustGradient_stalker)" points="380,650 420,700 340,700"></polygon>
                    <polygon fill="url(#exhaustGradient_stalker)" points="620,650 660,700 580,700"></polygon>
                    
                    <polygon fill="url(#mainBodyGradient_stalker)" points="380,650 620,650 500,750"></polygon>
                </g>
            </svg>
        `
    }
];