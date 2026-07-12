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
                    <linearGradient id="mainBodyGradient_interceptor" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stop-color="#8e2de2" /><stop offset="50%" stop-color="#5c0cd1" /><stop offset="100%" stop-color="#3200a3" />
                    </linearGradient>
                    <linearGradient id="wingGradient_interceptor" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stop-color="#FF00CC" /><stop offset="100%" stop-color="#111199" />
                    </linearGradient>
                    <linearGradient id="cockpitGradient_interceptor" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stop-color="#00FFFF" /><stop offset="100%" stop-color="#990099" />
                    </linearGradient>
                    <linearGradient id="exhaustGradient_interceptor" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stop-color="#FF9900" /><stop offset="100%" stop-color="#FF0000" />
                    </linearGradient>
                    <linearGradient id="accentGradient_interceptor" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stop-color="#7F00FF" /><stop offset="100%" stop-color="#E100FF" />
                    </linearGradient>
                    <linearGradient id="trailPinkGradient_interceptor" x1="0%" y1="100%" x2="0%" y2="0%">
                        <stop offset="0%" stop-color="#FF00CC" stop-opacity="0.8" /><stop offset="100%" stop-color="#FF00CC" stop-opacity="0" />
                    </linearGradient>
                    <linearGradient id="trailBlueGradient_interceptor" x1="0%" y1="100%" x2="0%" y2="0%">
                        <stop offset="0%" stop-color="#00FFFF" stop-opacity="0.8" /><stop offset="100%" stop-color="#00FFFF" stop-opacity="0" />
                    </linearGradient>
                    <filter id="neonGlow_interceptor">
                        <feGaussianBlur stdDeviation="8" result="coloredBlur"/>
                        <feMerge>
                            <feMergeNode in="coloredBlur"/>
                            <feMergeNode in="SourceGraphic"/>
                        </feMerge>
                    </filter>
                </defs>
                <g transform="translate(500, 500) rotate(0) translate(-500, -500)">
                    <!-- Pakokaasuvirrat -->
                    <polygon fill="url(#trailPinkGradient_interceptor)" points="400,600 380,520 420,520" filter="url(#neonGlow_interceptor)"></polygon>
                    <polygon fill="url(#trailPinkGradient_interceptor)" points="405,620 385,540 425,570" filter="url(#neonGlow_interceptor)"></polygon>
                    <polygon fill="url(#trailBlueGradient_interceptor)" points="600,600 580,520 620,520" filter="url(#neonGlow_interceptor)"></polygon>
                    <polygon fill="url(#trailBlueGradient_interceptor)" points="595,620 575,540 615,570" filter="url(#neonGlow_interceptor)"></polygon>

                    <!-- Monikerroksiset nuolisiivet (Left) -->
                    <polygon fill="url(#wingGradient_interceptor)" points="450,450 300,550 400,600"></polygon>
                    <polygon fill="url(#mainBodyGradient_interceptor)" points="400,600 300,550 350,650"></polygon>
                    <polygon fill="#ff00cc" points="330,550 290,560 320,580" filter="url(#neonGlow_interceptor)" opacity="0.8"></polygon>

                    <!-- Monikerroksiset nuolisiivet (Right) -->
                    <polygon fill="url(#wingGradient_interceptor)" points="550,450 700,550 600,600"></polygon>
                    <polygon fill="url(#mainBodyGradient_interceptor)" points="600,600 700,550 650,650"></polygon>
                    <polygon fill="#ff00cc" points="670,550 710,560 680,580" filter="url(#neonGlow_interceptor)" opacity="0.8"></polygon>

                    <!-- Särmikäs päärungon vasen puolisko -->
                    <polygon fill="url(#mainBodyGradient_interceptor)" points="500,300 450,450 500,525"></polygon>
                    <polygon fill="url(#mainBodyGradient_interceptor)" points="450,450 400,600 500,525"></polygon>
                    <!-- Särmikäs päärungon oikea puolisko (hieman varjostetumpi) -->
                    <polygon fill="url(#mainBodyGradient_interceptor)" points="500,300 550,450 500,525"></polygon>
                    <polygon fill="url(#mainBodyGradient_interceptor)" points="550,450 600,600 500,525"></polygon>

                    <!-- Kiiltävä laser-lasiohjaamo -->
                    <polygon fill="url(#cockpitGradient_interceptor)" points="500,330 480,420 520,420" filter="url(#neonGlow_interceptor)"></polygon>
                    <polygon fill="#ffffff" opacity="0.6" points="500,340 485,410 500,415"></polygon>

                    <polygon fill="url(#accentGradient_interceptor)" points="420,680 400,730 440,730"></polygon>
                    <polygon fill="url(#accentGradient_interceptor)" points="580,680 560,730 600,730"></polygon>
                    <polygon fill="url(#exhaustGradient_interceptor)" points="400,600 420,650 380,650"></polygon>
                    <polygon fill="url(#exhaustGradient_interceptor)" points="600,600 620,650 580,650"></polygon>
                    <polygon fill="url(#mainBodyGradient_interceptor)" points="400,600 600,600 500,700"></polygon>
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
                    <linearGradient id="mainBodyGradient_speedster" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stop-color="#e0ffff" /><stop offset="50%" stop-color="#00dfff" /><stop offset="100%" stop-color="#0066aa" />
                    </linearGradient>
                    <linearGradient id="wingGradient_speedster" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stop-color="#ffaa00" /><stop offset="100%" stop-color="#cc3300" />
                    </linearGradient>
                    <linearGradient id="cockpitGradient_speedster" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stop-color="#ccff00" /><stop offset="100%" stop-color="#99ff00" />
                    </linearGradient>
                    <linearGradient id="exhaustGradient_speedster" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stop-color="#ff00cc" /><stop offset="100%" stop-color="#880088" />
                    </linearGradient>
                    <filter id="neonGlow_speedster">
                        <feGaussianBlur stdDeviation="8" result="coloredBlur"/>
                        <feMerge>
                            <feMergeNode in="coloredBlur"/>
                            <feMergeNode in="SourceGraphic"/>
                        </feMerge>
                    </filter>
                </defs>
                <g transform="translate(500, 500) rotate(0) translate(-500, -500)">
                    <!-- Terävät nuolimaiset sivusiivet -->
                    <polygon fill="url(#wingGradient_speedster)" points="470,400 300,500 420,550"></polygon>
                    <polygon fill="url(#wingGradient_speedster)" points="530,400 700,500 580,550"></polygon>
                    <!-- Siipien neonlinjat -->
                    <polygon fill="#ffaa00" points="320,490 280,500 310,515" filter="url(#neonGlow_speedster)" opacity="0.8"></polygon>
                    <polygon fill="#ffaa00" points="680,490 720,500 690,515" filter="url(#neonGlow_speedster)" opacity="0.8"></polygon>

                    <!-- Särmikäs timantti-päärunko vasen/oikea -->
                    <polygon fill="url(#mainBodyGradient_speedster)" points="500,250 470,400 500,450"></polygon>
                    <polygon fill="url(#mainBodyGradient_speedster)" points="470,400 530,400 420,550 580,550"></polygon>
                    <polygon fill="url(#mainBodyGradient_speedster)" points="500,250 530,400 500,450"></polygon>

                    <!-- Kiiltävä vihreä sensori-ohjaamo -->
                    <polygon fill="url(#cockpitGradient_speedster)" points="500,280 490,350 510,350" filter="url(#neonGlow_speedster)"></polygon>
                    <polygon fill="#ffffff" opacity="0.6" points="500,290 493,340 500,345"></polygon>

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
                    <linearGradient id="mainBodyGradient_heavygunner" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stop-color="#ff3333" /><stop offset="50%" stop-color="#cc0000" /><stop offset="100%" stop-color="#660000" />
                    </linearGradient>
                    <linearGradient id="wingGradient_heavygunner" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stop-color="#55ff55" /><stop offset="100%" stop-color="#007700" />
                    </linearGradient>
                    <linearGradient id="cockpitGradient_heavygunner" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stop-color="#ffcc00" /><stop offset="100%" stop-color="#b88600" />
                    </linearGradient>
                    <linearGradient id="exhaustGradient_heavygunner" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stop-color="#3366ff" /><stop offset="100%" stop-color="#001188" />
                    </linearGradient>
                    <linearGradient id="accentGradient_heavygunner" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stop-color="#ff66cc" /><stop offset="100%" stop-color="#990055" />
                    </linearGradient>
                    <filter id="neonGlow_heavygunner">
                        <feGaussianBlur stdDeviation="8" result="coloredBlur"/>
                        <feMerge>
                            <feMergeNode in="coloredBlur"/>
                            <feMergeNode in="SourceGraphic"/>
                        </feMerge>
                    </filter>
                </defs>
                <g transform="translate(500, 500) rotate(0) translate(-500, -500)">
                    <!-- Massiiviset siipikilvet -->
                    <polygon fill="url(#wingGradient_heavygunner)" points="460,500 250,600 400,650"></polygon>
                    <polygon fill="url(#wingGradient_heavygunner)" points="540,500 750,600 600,650"></polygon>
                    <polygon fill="#55ff55" points="290,580 230,595 270,610" filter="url(#neonGlow_heavygunner)" opacity="0.8"></polygon>
                    <polygon fill="#55ff55" points="710,580 770,595 730,610" filter="url(#neonGlow_heavygunner)" opacity="0.8"></polygon>

                    <!-- Raskas kulmikas päärunko -->
                    <polygon fill="url(#mainBodyGradient_heavygunner)" points="500,350 460,500 500,540"></polygon>
                    <polygon fill="url(#mainBodyGradient_heavygunner)" points="500,350 540,500 500,540"></polygon>
                    <polygon fill="url(#mainBodyGradient_heavygunner)" points="460,500 540,500 400,650 600,650"></polygon>

                    <!-- Kiiltävä keltainen ohjaamo -->
                    <polygon fill="url(#cockpitGradient_heavygunner)" points="500,380 490,450 510,450" filter="url(#neonGlow_heavygunner)"></polygon>
                    <polygon fill="#ffffff" opacity="0.5" points="500,390 493,440 500,443"></polygon>

                    <!-- Heavy Gun -tykit sivuilla -->
                    <rect x="440" y="550" width="20" height="80" fill="url(#accentGradient_heavygunner)" rx="3"></rect>
                    <rect x="540" y="550" width="20" height="80" fill="url(#accentGradient_heavygunner)" rx="3"></rect>

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
                        <stop offset="0%" style="stop-color:#b30000; stop-opacity:1" />
                        <stop offset="50%" style="stop-color:#800000; stop-opacity:1" /><stop offset="100%" style="stop-color:#4a0000; stop-opacity:1" />
                    </linearGradient>
                    <linearGradient id="wingGradient_crimson" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" style="stop-color:#FF6600; stop-opacity:1" /><stop offset="100%" style="stop-color:#cc0044; stop-opacity:1" />
                    </linearGradient>
                    <linearGradient id="cockpitGradient_crimson" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" style="stop-color:#FFCC00; stop-opacity:1" /><stop offset="100%" style="stop-color:#ff4400; stop-opacity:1" />
                    </linearGradient>
                    <linearGradient id="exhaustGradient_crimson" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" style="stop-color:#FF0000; stop-opacity:1" /><stop offset="100%" style="stop-color:#800000; stop-opacity:1" />
                    </linearGradient>
                    <linearGradient id="accentGradient_crimson" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" style="stop-color:#660066; stop-opacity:1" /><stop offset="100%" style="stop-color:#CC00CC; stop-opacity:1" />
                    </linearGradient>
                    <linearGradient id="trailPinkGradient_crimson" x1="0%" y1="100%" x2="0%" y2="0%">
                        <stop offset="0%" style="stop-color:#FF3366; stop-opacity:0.8" /><stop offset="100%" style="stop-color:#FF3366; stop-opacity:0" />
                    </linearGradient>
                    <linearGradient id="trailBlueGradient_crimson" x1="0%" y1="100%" x2="0%" y2="0%">
                        <stop offset="0%" style="stop-color:#FFCC00; stop-opacity:0.8" /><stop offset="100%" style="stop-color:#FFCC00; stop-opacity:0" />
                    </linearGradient>
                    <filter id="neonGlow_crimson">
                        <feGaussianBlur stdDeviation="8" result="coloredBlur"/>
                        <feMerge>
                            <feMergeNode in="coloredBlur"/>
                            <feMergeNode in="SourceGraphic"/>
                        </feMerge>
                    </filter>
                </defs>
                <g transform="translate(500, 500) rotate(0) translate(-500, -500)">
                    <polygon fill="url(#trailPinkGradient_crimson)" points="410,610 390,530 430,530" filter="url(#neonGlow_crimson)"></polygon>
                    <polygon fill="url(#trailBlueGradient_crimson)" points="590,610 570,530 610,530" filter="url(#neonGlow_crimson)"></polygon>

                    <!-- Orgaanisen terävät Crimson-siivet -->
                    <polygon fill="url(#wingGradient_crimson)" points="440,460 280,580 390,630"></polygon>
                    <polygon fill="url(#wingGradient_crimson)" points="390,630 280,580 340,680"></polygon>
                    <polygon fill="url(#wingGradient_crimson)" points="560,460 720,580 610,630"></polygon>
                    <polygon fill="url(#wingGradient_crimson)" points="610,630 720,580 660,680"></polygon>

                    <!-- Symmetrisesti halkaistu päärunko syvyyden luomiseksi -->
                    <polygon fill="url(#mainBodyGradient_crimson)" points="500,300 440,460 500,540"></polygon>
                    <polygon fill="url(#mainBodyGradient_crimson)" points="440,460 560,460 380,620 620,620"></polygon>
                    <polygon fill="url(#mainBodyGradient_crimson)" points="440,460 380,620 500,540"></polygon>
                    <polygon fill="url(#mainBodyGradient_crimson)" points="500,300 560,460 500,540"></polygon>
                    <polygon fill="url(#mainBodyGradient_crimson)" points="560,460 620,620 500,540"></polygon>

                    <!-- Liekehtivä ohjaamo -->
                    <polygon fill="url(#cockpitGradient_crimson)" points="500,340 475,430 525,430" filter="url(#neonGlow_crimson)"></polygon>
                    <polygon fill="#ffffff" opacity="0.6" points="500,350 482,420 500,425"></polygon>

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
                        <stop offset="0%" style="stop-color:#80ffff" /><stop offset="50%" style="stop-color:#00aeff" /><stop offset="100%" style="stop-color:#0044aa" />
                    </linearGradient>
                    <linearGradient id="wingGradient_stingray" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" style="stop-color:#FF33CC" /><stop offset="100%" style="stop-color:#4400cc" />
                    </linearGradient>
                    <linearGradient id="cockpitGradient_stingray" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" style="stop-color:#a6ff00" /><stop offset="100%" stop-color="#00aeff" />
                    </linearGradient>
                    <linearGradient id="exhaustGradient_stingray" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" style="stop-color:#FFFF00" /><stop offset="100%" style="stop-color:#FF00FF" />
                    </linearGradient>
                    <linearGradient id="accentGradient_stingray" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" style="stop-color:#00FF99" /><stop offset="100%" style="stop-color:#4dffa6" />
                    </linearGradient>
                    <linearGradient id="trailPinkGradient_stingray" x1="0%" y1="100%" x2="0%" y2="0%">
                        <stop offset="0%" style="stop-color:#FF33CC; stop-opacity:0.8" /><stop offset="100%" style="stop-color:#FF33CC; stop-opacity:0" />
                    </linearGradient>
                    <linearGradient id="trailBlueGradient_stingray" x1="0%" y1="100%" x2="0%" y2="0%">
                        <stop offset="0%" style="stop-color:#00FFFF; stop-opacity:0.8" /><stop offset="100%" style="stop-color:#00FFFF; stop-opacity:0" />
                    </linearGradient>
                    <filter id="neonGlow_stingray">
                        <feGaussianBlur stdDeviation="8" result="coloredBlur"/>
                        <feMerge>
                            <feMergeNode in="coloredBlur"/>
                            <feMergeNode in="SourceGraphic"/>
                        </feMerge>
                    </filter>
                </defs>
                <g transform="translate(500, 500) rotate(0) translate(-500, -500)">
                    <polygon fill="url(#trailPinkGradient_stingray)" points="400,600 380,510 420,510" filter="url(#neonGlow_stingray)"></polygon>
                    <polygon fill="url(#trailBlueGradient_stingray)" points="600,600 580,510 620,510" filter="url(#neonGlow_stingray)"></polygon>

                    <!-- Laajat rauskumaiset siipikaaret neonvalokoristeilla -->
                    <polygon fill="url(#wingGradient_stingray)" points="460,450 250,560 380,600"></polygon>
                    <polygon fill="url(#wingGradient_stingray)" points="380,600 250,560 330,680"></polygon>
                    <polygon fill="url(#wingGradient_stingray)" points="540,450 750,560 620,600"></polygon>
                    <polygon fill="url(#wingGradient_stingray)" points="620,600 750,560 670,680"></polygon>

                    <!-- Virtaviivainen rauskurunko -->
                    <polygon fill="url(#mainBodyGradient_stingray)" points="500,320 460,450 500,520"></polygon>
                    <polygon fill="url(#mainBodyGradient_stingray)" points="460,450 540,450 380,600 620,600"></polygon>
                    <polygon fill="url(#mainBodyGradient_stingray)" points="460,450 380,600 500,520"></polygon>
                    <polygon fill="url(#mainBodyGradient_stingray)" points="540,450 620,600 500,520"></polygon>
                    <polygon fill="url(#mainBodyGradient_stingray)" points="500,320 540,450 500,520"></polygon>

                    <!-- Bio-mekaaninen kyber-ohjaamo -->
                    <polygon fill="url(#cockpitGradient_stingray)" points="500,340 485,430 515,430" filter="url(#neonGlow_stingray)"></polygon>
                    <polygon fill="#ffffff" opacity="0.6" points="500,350 489,420 500,423"></polygon>

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
                        <stop offset="0%" stop-color="#fff5cc" /><stop offset="40%" stop-color="#ffd700" /><stop offset="100%" stop-color="#b38600" />
                    </linearGradient>
                    <linearGradient id="wingGradient_starrunner" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stop-color="#00ffff" /><stop offset="100%" stop-color="#0044cc" />
                    </linearGradient>
                    <linearGradient id="cockpitGradient_starrunner" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stop-color="#a6ffb5" /><stop offset="100%" stop-color="#00cc44" />
                    </linearGradient>
                    <linearGradient id="exhaustGradient_starrunner" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stop-color="#FF4500" /><stop offset="100%" stop-color="#990000" />
                    </linearGradient>
                    <linearGradient id="accentGradient_starrunner" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stop-color="#FFD700" /><stop offset="100%" stop-color="#FFFFFF" />
                    </linearGradient>
                    <linearGradient id="trailPinkGradient_starrunner" x1="0%" y1="100%" x2="0%" y2="0%">
                        <stop offset="0%" stop-color="#FFD700" stop-opacity="0.8" /><stop offset="100%" stop-color="#FFD700" stop-opacity="0" />
                    </linearGradient>
                    <linearGradient id="trailBlueGradient_starrunner" x1="0%" y1="100%" x2="0%" y2="0%">
                        <stop offset="0%" stop-color="#00BFFF" stop-opacity="0.8" /><stop offset="100%" stop-color="#00BFFF" stop-opacity="0" />
                    </linearGradient>
                    <filter id="neonGlow_starrunner">
                        <feGaussianBlur stdDeviation="8" result="coloredBlur"/>
                        <feMerge>
                            <feMergeNode in="coloredBlur"/>
                            <feMergeNode in="SourceGraphic"/>
                        </feMerge>
                    </filter>
                </defs>
                <g transform="translate(500, 500) rotate(0) translate(-500, -500)">
                    <polygon fill="url(#trailPinkGradient_starrunner)" points="400,600 380,510 420,510" filter="url(#neonGlow_starrunner)"></polygon>
                    <polygon fill="url(#trailBlueGradient_starrunner)" points="600,600 580,510 620,510" filter="url(#neonGlow_starrunner)"></polygon>

                    <!-- Kirkkaan kultaiset ja siniset nuolisiivet -->
                    <polygon fill="url(#wingGradient_starrunner)" points="470,420 290,500 420,600"></polygon>
                    <polygon fill="url(#wingGradient_starrunner)" points="420,600 290,500 380,680"></polygon>
                    <polygon fill="url(#wingGradient_starrunner)" points="530,420 710,500 580,600"></polygon>
                    <polygon fill="url(#wingGradient_starrunner)" points="580,600 710,500 620,680"></polygon>

                    <!-- Symmetrisesti jaettu päärunko pronssisella kiillolla -->
                    <polygon fill="url(#mainBodyGradient_starrunner)" points="500,280 470,420 500,510"></polygon>
                    <polygon fill="url(#mainBodyGradient_starrunner)" points="470,420 530,420 420,600 580,600"></polygon>
                    <polygon fill="url(#mainBodyGradient_starrunner)" points="470,420 420,600 500,510"></polygon>
                    <polygon fill="url(#mainBodyGradient_starrunner)" points="530,420 580,600 500,510"></polygon>
                    <polygon fill="url(#mainBodyGradient_starrunner)" points="500,280 530,420 500,510"></polygon>

                    <!-- Hohtava vihreä sensori-ohjaamo -->
                    <polygon fill="url(#cockpitGradient_starrunner)" points="500,310 480,400 520,400" filter="url(#neonGlow_starrunner)"></polygon>
                    <ellipse fill="#ffffff" opacity="0.6" cx="493" cy="360" rx="10" ry="25"></ellipse>

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
        shotCooldownMs: 180,
        svg: `
            <svg viewBox="0 0 1000 1000">
                <defs>
                    <linearGradient id="mainBodyGradient_quantum" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stop-color="#ccff00" /><stop offset="50%" stop-color="#39ff14" /><stop offset="100%" stop-color="#006611" />
                    </linearGradient>
                    <linearGradient id="wingGradient_quantum" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stop-color="#ffcc00" /><stop offset="100%" stop-color="#ff00ff" />
                    </linearGradient>
                    <linearGradient id="cockpitGradient_quantum" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stop-color="#ffffff" /><stop offset="100%" stop-color="#a6ffa6" />
                    </linearGradient>
                    <linearGradient id="exhaustGradient_quantum" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stop-color="#FF00FF" /><stop offset="100%" stop-color="#660066" />
                    </linearGradient>
                    <linearGradient id="accentGradient_quantum" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stop-color="#009900" /><stop offset="100%" stop-color="#003300" />
                    </linearGradient>
                    <linearGradient id="trailPinkGradient_quantum" x1="0%" y1="100%" x2="0%" y2="0%">
                        <stop offset="0%" stop-color="#FF00FF" stop-opacity="0.8" /><stop offset="100%" stop-color="#FF00FF" stop-opacity="0" />
                    </linearGradient>
                    <linearGradient id="trailBlueGradient_quantum" x1="0%" y1="100%" x2="0%" y2="0%">
                        <stop offset="0%" stop-color="#00FF00" stop-opacity="0.8" /><stop offset="100%" stop-color="#00FF00" stop-opacity="0" />
                    </linearGradient>
                    <filter id="neonGlow_quantum">
                        <feGaussianBlur stdDeviation="8" result="coloredBlur"/>
                        <feMerge>
                            <feMergeNode in="coloredBlur"/>
                            <feMergeNode in="SourceGraphic"/>
                        </feMerge>
                    </filter>
                </defs>
                <g transform="translate(500, 500) rotate(0) translate(-500, -500)">
                    <polygon fill="url(#trailPinkGradient_quantum)" points="390,620 370,530 410,530" filter="url(#neonGlow_quantum)"></polygon>
                    <polygon fill="url(#trailBlueGradient_quantum)" points="610,620 590,530 630,530" filter="url(#neonGlow_quantum)"></polygon>

                    <!-- Kristallimaiset siivekkeet keltaisilla neon-piikeillä -->
                    <polygon fill="url(#wingGradient_quantum)" points="460,400 300,500 420,550"></polygon>
                    <polygon fill="url(#wingGradient_quantum)" points="300,500 250,580 350,600"></polygon>
                    <polygon fill="url(#wingGradient_quantum)" points="540,400 700,500 580,550"></polygon>
                    <polygon fill="url(#wingGradient_quantum)" points="700,500 750,580 650,600"></polygon>

                    <!-- Fragmentoitu ja särmikäs moniulotteinen runko -->
                    <polygon fill="url(#mainBodyGradient_quantum)" points="500,280 460,400 500,475"></polygon>
                    <polygon fill="url(#mainBodyGradient_quantum)" points="460,400 540,400 420,550 580,550"></polygon>
                    <polygon fill="url(#mainBodyGradient_quantum)" points="420,550 580,550 500,650"></polygon>
                    <polygon fill="url(#mainBodyGradient_quantum)" points="460,400 420,550 500,475"></polygon>
                    <polygon fill="url(#mainBodyGradient_quantum)" points="540,400 580,550 500,475"></polygon>
                    <polygon fill="url(#mainBodyGradient_quantum)" points="500,280 540,400 500,475"></polygon>

                    <!-- Särmikäs timantti-ohjaamo -->
                    <polygon fill="url(#cockpitGradient_quantum)" points="500,300 490,380 510,380" filter="url(#neonGlow_quantum)"></polygon>
                    <polygon fill="#ffffff" opacity="0.6" points="500,310 493,370 500,373"></polygon>

                    <polygon fill="url(#accentGradient_quantum)" points="420,600 410,650 430,650"></polygon>
                    <polygon fill="url(#accentGradient_quantum)" points="580,600 570,650 590,650"></polygon>
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
                        <stop offset="0%" stop-color="#cda8ff" /><stop offset="50%" stop-color="#9370DB" /><stop offset="100%" stop-color="#4b248c" />
                    </linearGradient>
                    <linearGradient id="wingGradient_vaporglide" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stop-color="#e0f7fc" /><stop offset="100%" stop-color="#87CEFA" />
                    </linearGradient>
                    <linearGradient id="cockpitGradient_vaporglide" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stop-color="#FFFFFF" /><stop offset="100%" stop-color="#ADD8E6" />
                    </linearGradient>
                    <linearGradient id="exhaustGradient_vaporglide" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stop-color="#FFB6C1" /><stop offset="100%" stop-color="#e63980" />
                    </linearGradient>
                    <linearGradient id="accentGradient_vaporglide" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stop-color="#FFFACD" /><stop offset="100%" stop-color="#DAA520" />
                    </linearGradient>
                    <linearGradient id="trailPinkGradient_vaporglide" x1="0%" y1="100%" x2="0%" y2="0%">
                        <stop offset="0%" stop-color="#FFB6C1" stop-opacity="0.8" /><stop offset="100%" stop-color="#FFB6C1" stop-opacity="0" />
                    </linearGradient>
                    <linearGradient id="trailBlueGradient_vaporglide" x1="0%" y1="100%" x2="0%" y2="0%">
                        <stop offset="0%" stop-color="#ADD8E6" stop-opacity="0.8" /><stop offset="100%" stop-color="#ADD8E6" stop-opacity="0" />
                    </linearGradient>
                    <filter id="neonGlow_vaporglide">
                        <feGaussianBlur stdDeviation="8" result="coloredBlur"/>
                        <feMerge>
                            <feMergeNode in="coloredBlur"/>
                            <feMergeNode in="SourceGraphic"/>
                        </feMerge>
                    </filter>
                </defs>
                <g transform="translate(500, 500) rotate(0) translate(-500, -500)">
                    <polygon fill="url(#trailPinkGradient_vaporglide)" points="400,600 380,510 420,510" filter="url(#neonGlow_vaporglide)"></polygon>
                    <polygon fill="url(#trailBlueGradient_vaporglide)" points="600,600 580,510 620,510" filter="url(#neonGlow_vaporglide)"></polygon>

                    <!-- Laajat elegantit siipipaneelit ja lisäkoristeet -->
                    <polygon fill="url(#wingGradient_vaporglide)" points="430,450 200,550 460,600"></polygon>
                    <polygon fill="url(#wingGradient_vaporglide)" points="570,450 800,550 540,600"></polygon>
                    <polygon fill="#fff" opacity="0.4" points="250,540 210,550 240,560" filter="url(#neonGlow_vaporglide)"></polygon>
                    <polygon fill="#fff" opacity="0.4" points="750,540 790,550 760,560" filter="url(#neonGlow_vaporglide)"></polygon>

                    <!-- Massiivinen mutta tyylikäs jaettu runko -->
                    <polygon fill="url(#mainBodyGradient_vaporglide)" points="500,280 430,450 500,525"></polygon>
                    <polygon fill="url(#mainBodyGradient_vaporglide)" points="430,450 570,450 460,600 540,600"></polygon>
                    <polygon fill="url(#mainBodyGradient_vaporglide)" points="460,600 540,600 500,700"></polygon>
                    <polygon fill="url(#mainBodyGradient_vaporglide)" points="430,450 460,600 500,525"></polygon>
                    <polygon fill="url(#mainBodyGradient_vaporglide)" points="570,450 540,600 500,525"></polygon>
                    <polygon fill="url(#mainBodyGradient_vaporglide)" points="500,280 570,450 500,525"></polygon>

                    <!-- Elegantisti integroitu vaalea lasiohjaamo -->
                    <polygon fill="url(#cockpitGradient_vaporglide)" points="500,310 490,400 510,400" filter="url(#neonGlow_vaporglide)"></polygon>
                    <ellipse fill="#ffffff" opacity="0.7" cx="500" cy="350" rx="6" ry="30"></ellipse>

                    <polygon fill="url(#accentGradient_vaporglide)" points="470,680 465,700 475,700"></polygon>
                    <polygon fill="url(#accentGradient_vaporglide)" points="530,680 525,700 535,700"></polygon>
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
                        <stop offset="0%" stop-color="#ffffff" /><stop offset="50%" stop-color="#94a3b8" /><stop offset="100%" stop-color="#334155" />
                    </linearGradient>
                    <linearGradient id="wingGradient_chrome" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stop-color="#cbd5e1" /><stop offset="100%" stop-color="#475569" />
                    </linearGradient>
                    <linearGradient id="cockpitGradient_chrome" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stop-color="#00dfff" /><stop offset="100%" stop-color="#0011bb" />
                    </linearGradient>
                    <linearGradient id="exhaustGradient_chrome" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stop-color="#FF0000" /><stop offset="100%" stop-color="#8B0000" />
                    </linearGradient>
                    <linearGradient id="accentGradient_chrome" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stop-color="#FFFF00" /><stop offset="100%" stop-color="#FFD700" />
                    </linearGradient>
                    <linearGradient id="trailPinkGradient_chrome" x1="0%" y1="100%" x2="0%" y2="0%">
                        <stop offset="0%" stop-color="#FF0000" stop-opacity="0.8" /><stop offset="100%" stop-color="#FF0000" stop-opacity="0" />
                    </linearGradient>
                    <linearGradient id="trailBlueGradient_chrome" x1="0%" y1="100%" x2="0%" y2="0%">
                        <stop offset="0%" stop-color="#00008B" stop-opacity="0.8" /><stop offset="100%" stop-color="#00008B" stop-opacity="0" />
                    </linearGradient>
                    <filter id="neonGlow_chrome">
                        <feGaussianBlur stdDeviation="8" result="coloredBlur"/>
                        <feMerge>
                            <feMergeNode in="coloredBlur"/>
                            <feMergeNode in="SourceGraphic"/>
                        </feMerge>
                    </filter>
                </defs>
                <g transform="translate(500, 500) rotate(0) translate(-500, -500)">
                    <polygon fill="url(#trailPinkGradient_chrome)" points="400,600 380,510 420,510" filter="url(#neonGlow_chrome)"></polygon>
                    <polygon fill="url(#trailBlueGradient_chrome)" points="600,600 580,510 620,510" filter="url(#neonGlow_chrome)"></polygon>

                    <!-- Paksut krominväriset siivekkeet lisäkoristeilla -->
                    <polygon fill="url(#wingGradient_chrome)" points="440,460 300,500 400,620"></polygon>
                    <polygon fill="url(#wingGradient_chrome)" points="560,460 700,500 600,620"></polygon>
                    <polygon fill="#00dfff" points="330,490 280,500 320,515" filter="url(#neonGlow_chrome)" opacity="0.8"></polygon>
                    <polygon fill="#00dfff" points="670,490 720,500 680,515" filter="url(#neonGlow_chrome)" opacity="0.8"></polygon>

                    <!-- Massiivinen, raskaasti panssaroitu kromirunko symmetrisesti halkaistuna -->
                    <polygon fill="url(#mainBodyGradient_chrome)" points="500,300 440,460 500,540"></polygon>
                    <polygon fill="url(#mainBodyGradient_chrome)" points="440,460 560,460 400,620 600,620"></polygon>
                    <polygon fill="url(#mainBodyGradient_chrome)" points="400,620 600,620 500,720"></polygon>
                    <polygon fill="url(#mainBodyGradient_chrome)" points="440,460 400,620 500,540"></polygon>
                    <polygon fill="url(#mainBodyGradient_chrome)" points="560,460 600,620 500,540"></polygon>
                    <polygon fill="url(#mainBodyGradient_chrome)" points="500,300 560,460 500,540"></polygon>

                    <!-- Matala ja pahaenteinen sininen kyber-ohjaamo -->
                    <polygon fill="url(#cockpitGradient_chrome)" points="500,330 470,420 530,420" filter="url(#neonGlow_chrome)"></polygon>
                    <polygon fill="#ffffff" opacity="0.6" points="500,340 480,410 500,415"></polygon>

                    <polygon fill="url(#accentGradient_chrome)" points="400,680 380,730 420,730"></polygon>
                    <polygon fill="url(#accentGradient_chrome)" points="600,680 580,730 620,730"></polygon>
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
                        <stop offset="0%" stop-color="#ff1a1a" /><stop offset="50%" stop-color="#800000" /><stop offset="100%" stop-color="#4a0000" />
                    </linearGradient>
                    <linearGradient id="wingGradient_aero" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stop-color="#0066ff" /><stop offset="100%" stop-color="#000066" />
                    </linearGradient>
                    <linearGradient id="cockpitGradient_aero" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stop-color="#ffaa00" /><stop offset="100%" stop-color="#ff4400" />
                    </linearGradient>
                    <linearGradient id="exhaustGradient_aero" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stop-color="#FFD700" /><stop offset="100%" stop-color="#FFA500" />
                    </linearGradient>
                    <linearGradient id="accentGradient_aero" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stop-color="#7a66ff" /><stop offset="100%" stop-color="#3d0099" />
                    </linearGradient>
                    <linearGradient id="trailPinkGradient_aero" x1="0%" y1="100%" x2="0%" y2="0%">
                        <stop offset="0%" stop-color="#B22222" stop-opacity="0.8" /><stop offset="100%" stop-color="#B22222" stop-opacity="0" />
                    </linearGradient>
                    <linearGradient id="trailBlueGradient_aero" x1="0%" y1="100%" x2="0%" y2="0%">
                        <stop offset="0%" stop-color="#0000CD" stop-opacity="0.8" /><stop offset="100%" stop-color="#0000CD" stop-opacity="0" />
                    </linearGradient>
                    <filter id="neonGlow_aero">
                        <feGaussianBlur stdDeviation="8" result="coloredBlur"/>
                        <feMerge>
                            <feMergeNode in="coloredBlur"/>
                            <feMergeNode in="SourceGraphic"/>
                        </feMerge>
                    </filter>
                </defs>
                <g transform="translate(500, 500) rotate(0) translate(-500, -500)">
                    <polygon fill="url(#trailPinkGradient_aero)" points="400,600 380,510 420,510" filter="url(#neonGlow_aero)"></polygon>
                    <polygon fill="url(#trailBlueGradient_aero)" points="600,600 580,510 620,510" filter="url(#neonGlow_aero)"></polygon>

                    <!-- Erittäin aggressiiviset pitkät nuolisiivet -->
                    <polygon fill="url(#wingGradient_aero)" points="480,400 200,450 490,600"></polygon>
                    <polygon fill="url(#wingGradient_aero)" points="520,400 800,450 510,600"></polygon>

                    <!-- Käärmemäisen kapea ja virtaviivainen päärunko symmetrisellä varjostuksella -->
                    <polygon fill="url(#mainBodyGradient_aero)" points="500,250 480,400 500,510"></polygon>
                    <polygon fill="url(#mainBodyGradient_aero)" points="480,400 520,400 490,600 510,600"></polygon>
                    <polygon fill="url(#mainBodyGradient_aero)" points="490,600 510,600 500,750"></polygon>
                    <polygon fill="url(#mainBodyGradient_aero)" points="500,250 520,400 500,510"></polygon>

                    <!-- Äärimmäisen terävä oranssi ohjaamo -->
                    <polygon fill="url(#cockpitGradient_aero)" points="500,270 495,350 505,350" filter="url(#neonGlow_aero)"></polygon>
                    <polygon fill="#ffffff" opacity="0.6" points="500,280 497,340 500,342"></polygon>

                    <polygon fill="url(#accentGradient_aero)" points="490,700 480,720 500,720"></polygon>
                    <polygon fill="url(#accentGradient_aero)" points="510,700 520,720 500,720"></polygon>
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
                        <stop offset="0%" stop-color="#fff5cc" /><stop offset="40%" stop-color="#ffd700" /><stop offset="100%" stop-color="#b38600" />
                    </linearGradient>
                    <linearGradient id="wingGradient_solar" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stop-color="#ff5e3b" /><stop offset="100%" stop-color="#991100" />
                    </linearGradient>
                    <linearGradient id="cockpitGradient_solar" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stop-color="#ADFF2F" /><stop offset="100%" stop-color="#559900" />
                    </linearGradient>
                    <linearGradient id="exhaustGradient_solar" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stop-color="#FF00FF" /><stop offset="100%" stop-color="#800080" />
                    </linearGradient>
                    <linearGradient id="accentGradient_solar" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stop-color="#F0E68C" /><stop offset="100%" stop-color="#DAA520" />
                    </linearGradient>
                    <linearGradient id="trailPinkGradient_solar" x1="0%" y1="100%" x2="0%" y2="0%">
                        <stop offset="0%" stop-color="#FFA500" stop-opacity="0.8" /><stop offset="100%" stop-color="#FFA500" stop-opacity="0" />
                    </linearGradient>
                    <linearGradient id="trailBlueGradient_solar" x1="0%" y1="100%" x2="0%" y2="0%">
                        <stop offset="0%" stop-color="#FFD700" stop-opacity="0.8" /><stop offset="100%" stop-color="#FFD700" stop-opacity="0" />
                    </linearGradient>
                    <filter id="neonGlow_solar">
                        <feGaussianBlur stdDeviation="8" result="coloredBlur"/>
                        <feMerge>
                            <feMergeNode in="coloredBlur"/>
                            <feMergeNode in="SourceGraphic"/>
                        </feMerge>
                    </filter>
                </defs>
                <g transform="translate(500, 500) rotate(0) translate(-500, -500)">
                    <polygon fill="url(#trailPinkGradient_solar)" points="400,600 380,510 420,510" filter="url(#neonGlow_solar)"></polygon>
                    <polygon fill="url(#trailBlueGradient_solar)" points="600,600 580,510 620,510" filter="url(#neonGlow_solar)"></polygon>

                    <!-- Integroidut symmetriset Solar-siipilaatat -->
                    <polygon fill="url(#mainBodyGradient_solar)" points="500,280 250,700 750,700"></polygon>
                    <polygon fill="url(#mainBodyGradient_solar)" points="500,280 250,700 500,500"></polygon>
                    <polygon fill="url(#mainBodyGradient_solar)" points="500,280 750,700 500,500"></polygon>

                    <!-- Pieni terävä keula-ohjaamo vihreällä hehkulla -->
                    <polygon fill="url(#cockpitGradient_solar)" points="500,300 490,380 510,380" filter="url(#neonGlow_solar)"></polygon>
                    <polygon fill="#ffffff" opacity="0.6" points="500,310 494,370 500,372"></polygon>

                    <polygon fill="url(#wingGradient_solar)" points="250,700 300,650 400,680"></polygon>
                    <polygon fill="url(#wingGradient_solar)" points="750,700 700,650 600,680"></polygon>
                    <polygon fill="url(#exhaustGradient_solar)" points="400,680 600,680 550,730 450,730"></polygon>
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
        shotCooldownMs: 180, 
        svg: `
            <svg viewBox="0 0 1000 1000">
                <defs>
                    <linearGradient id="mainBodyGradient_nova" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stop-color="#b5a6ff" /><stop offset="50%" stop-color="#7B68EE" /><stop offset="100%" stop-color="#2a1f80" />
                    </linearGradient>
                    <linearGradient id="wingGradient_nova" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stop-color="#DA70D6" /><stop offset="100%" stop-color="#5c118c" />
                    </linearGradient>
                    <linearGradient id="cockpitGradient_nova" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stop-color="#FFD700" /><stop offset="100%" stop-color="#b38600" />
                    </linearGradient>
                    <linearGradient id="exhaustGradient_nova" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stop-color="#00FF00" /><stop offset="100%" stop-color="#004d00" />
                    </linearGradient>
                    <linearGradient id="accentGradient_nova" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stop-color="#FFFFFF" /><stop offset="100%" stop-color="#a6a6a6" />
                    </linearGradient>
                    <linearGradient id="trailPinkGradient_nova" x1="0%" y1="100%" x2="0%" y2="0%">
                        <stop offset="0%" stop-color="#DA70D6" stop-opacity="0.8" /><stop offset="100%" stop-color="#DA70D6" stop-opacity="0" />
                    </linearGradient>
                    <linearGradient id="trailBlueGradient_nova" x1="0%" y1="100%" x2="0%" y2="0%">
                        <stop offset="0%" stop-color="#7B68EE" stop-opacity="0.8" /><stop offset="100%" stop-color="#7B68EE" stop-opacity="0" />
                    </linearGradient>
                    <filter id="neonGlow_nova">
                        <feGaussianBlur stdDeviation="8" result="coloredBlur"/>
                        <feMerge>
                            <feMergeNode in="coloredBlur"/>
                            <feMergeNode in="SourceGraphic"/>
                        </feMerge>
                    </filter>
                </defs>
                <g transform="translate(500, 500) rotate(0) translate(-500, -500)">
                    <polygon fill="url(#trailPinkGradient_nova)" points="400,600 380,510 420,510" filter="url(#neonGlow_nova)"></polygon>
                    <polygon fill="url(#trailBlueGradient_nova)" points="600,600 580,510 620,510" filter="url(#neonGlow_nova)"></polygon>
                    
                    <!-- Tyylikkäästi kulmikkaat fuksia-siivet paneeleilla -->
                    <polygon fill="url(#wingGradient_nova)" points="450,450 280,500 400,600"></polygon>
                    <polygon fill="url(#wingGradient_nova)" points="550,450 720,500 600,600"></polygon>
                    <polygon fill="url(#accentGradient_nova)" points="380,550 420,550 400,500" filter="url(#neonGlow_nova)"></polygon>
                    <polygon fill="url(#accentGradient_nova)" points="580,550 620,550 600,500" filter="url(#neonGlow_nova)"></polygon>

                    <!-- Jaettu runko mekaanisen syvyyden korostamiseksi -->
                    <polygon fill="url(#mainBodyGradient_nova)" points="500,280 450,450 500,520"></polygon>
                    <polygon fill="url(#mainBodyGradient_nova)" points="450,450 550,450 400,600 600,600"></polygon>
                    <polygon fill="url(#mainBodyGradient_nova)" points="450,450 400,600 500,520"></polygon>
                    <polygon fill="url(#mainBodyGradient_nova)" points="550,450 600,600 500,520"></polygon>
                    <polygon fill="url(#mainBodyGradient_nova)" points="500,280 550,450 500,520"></polygon>

                    <!-- Kirkas keltainen kyber-ohjaamo heijastuksella -->
                    <polygon fill="url(#cockpitGradient_nova)" points="500,310 480,420 520,420" filter="url(#neonGlow_nova)"></polygon>
                    <polygon fill="#ffffff" opacity="0.6" points="500,320 484,410 500,413"></polygon>

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
        shotCooldownMs: 350, 
        svg: `
            <svg viewBox="0 0 1000 1000">
                <defs>
                    <linearGradient id="mainBodyGradient_stalker" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stop-color="#4e5b66" /><stop offset="50%" stop-color="#2F4F4F" /><stop offset="100%" stop-color="#121d1d" />
                    </linearGradient>
                    <linearGradient id="wingGradient_stalker" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stop-color="#8fa3b3" /><stop offset="100%" stop-color="#3d5c5e" />
                    </linearGradient>
                    <linearGradient id="cockpitGradient_stalker" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stop-color="#ffffff" /><stop offset="100%" stop-color="#94a3b8" />
                    </linearGradient>
                    <linearGradient id="exhaustGradient_stalker" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stop-color="#FFD700" /><stop offset="100%" stop-color="#b36200" />
                    </linearGradient>
                    <linearGradient id="accentGradient_stalker" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stop-color="#696969" /><stop offset="100%" stop-color="#333333" />
                    </linearGradient>
                    <linearGradient id="trailPinkGradient_stalker" x1="0%" y1="100%" x2="0%" y2="0%">
                        <stop offset="0%" stop-color="#FFD700" stop-opacity="0.8" /><stop offset="100%" stop-color="#FFD700" stop-opacity="0" />
                    </linearGradient>
                    <linearGradient id="trailBlueGradient_stalker" x1="0%" y1="100%" x2="0%" y2="0%">
                        <stop offset="0%" stop-color="#708090" stop-opacity="0.8" /><stop offset="100%" stop-color="#708090" stop-opacity="0" />
                    </linearGradient>
                    <filter id="neonGlow_stalker">
                        <feGaussianBlur stdDeviation="8" result="coloredBlur"/>
                        <feMerge>
                            <feMergeNode in="coloredBlur"/>
                            <feMergeNode in="SourceGraphic"/>
                        </feMerge>
                    </filter>
                </defs>
                <g transform="translate(500, 500) rotate(0) translate(-500, -500)">
                    <polygon fill="url(#trailPinkGradient_stalker)" points="400,600 380,510 420,510" filter="url(#neonGlow_stalker)"></polygon>
                    <polygon fill="url(#trailBlueGradient_stalker)" points="600,600 580,510 620,510" filter="url(#neonGlow_stalker)"></polygon>
                    
                    <!-- Häiveteknologinen harmaa stealth-päärunko -->
                    <polygon fill="url(#mainBodyGradient_stalker)" points="500,280 420,480 500,560"></polygon>
                    <polygon fill="url(#mainBodyGradient_stalker)" points="420,480 580,480 380,650 620,650"></polygon>
                    <polygon fill="url(#mainBodyGradient_stalker)" points="420,480 380,650 500,560"></polygon>
                    <polygon fill="url(#mainBodyGradient_stalker)" points="580,480 620,650 500,560"></polygon>
                    <polygon fill="url(#mainBodyGradient_stalker)" points="500,280 580,480 500,560"></polygon>

                    <!-- Symmetriset ja kapeat sivusiivekkeet matalalla profiililla -->
                    <polygon fill="url(#wingGradient_stalker)" points="420,480 250,550 380,650"></polygon>
                    <polygon fill="url(#wingGradient_stalker)" points="580,480 750,550 620,650"></polygon>
                    <polygon fill="url(#accentGradient_stalker)" points="390,600 410,600 400,550" filter="url(#neonGlow_stalker)"></polygon>
                    <polygon fill="url(#accentGradient_stalker)" points="590,600 610,600 600,550" filter="url(#neonGlow_stalker)"></polygon>

                    <!-- Virtaviivaisen eleetön ja himmennetty kyber-cockpit -->
                    <polygon fill="url(#cockpitGradient_stalker)" points="500,310 485,420 515,420" filter="url(#neonGlow_stalker)"></polygon>
                    <polygon fill="#ffffff" opacity="0.5" points="500,320 491,410 500,412"></polygon>

                    <polygon fill="url(#exhaustGradient_stalker)" points="380,650 420,700 340,700"></polygon>
                    <polygon fill="url(#exhaustGradient_stalker)" points="620,650 660,700 580,700"></polygon>
                    <polygon fill="url(#mainBodyGradient_stalker)" points="380,650 620,650 500,750"></polygon>
                </g>
            </svg>
        `
    }
];