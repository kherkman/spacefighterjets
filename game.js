// game.js

// Make sure playerPlanes.js is loaded BEFORE this script in index.html

const gameContainer = document.getElementById('game-container');
const starsContainer = document.getElementById('stars-container');

// Overlays
const gameOverScreen = document.getElementById('game-over-screen');
const finalScoreDisplay = document.getElementById('final-score');
const restartButton = document.getElementById('restart-button');
const levelMessageOverlay = document.getElementById('level-message-overlay');
const levelMessageText = document.getElementById('level-message-text');
const gameFinishedScreen = document.getElementById('game-finished-screen');
const finalScoreFinishedDisplay = document.getElementById('final-score-finished');
const playAgainButton = document.getElementById('play-again-button');
const planeSelectionScreen = document.getElementById('plane-selection-screen');
const planeSelectionTitle = document.getElementById('plane-selection-title');
const playerTurnMessage = document.getElementById('player-turn-message');
const planeOptionsContainer = document.getElementById('plane-options');
const startGameButton = document.getElementById('start-game-button');

// Intro Screen Elements
const introScreen = document.getElementById('intro-screen');
const onePlayerButton = document.getElementById('one-player-button');
const twoPlayersButton = document.getElementById('two-players-button');
const touchOpacitySlider = document.getElementById('touch-opacity-slider');

// Touch Control Elements
const touchControlsContainer = document.getElementById('touch-controls-container');
const touchJoystickLeftBase = document.getElementById('touch-joystick-left-base');
const touchJoystickLeftHandle = document.getElementById('touch-joystick-left-handle');
const touchFireLeft = document.getElementById('touch-fire-left');
const touchJoystickRightBase = document.getElementById('touch-joystick-base right-side');
const touchJoystickRightHandle = document.getElementById('touch-joystick-right-handle');
const touchFireRight = document.getElementById('touch-fire-right');


let GAME_WIDTH = window.innerWidth;
let GAME_HEIGHT = window.innerHeight;

const PLAYER_PROJECTILE_SPEED_Y = 10; // Vertical speed for player projectiles
const PLAYER_PROJECTILE_SPEED_X_SCATTER = 3; // Horizontal deviation for scatter shot
const HEATSEEKER_PROJECTILE_SPEED = 5; // Speed for heatseeker projectiles
const MAX_HEATSEEKER_TURN_ANGLE_DEG = 10; // How quickly heatseeker can turn (degrees per frame)
const MAX_HEATSEEKER_TURN_ANGLE_RAD = MAX_HEATSEEKER_TURN_ANGLE_DEG * (Math.PI / 180);
const EPSILON = 1; // Small value to prevent angle from being exactly horizontal

const MUZZLE_OFFSET_Y = 25; // How many pixels down from the jet's nose the projectile starts


// Game State
let players = []; // Array to hold Player objects
let numPlayers = 1; // Default to 1 player

let selectedPlane1 = null;
let selectedPlane2 = null;
let currentPlayerSelecting = 'P1'; // 'P1' or 'P2'

let gameRunning = false;
let animationFrameId;
let lastFrameTime = 0;
const allProjectiles = []; // Combined array for all player projectiles

// Starfield Constants
const NUM_STARS = 100;
const STAR_SPEED = 1; // Pixels per frame
const STAR_MIN_SIZE = 1;
const STAR_MAX_SIZE = 3;
const stars = [];

// Orb Constants (Health, Shield, Weapon) - Generic dimensions for spawning
const ORB_WIDTH = 15;
const ORB_HEIGHT = 15;

// Health Orb Variables
const ORB_SPEED = 1.5;
const ORB_SPAWN_INTERVAL_MS = 7000; // Spawn new health orb every X ms
let lastOrbSpawnTime = 0;
const healthOrbs = [];

// Blue Orb (Shield) Variables
let blueOrbs = [];
const SHIELD_DURATION_MS = 8000; // 8 seconds
const BLUE_ORB_SPAWN_INTERVAL_MS = 10000; // Spawn new blue orb every X ms
let lastBlueOrbSpawnTime = 0;
const BLUE_ORB_WIDTH = 15;
const BLUE_ORB_HEIGHT = 15;
const BLUE_ORB_SPEED = 1.5;

// Weapon Orb Variables
let weaponOrbs = [];
const WEAPON_DURATION_MS = 10000; // 10 seconds
const WEAPON_ORB_SPAWN_INTERVAL_MS = 15000; // Less frequent weapon orb spawn
let lastWeaponOrbSpawnTime = 0;
const WEAPON_ORB_WIDTH = 15;
const WEAPON_ORB_HEIGHT = 15;
const WEAPON_ORB_SPEED = 1.5;
// Added 'scatter' and 'heatseeker'
const WEAPON_TYPES = ['standard', 'triple', 'laser', 'fast', 'piercing', 'burst', 'scatter', 'heatseeker']; // Available weapon types for pickups

// Level Management
let currentLevel = 0;
let bossActive = false; // Is a boss currently on the screen?
let levelTransitioning = false;
const LEVEL_TRANSITION_DELAY_MS = 1000; // Time to wait between levels

// Global object to interact with the currently loaded enemy module
window.currentLevelModule = null;

// Gamepad State
const gamepads = {}; // Stores connected gamepads by index
let gamepadPollInterval; // To manage polling for gamepads on menus

// Gamepad Navigation
let focusedButtonIndex = -1;
let currentNavigableElements = [];
let lastGamepadNavigationTime = 0;
const GAMEPAD_NAV_COOLDOWN = 150; // Milliseconds between gamepad nav inputs
const GAMEPAD_AXIS_THRESHOLD = 0.5; // Threshold for analog stick navigation

// Keyboard inputs (P1: WASD, Space; P2: Arrows, Right Shift)
const keysPressed = {};

// Touch Control state
const touchInput = {
    player1: {
        joystickActive: false,
        joystickStartX: 0, joystickStartY: 0,
        joystickCurrentX: 0, joystickCurrentY: 0,
        fireActive: false,
        touchId: null,
        swipeStartX: 0, swipeStartY: 0 // Added for swipe detection
    },
    player2: {
        joystickActive: false,
        joystickStartX: 0, joystickStartY: 0,
        joystickCurrentX: 0, joystickCurrentY: 0,
        fireActive: false,
        touchId: null,
        swipeStartX: 0, swipeStartY: 0 // Added for swipe detection
    }
};
const JOYSTICK_MAX_DISTANCE = 40; // Max distance handle can move from base center
const SWIPE_THRESHOLD = 50; // Minimum pixel distance for a swipe to register

// Player Class Definition
class Player {
    constructor(id, planeData, initialX, initialY, playerJetElement, scoreDisplayElement, healthBarContainerElement, healthBarElement, gamepadIndex = null) {
        this.id = id;
        this.planeData = planeData;

        this.x = initialX;
        this.y = initialY;
        this.lives = planeData.initialHealth; // Use plane-specific initial health
        this.maxLives = planeData.initialHealth; // Store max health for bar calculations
        this.score = 0;
        this.isShooting = false;
        this.lastShotTime = 0;

        this.currentSpeedX = 0;
        this.currentSpeedY = 0;
        this.currentTilt = 0;

        this.maxSpeedX;
        this.maxSpeedY;
        this.accelerationX;
        this.decelerationX;
        this.accelerationY;
        this.decelerationY;
        this.shotCooldownMs;

        this.weaponType; // 'standard', 'triple', 'laser', 'fast', 'piercing', 'burst', 'scatter', 'heatseeker'
        this.weaponActive = false;
        this.weaponEndTime = 0;

        this.shieldActive = false;
        this.shieldEndTime = 0;
        // ADDED: Shield hit points for multi-hit shield
        this.shieldHitPoints = 0;
        this.maxShieldHitPoints = 3; // The shield can take 3 hits

        this.playerJetElement = playerJetElement;
        this.playerJetSVGContainer = this.playerJetElement.querySelector('svg');
        this.healthBarContainerElement = healthBarContainerElement;
        this.healthBarElement = healthBarElement;
        this.scoreDisplayElement = scoreDisplayElement;
        this.gamepadIndex = gamepadIndex; // Associate player with a gamepad

        this.shieldElement = null; // Will be created when shield is active
        this.weaponIndicatorElement = null; // Will be created when weapon is active

        this.applyPlaneProperties();
        this.updatePlayerElementPosition();
        this.updateHealthBarDisplay();
        this.updateScoreDisplay();
    }

    applyPlaneProperties() {
        this.maxSpeedX = this.planeData.maxSpeedX;
        this.maxSpeedY = this.planeData.maxSpeedY;
        this.accelerationX = this.planeData.accelerationX;
        this.decelerationX = this.planeData.decelerationX;
        this.accelerationY = this.planeData.accelerationY;
        this.decelerationY = this.planeData.decelerationY;
        this.shotCooldownMs = this.planeData.shotCooldownMs;
        this.weaponType = this.planeData.startingWeapon;
        this.playerJetSVGContainer.innerHTML = this.planeData.svg;
    }

    updatePlayerElementPosition() {
        this.playerJetElement.style.left = `${this.x - this.playerJetElement.offsetWidth / 2}px`;
        this.playerJetElement.style.top = `${this.y - this.playerJetElement.offsetHeight / 2}px`;

        this.playerJetElement.classList.remove('tilt-left', 'tilt-right', 'no-tilt');
        if (this.currentSpeedX < -0.1) {
            this.playerJetElement.classList.add('tilt-left');
        } else if (this.currentSpeedX > 0.1) {
            this.playerJetElement.classList.add('tilt-right');
        } else {
            this.playerJetElement.classList.add('no-tilt');
        }
    }

    updateHealthBarDisplay() {
        const healthPercentage = (this.lives / this.maxLives) * 100; // Use maxLives
        this.healthBarElement.style.width = `${healthPercentage}%`;

        if (healthPercentage > 60) {
            this.healthBarElement.style.background = 'linear-gradient(to right, #00ff00, #00cc00)';
        } else if (healthPercentage > 30) {
            this.healthBarElement.style.background = 'linear-gradient(to right, #ffff00, #cc9900)';
        } else {
            this.healthBarElement.style.background = 'linear-gradient(to right, #ff0000, #cc0000)';
        }
    }

    updateScoreDisplay() {
        this.scoreDisplayElement.textContent = `SCORE: ${this.score}`;
    }

    loseLife() {
        if (levelTransitioning) return;

        if (this.shieldActive) {
            this.shieldHitPoints--; // Decrement shield hit points
            if (this.shieldHitPoints <= 0) {
                this.deactivateShield();
                createOrbCollectedAnimation(this.x, this.y, 'shield'); // This animation is for orb collection, but kept as per existing behavior when shield is destroyed
            }
            return; // Player does not lose a life if shield absorbed the hit
        }

        this.lives--;
        this.updateHealthBarDisplay();
        this.playerJetElement.classList.add('damaged-flash');
        setTimeout(() => {
            this.playerJetElement.classList.remove('damaged-flash');
        }, 500);

        // Check overall game over conditions
        let allPlayersDefeated = true;
        for (const p of players) {
            if (p.lives > 0) {
                allPlayersDefeated = false;
                break;
            }
        }
        if (allPlayersDefeated) {
            gameOver();
        } else if (this.lives <= 0) {
            // Trigger player destroyed animation
            createPlayerDestroyedAnimation(this.x, this.y);

            this.playerJetElement.style.display = 'none'; // Hide defeated player
            this.scoreDisplayElement.style.display = 'none'; // Hide score
            this.healthBarContainerElement.style.display = 'none'; // Hide health bar
            // Prevent shooting for defeated player
            this.isShooting = false;
            // Reset joystick/fire states if this player was using touch
            if (this.id === 'player1') {
                touchInput.player1.joystickActive = false;
                touchInput.player1.fireActive = false;
            } else if (this.id === 'player2') {
                touchInput.player2.joystickActive = false;
                touchInput.player2.fireActive = false;
            }
        }
    }

    activateShield(orbX, orbY) {
        if (!this.shieldElement) {
            this.shieldElement = document.createElement('div');
            this.shieldElement.classList.add('player-shield');
            this.playerJetElement.appendChild(this.shieldElement);
        }
        this.shieldActive = true;
        this.shieldEndTime = performance.now() + SHIELD_DURATION_MS;
        this.shieldHitPoints = this.maxShieldHitPoints; // Reset shield health to full
        createOrbCollectedAnimation(orbX, orbY, 'shield');
        this.updatePlayerShieldVisual();
    }

    deactivateShield() {
        this.shieldActive = false;
        this.shieldHitPoints = 0; // Ensure hit points are reset when shield deactivates
        if (this.shieldElement) {
            this.shieldElement.remove();
            this.shieldElement = null;
        }
    }

    updatePlayerShieldVisual() {
        if (this.shieldElement) {
            this.shieldElement.style.left = `${this.playerJetElement.offsetWidth / 2}px`;
            this.shieldElement.style.top = `${this.playerJetElement.offsetHeight / 2}px`;
        }
    }

    activateWeaponUpgrade(selectedWeapon, orbX, orbY) {
        this.weaponType = selectedWeapon;
        this.weaponActive = true;
        this.weaponEndTime = performance.now() + WEAPON_DURATION_MS;
        createOrbCollectedAnimation(orbX, orbY, 'weapon');

        if (!this.weaponIndicatorElement) {
            this.weaponIndicatorElement = document.createElement('div');
            this.weaponIndicatorElement.classList.add('weapon-indicator');
            this.playerJetElement.appendChild(this.weaponIndicatorElement);
        }
        // Updated styling for new weapon types
        this.weaponIndicatorElement.style.background =
            (this.weaponType === 'triple') ? 'linear-gradient(to right, #ff00ff, #aa00aa)' :
            (this.weaponType === 'laser') ? 'linear-gradient(to right, #00ffff, #00aaaa)' :
            (this.weaponType === 'fast') ? 'linear-gradient(to right, #00ff00, #00aa00)' :
            (this.weaponType === 'piercing') ? 'linear-gradient(to right, #FF00FF, #CC00CC)' :
            (this.weaponType === 'burst') ? 'linear-gradient(to right, #FFFF00, #FFCC00)' :
            (this.weaponType === 'scatter') ? 'linear-gradient(to right, #FF00FF, #CC00FF)' : // New color for scatter
            (this.weaponType === 'heatseeker') ? 'linear-gradient(to right, #FFA500, #FFD700)' : // New color for heatseeker
            'gold'; // Default for 'standard'
    }

    deactivateWeaponUpgrade() {
        this.weaponType = this.planeData.startingWeapon;
        this.weaponActive = false;
        if (this.weaponIndicatorElement) {
            this.weaponIndicatorElement.remove();
            this.weaponIndicatorElement = null;
        }
    }
}

// --- Game Initialization and Reset ---
function resetGame() {
    GAME_WIDTH = window.innerWidth;
    GAME_HEIGHT = window.innerHeight;

    // Clear all existing game elements
    gameContainer.querySelectorAll('.projectile, .enemy-projectile, .enemy-jet-wrapper, .star, .explosion-particle, .health-orb, .blue-orb, .weapon-orb, .orb-destroyed-particle, .orb-collected-animation, .blue-orb-collected-animation, .weapon-orb-collected-animation, .player-shield, .weapon-indicator, .player-destroyed-particle').forEach(el => el.remove());
    allProjectiles.length = 0;
    stars.length = 0; // Clear star array

    // Reset orb arrays
    healthOrbs.length = 0;
    lastOrbSpawnTime = 0;
    blueOrbs.length = 0;
    lastBlueOrbSpawnTime = 0;
    weaponOrbs.length = 0;
    lastWeaponOrbSpawnTime = 0;

    players.length = 0; // Clear existing players

    // Create players based on numPlayers
    // Player 1
    const p1PlaneData = selectedPlane1 || planesData.find(p => p.id === 'interceptor'); // Fallback
    const player1 = new Player(
        'player1',
        p1PlaneData,
        (numPlayers === 1 ? GAME_WIDTH / 2 : GAME_WIDTH / 3), // P1 position
        GAME_HEIGHT - 80, // Offset from bottom
        document.getElementById('player-jet-wrapper1'),
        document.getElementById('score-display1'),
        document.getElementById('health-bar-container1'),
        document.getElementById('health-bar1'),
        0 // Gamepad index 0
    );
    players.push(player1);
    player1.playerJetElement.style.display = 'flex'; // Ensure P1 jet is visible
    player1.scoreDisplayElement.style.display = 'block';
    player1.healthBarContainerElement.style.display = 'block';

    // Player 2 (if enabled)
    if (numPlayers === 2) {
        const p2PlaneData = selectedPlane2 || planesData.find(p => p.id === 'interceptor'); // Fallback
        const player2 = new Player(
            'player2',
            p2PlaneData,
            (2 * GAME_WIDTH / 3), // P2 position
            GAME_HEIGHT - 80, // Offset from bottom
            document.getElementById('player-jet-wrapper2'),
            document.getElementById('score-display2'),
            document.getElementById('health-bar-container2'),
            document.getElementById('health-bar2'),
            1 // Gamepad index 1
        );
        players.push(player2);
        player2.playerJetElement.style.display = 'flex'; // Ensure P2 jet is visible
        player2.scoreDisplayElement.style.display = 'block';
        player2.healthBarContainerElement.style.display = 'block';
    } else {
        document.getElementById('player-jet-wrapper2').style.display = 'none';
        document.getElementById('score-display2').style.display = 'none';
        document.getElementById('health-bar-container2').style.display = 'none';
    }


    // Reset current level module if one was loaded
    if (window.currentLevelModule && typeof window.currentLevelModule.reset === 'function') {
        window.currentLevelModule.reset();
    }

    createStars(); // Recreate stars for new game
    gameOverScreen.classList.remove('visible');
    gameFinishedScreen.classList.remove('visible');
    levelMessageOverlay.classList.remove('visible');

    currentLevel = 0; // Will be set to 1 by startLevel
    startLevel(1); // Start the first level
}

function startLevel(levelNumber) {
    levelTransitioning = true;
    gameRunning = false;
    cancelAnimationFrame(animationFrameId); // Stop game loop during transition
    //clearInterval(gamepadPollInterval); // Stop gamepad polling for menus, now handled by context

    currentLevel = levelNumber;

    // Clear previous enemies, projectiles, and ALL orbs from the DOM and arrays
    gameContainer.querySelectorAll('.enemy-projectile, .enemy-jet-wrapper, .health-orb, .blue-orb, .weapon-orb').forEach(el => el.remove());
    healthOrbs.length = 0;
    blueOrbs.length = 0;
    weaponOrbs.length = 0;


    // Display level message
    let message = '';
    let scriptToLoad = '';
    switch (currentLevel) {
        case 1:
            message = 'LEVEL 1: SHADOW REAPERS';
            scriptToLoad = 'enemies1.js';
            break;
        case 2:
            message = 'LEVEL 2: NECROTIC DRONES';
            scriptToLoad = 'enemies2.js';
            break;
        case 3:
            message = 'LEVEL 3: VIPER CLAWS';
            scriptToLoad = 'enemies3.js';
            break;
        case 4:
            message = 'LEVEL 4: VOID HUNTERS';
            scriptToLoad = 'enemies4.js';
            break;
        case 5:
            message = 'FINAL BOSS: OBLIVION MAW';
            scriptToLoad = 'final.js';
            break;
        default:
            message = 'UNKNOWN LEVEL';
            return;
    }

    levelMessageText.textContent = message;
    levelMessageOverlay.classList.add('visible');

    // Load the new level's enemy script
    loadLevelScript(scriptToLoad, () => {
        if (window.currentLevelModule && typeof window.currentLevelModule.reset === 'function') {
            window.currentLevelModule.reset();
        }

        if (window.currentLevelModule && typeof window.currentLevelModule.initLevel === 'function') {
            window.currentLevelModule.initLevel(gameContainer, GAME_WIDTH, GAME_HEIGHT);
            bossActive = window.currentLevelModule.isBossLevel();
        } else {
            console.error(`Failed to initialize level ${currentLevel}. Check if initLevel function exists in ${scriptToLoad}`);
            gameOver();
            return;
        }

        setTimeout(() => {
            levelMessageOverlay.classList.remove('visible');
            levelTransitioning = false;
            gameRunning = true;
            lastFrameTime = performance.now();
            startGameLoop();
            // gamepadPollInterval = setInterval(pollGamepads, 1000 / 60); // Resume gamepad polling for in-game
        }, LEVEL_TRANSITION_DELAY_MS);
    });
}

function loadLevelScript(scriptName, callback) {
    const existingScript = document.querySelector(`script[src^="enemies"], script[src="final.js"]`);
    if (existingScript) {
        existingScript.remove();
    }
    window.currentLevelModule = null;

    const script = document.createElement('script');
    script.src = scriptName;
    script.onload = callback;
    script.onerror = () => {
        console.error(`Error loading script: ${scriptName}`);
        gameOver();
    };
    document.head.appendChild(script);
}

function gameOver() {
    gameRunning = false;
    cancelAnimationFrame(animationFrameId);
    //clearInterval(gamepadPollInterval); // Stop gamepad polling for in-game
    // Sum up scores for all players if multiplayer
    let totalScore = 0;
    players.forEach(p => totalScore += p.score);
    finalScoreDisplay.textContent = `Final Score: ${totalScore}`;
    gameOverScreen.classList.add('visible');
    showTouchControls(false); // Hide touch controls on game over
    setupGamepadNavigation([restartButton], 0); // Setup gamepad nav for game over screen
}

function gameFinished() {
    gameRunning = false;
    cancelAnimationFrame(animationFrameId);
    //clearInterval(gamepadPollInterval); // Stop gamepad polling for in-game
    // Sum up scores for all players
    let totalScore = 0;
    players.forEach(p => totalScore += p.score);
    finalScoreFinishedDisplay.textContent = `Final Score: ${totalScore}`;
    gameFinishedScreen.classList.add('visible');
    showTouchControls(false); // Hide touch controls
    setupGamepadNavigation([playAgainButton], 0); // Setup gamepad nav for game finished screen
}

// Restart/Play Again buttons now go back to intro screen
restartButton.addEventListener('click', () => {
    gameOverScreen.classList.remove('visible');
    showIntroScreen();
});
playAgainButton.addEventListener('click', () => {
    gameFinishedScreen.classList.remove('visible');
    showIntroScreen();
});

// Handle window resizing
window.addEventListener('resize', () => {
    GAME_WIDTH = window.innerWidth;
    GAME_HEIGHT = window.innerHeight;
    players.forEach(player => {
        if (player.playerJetElement.style.display !== 'none') { // Only update if player is visible
            player.x = Math.max(player.playerJetElement.offsetWidth / 2, Math.min(GAME_WIDTH - player.playerJetElement.offsetWidth / 2, player.x));
            player.y = Math.max(player.playerJetElement.offsetHeight / 2, Math.min(GAME_HEIGHT - player.playerJetElement.offsetHeight / 2, player.y));
            player.updatePlayerElementPosition();
            player.updatePlayerShieldVisual(); // Update shield position on resize
        }
    });


    if (window.currentLevelModule && typeof window.currentLevelModule.onResize === 'function') {
        window.currentLevelModule.onResize(GAME_WIDTH, GAME_HEIGHT);
    }
});


// --- Player Movement (Keyboard, Gamepad, Touch) ---
document.addEventListener('keydown', (e) => {
    keysPressed[e.code] = true;
    const now = performance.now();

    // Handle menu navigation
    if (!gameRunning && now - lastGamepadNavigationTime > GAMEPAD_NAV_COOLDOWN) {
        let handledNav = false;
        // Intro Screen Navigation
        if (introScreen.style.display === 'flex') {
            if (['KeyA', 'ArrowLeft'].includes(e.code)) {
                navigateButtons(-1);
                handledNav = true;
            } else if (['KeyD', 'ArrowRight'].includes(e.code)) {
                navigateButtons(1);
                handledNav = true;
            }
            if (['Space', 'ShiftRight', 'Enter'].includes(e.code)) {
                selectCurrentButton();
                handledNav = true;
            }
        }
        // Plane Selection Screen Navigation
        else if (planeSelectionScreen.classList.contains('visible')) {
            if (['KeyA', 'ArrowLeft'].includes(e.code)) {
                navigateButtons(-1); // Move focus left on plane cards
                handledNav = true;
            } else if (['KeyD', 'ArrowRight'].includes(e.code)) {
                navigateButtons(1); // Move focus right on plane cards
                handledNav = true;
            }
            if (['Space', 'ShiftRight', 'Enter'].includes(e.code)) {
                selectCurrentButton();
                handledNav = true;
            }
        }
        // Game Over / Game Finished Screen Navigation
        else if (gameOverScreen.classList.contains('visible') || gameFinishedScreen.classList.contains('visible')) {
            if (['Space', 'ShiftRight', 'Enter'].includes(e.code)) {
                selectCurrentButton();
                handledNav = true;
            }
        }

        if (handledNav) {
            lastGamepadNavigationTime = now;
            e.preventDefault(); // Prevent scrolling for menu navigation
            return;
        }
    }

    if (!gameRunning || levelTransitioning) return; // Only process movement/shooting keys if game is running

    // Player 1 controls (WASD or Gamepad 0 or Touch Left)
    if (players[0] && players[0].lives > 0) {
        if (['Space', 'KeyW', 'KeyA', 'KeyS', 'KeyD'].includes(e.code)) {
            e.preventDefault(); // Prevent scrolling if spacebar is pressed
            if (e.code === 'Space') players[0].isShooting = true;
        }
    }
    // Player 2 controls (Arrows or Gamepad 1 or Touch Right)
    if (players[1] && players[1].lives > 0) {
        if (['ShiftRight', 'ArrowUp', 'ArrowLeft', 'ArrowDown', 'ArrowRight'].includes(e.code)) {
            e.preventDefault();
            if (e.code === 'ShiftRight') players[1].isShooting = true;
        }
    }
});

document.addEventListener('keyup', (e) => {
    keysPressed[e.code] = false;

    if (!gameRunning || levelTransitioning) return;

    if (players[0] && players[0].lives > 0) {
        if (e.code === 'Space') players[0].isShooting = false;
    }
    if (players[1] && players[1].lives > 0) {
        if (e.code === 'ShiftRight') players[1].isShooting = false;
    }
});

// Mouse wheel for plane selection
planeOptionsContainer.addEventListener('wheel', (e) => {
    if (planeSelectionScreen.classList.contains('visible')) {
        e.preventDefault(); // Prevent page scrolling
        const now = performance.now();
        if (now - lastGamepadNavigationTime > GAMEPAD_NAV_COOLDOWN) {
            if (e.deltaY > 0) { // Scroll down
                navigateButtons(1);
            } else if (e.deltaY < 0) { // Scroll up
                navigateButtons(-1);
            }
            lastGamepadNavigationTime = now;
        }
    }
});

function updatePlayerPosition(player, frameRateFactor) {
    if (player.lives <= 0) return;

    let movingHorizontally = false;
    let movingVertically = false;

    const gamepad = gamepads[player.gamepadIndex];
    const gamepadXAxis = gamepad ? gamepad.axes[0] : 0;
    const gamepadYAxis = gamepad ? gamepad.axes[1] : 0;
    const gamepadThreshold = 0.1;

    let inputX = 0;
    let inputY = 0;

    if (player.id === 'player1') {
        // Player 1 uses WASD (and Gamepad 0 or Touch Left)
        if (keysPressed['KeyA'] || (gamepadXAxis < -gamepadThreshold) || (touchInput.player1.joystickActive && touchInput.player1.joystickCurrentX < -0.1)) inputX = -1;
        else if (keysPressed['KeyD'] || (gamepadXAxis > gamepadThreshold) || (touchInput.player1.joystickActive && touchInput.player1.joystickCurrentX > 0.1)) inputX = 1;

        if (keysPressed['KeyW'] || (gamepadYAxis < -gamepadThreshold) || (touchInput.player1.joystickActive && touchInput.player1.joystickCurrentY < -0.1)) inputY = -1;
        else if (keysPressed['KeyS'] || (gamepadYAxis > gamepadThreshold) || (touchInput.player1.joystickActive && touchInput.player1.joystickCurrentY > 0.1)) inputY = 1;
    } else if (player.id === 'player2') {
        // Player 2 uses Arrow Keys (and Gamepad 1 or Touch Right)
        if (keysPressed['ArrowLeft'] || (gamepadXAxis < -gamepadThreshold) || (touchInput.player2.joystickActive && touchInput.player2.joystickCurrentX < -0.1)) inputX = -1;
        else if (keysPressed['ArrowRight'] || (gamepadXAxis > gamepadThreshold) || (touchInput.player2.joystickActive && touchInput.player2.joystickCurrentX > 0.1)) inputX = 1;

        if (keysPressed['ArrowUp'] || (gamepadYAxis < -gamepadThreshold) || (touchInput.player2.joystickActive && touchInput.player2.joystickCurrentY < -0.1)) inputY = -1;
        else if (keysPressed['ArrowDown'] || (gamepadYAxis > gamepadThreshold) || (touchInput.player2.joystickActive && touchInput.player2.joystickCurrentY > 0.1)) inputY = 1;
    }

    // Adjust speeds based on input
    if (inputX !== 0) {
        player.currentSpeedX = Math.max(-player.maxSpeedX, Math.min(player.maxSpeedX, player.currentSpeedX + inputX * player.accelerationX * frameRateFactor));
        movingHorizontally = true;
    } else {
        if (player.currentSpeedX > 0) player.currentSpeedX = Math.max(0, player.currentSpeedX - player.decelerationX * frameRateFactor);
        else if (player.currentSpeedX < 0) player.currentSpeedX = Math.min(0, player.currentSpeedX + player.decelerationX * frameRateFactor);
    }

    if (inputY !== 0) {
        player.currentSpeedY = Math.max(-player.maxSpeedY, Math.min(player.maxSpeedY, player.currentSpeedY + inputY * player.accelerationY * frameRateFactor));
        movingVertically = true;
    } else {
        if (player.currentSpeedY > 0) player.currentSpeedY = Math.max(0, player.currentSpeedY - player.decelerationY * frameRateFactor);
        else if (player.currentSpeedY < 0) player.currentSpeedY = Math.min(0, player.currentSpeedY + player.decelerationY * frameRateFactor);
    }

    player.x += player.currentSpeedX * frameRateFactor;
    player.y += player.currentSpeedY * frameRateFactor;

    player.x = Math.max(player.playerJetElement.offsetWidth / 2, Math.min(GAME_WIDTH - player.playerJetElement.offsetWidth / 2, player.x));
    player.y = Math.max(player.playerJetElement.offsetHeight / 2, Math.min(GAME_HEIGHT - player.playerJetElement.offsetHeight / 2, player.y));

    // Update player tilt based on horizontal speed
    const MAX_TILT_ANGLE = 5;
    const TILT_SPEED = 0.5;
    let targetTilt = 0;
    if (player.currentSpeedX < -0.5) {
        targetTilt = -MAX_TILT_ANGLE;
    } else if (player.currentSpeedX > 0.5) {
        targetTilt = MAX_TILT_ANGLE;
    }

    if (player.currentTilt < targetTilt) {
        player.currentTilt = Math.min(targetTilt, player.currentTilt + TILT_SPEED * frameRateFactor);
    } else if (player.currentTilt > targetTilt) {
        player.currentTilt = Math.max(targetTilt, player.currentTilt - TILT_SPEED * frameRateFactor);
    } else if (Math.abs(player.currentTilt) < 0.1) {
        player.currentTilt = 0;
    }

    player.updatePlayerElementPosition();
}

// --- Player Projectiles ---
function shootProjectile(player) {
    if (!gameRunning || levelTransitioning || player.lives <= 0) return;

    let projectileConfigs = [];
    const baseProjectileStartX = player.x;
    const baseProjectileStartY = player.y - player.playerJetElement.offsetHeight / 2 + MUZZLE_OFFSET_Y;

    if (player.weaponType === 'triple') {
        projectileConfigs.push({ xOffset: -15, speedX: 0 });
        projectileConfigs.push({ xOffset: 0, speedX: 0 });
        projectileConfigs.push({ xOffset: 15, speedX: 0 });
    } else if (player.weaponType === 'laser') {
        projectileConfigs.push({ xOffset: 0, speedX: 0, styleClass: 'projectile-laser' });
    } else if (player.weaponType === 'piercing') {
        projectileConfigs.push({ xOffset: 0, speedX: 0, styleClass: 'projectile-piercing', piercing: true });
    } else if (player.weaponType === 'burst') {
        projectileConfigs.push({ xOffset: -8, speedX: 0, styleClass: 'projectile-burst' });
        projectileConfigs.push({ xOffset: 0, speedX: 0, styleClass: 'projectile-burst' });
        projectileConfigs.push({ xOffset: 8, speedX: 0, styleClass: 'projectile-burst' });
    } else if (player.weaponType === 'scatter') {
        projectileConfigs.push({ xOffset: -15, speedX: -PLAYER_PROJECTILE_SPEED_X_SCATTER, styleClass: 'projectile-scatter-ball' });
        projectileConfigs.push({ xOffset: 0, speedX: 0, styleClass: 'projectile-scatter-ball' });
        projectileConfigs.push({ xOffset: 15, speedX: PLAYER_PROJECTILE_SPEED_X_SCATTER, styleClass: 'projectile-scatter-ball' });
    } else if (player.weaponType === 'heatseeker') {
        projectileConfigs.push({
            xOffset: 0,
            speedX: 0, // Initial speed, will be overridden by tracking
            speedY: -HEATSEEKER_PROJECTILE_SPEED, // Initial speed, will be overridden by tracking
            styleClass: 'projectile-heatseeker-ball',
            type: 'heatseeker',
            currentAngle: -Math.PI / 2 // Start pointing straight up
        });
    }
    else { // Standard or 'fast' (fast just changes cooldown)
        projectileConfigs.push({ xOffset: 0, speedX: 0 });
    }

    projectileConfigs.forEach(pC => {
        const projectile = document.createElement('div');
        projectile.classList.add('projectile');
        if (pC.styleClass) {
            projectile.classList.add(pC.styleClass);
        }
        const projectileWidth = (pC.styleClass === 'projectile-laser') ? 10 : (pC.styleClass === 'projectile-piercing') ? 7 : (pC.styleClass === 'projectile-burst') ? 4 : (pC.styleClass === 'projectile-scatter-ball') ? 8 : (pC.styleClass === 'projectile-heatseeker-ball') ? 8 : 5;
        projectile.style.left = `${baseProjectileStartX - (projectileWidth / 2) + (pC.xOffset || 0)}px`;
        projectile.style.top = `${baseProjectileStartY}px`;
        gameContainer.appendChild(projectile);
        allProjectiles.push({
            element: projectile,
            x: parseFloat(projectile.style.left), // Store actual x position
            y: parseFloat(projectile.style.top),
            speedX: pC.speedX || 0,
            speedY: pC.speedY || -PLAYER_PROJECTILE_SPEED_Y, // Default upward speed
            owner: player.id,
            piercing: pC.piercing || false,
            type: pC.type || 'standard',
            currentAngle: pC.currentAngle // For heatseeker
        });
    });
}

function updateProjectiles(frameRateFactor) {
    for (let i = allProjectiles.length - 1; i >= 0; i--) {
        const p = allProjectiles[i];

        if (p.type === 'heatseeker') {
            // Find the closest enemy
            let closestEnemy = null;
            let minDistanceSq = Infinity;

            if (window.currentLevelModule && window.currentLevelModule.activeEnemies) {
                for (const enemy of window.currentLevelModule.activeEnemies) {
                    // Only target visible enemies that are not too close (to avoid erratic behavior right at spawn)
                    if (enemy.y > -enemy.height && enemy.health > 0) {
                        const distSq = (p.x - enemy.x) * (p.x - enemy.x) + (p.y - enemy.y) * (p.y - enemy.y);
                        if (distSq < minDistanceSq) {
                            minDistanceSq = distSq;
                            closestEnemy = enemy;
                        }
                    }
                }
            }

            if (closestEnemy) {
                let dx = closestEnemy.x - p.x;
                let dy = closestEnemy.y - p.y; // Now tracks enemy's actual Y

                const targetAngle = Math.atan2(dy, dx); // Angle towards target

                // Smoothly adjust current angle towards target angle
                let angleDiff = targetAngle - p.currentAngle;

                // Normalize angleDiff to be between -PI and PI
                if (angleDiff > Math.PI) angleDiff -= 2 * Math.PI;
                if (angleDiff < -Math.PI) angleDiff += 2 * Math.PI;

                // Limit turning rate
                const maxTurn = MAX_HEATSEEKER_TURN_ANGLE_RAD * frameRateFactor;
                if (angleDiff > maxTurn) angleDiff = maxTurn;
                if (angleDiff < -maxTurn) angleDiff = -maxTurn;

                p.currentAngle += angleDiff;

                // Update speeds based on new angle
                p.speedX = Math.cos(p.currentAngle) * HEATSEEKER_PROJECTILE_SPEED;
                p.speedY = Math.sin(p.currentAngle) * HEATSEEKER_PROJECTILE_SPEED;

            } else {
                // If no enemy, slowly steer back to straight up if not already
                if (Math.abs(p.currentAngle - (-Math.PI / 2)) > EPSILON * 10) { // Check if not already pointing mostly up
                    let angleDiffToUp = (-Math.PI / 2) - p.currentAngle;
                    // Normalize angleDiffToUp
                    if (angleDiffToUp > Math.PI) angleDiffToUp -= 2 * Math.PI;
                    if (angleDiffToUp < -Math.PI) angleDiffToUp += 2 * Math.PI;

                    const maxTurn = MAX_HEATSEEKER_TURN_ANGLE_RAD * frameRateFactor; // Use the same max turn rate
                    p.currentAngle += Math.max(-maxTurn, Math.min(maxTurn, angleDiffToUp));
                }
                p.speedX = Math.cos(p.currentAngle) * HEATSEEKER_PROJECTILE_SPEED;
                p.speedY = Math.sin(p.currentAngle) * HEATSEEKER_PROJECTILE_SPEED;
            }

            p.x += p.speedX * frameRateFactor;
            p.y += p.speedY * frameRateFactor;

        } else {
            // Standard projectiles
            p.x += p.speedX * frameRateFactor;
            p.y += p.speedY * frameRateFactor;
        }

        p.element.style.left = `${p.x}px`;
        p.element.style.top = `${p.y}px`;

        // Check if the projectile is off-screen
        // Consider all four boundaries for projectiles that can move horizontally
        if (p.y + p.element.offsetHeight < 0 || p.y > GAME_HEIGHT || p.x + p.element.offsetWidth < 0 || p.x > GAME_WIDTH) {
            p.element.remove();
            allProjectiles.splice(i, 1);
        }
    }
}

// --- Starfield ---
function createStars() {
    starsContainer.innerHTML = ''; // Clear existing stars
    for (let i = 0; i < NUM_STARS; i++) {
        const star = document.createElement('div');
        star.classList.add('star');
        const size = Math.random() * (STAR_MAX_SIZE - STAR_MIN_SIZE) + STAR_MIN_SIZE;
        star.style.width = `${size}px`;
        star.style.height = `${size}px`;
        star.style.opacity = Math.random() * 0.8 + 0.2; // 0.2 to 1.0
        star.x = Math.random() * GAME_WIDTH;
        star.y = Math.random() * GAME_HEIGHT;
        star.style.left = `${star.x}px`;
        star.style.top = `${star.y}px`;
        starsContainer.appendChild(star);
        stars.push({ element: star, x: star.x, y: star.y, size: size });
    }
}

function updateStars(frameRateFactor) {
    for (let i = 0; i < stars.length; i++) {
        const star = stars[i];
        star.y += STAR_SPEED * frameRateFactor;
        if (star.y > GAME_HEIGHT) {
            star.y = -star.size; // Reset to top
            star.x = Math.random() * GAME_WIDTH; // New random x
            star.element.style.left = `${star.x}px`;
        }
        star.element.style.top = `${star.y}px`;
    }
}

// --- Orb Functions (Health, Shield, Weapon) ---
function createOrbElement(orbData, classList, x, y, width, height) {
    const orb = document.createElement('div');
    orb.classList.add(...classList);
    orb.style.width = `${width}px`; // Set width
    orb.style.height = `${height}px`; // Set height
    orb.style.left = `${x - width / 2}px`;
    orb.style.top = `${y}px`; // 'y' now represents the top edge of the orb
    gameContainer.appendChild(orb);
    orbData.element = orb;
    return orb;
}

function spawnOrb(type) {
    if (!gameRunning || levelTransitioning) return;

    const x = Math.random() * (GAME_WIDTH - ORB_WIDTH) + ORB_WIDTH / 2;
    const y = -ORB_HEIGHT; // Start off-screen at the top (y represents top edge)

    let currentOrbWidth, currentOrbHeight, orbSpeed;
    let classList = [];

    if (type === 'health') {
        classList = ['health-orb'];
        currentOrbWidth = ORB_WIDTH;
        currentOrbHeight = ORB_HEIGHT;
        orbSpeed = ORB_SPEED;
    } else if (type === 'shield') {
        classList = ['blue-orb'];
        currentOrbWidth = BLUE_ORB_WIDTH;
        currentOrbHeight = BLUE_ORB_HEIGHT;
        orbSpeed = BLUE_ORB_SPEED;
    } else if (type === 'weapon') {
        classList = ['weapon-orb'];
        currentOrbWidth = WEAPON_ORB_WIDTH;
        currentOrbHeight = WEAPON_ORB_HEIGHT;
        orbSpeed = WEAPON_ORB_SPEED;
    }

    // Store all relevant properties directly in orbData
    let orbData = { x: x, y: y, width: currentOrbWidth, height: currentOrbHeight, type: type, speed: orbSpeed };
    const orbElement = createOrbElement(orbData, classList, x, y, currentOrbWidth, currentOrbHeight);

    if (type === 'health') {
        healthOrbs.push(orbData);
    } else if (type === 'shield') {
        blueOrbs.push(orbData);
    } else if (type === 'weapon') {
        weaponOrbs.push(orbData);
    }
}

function updateOrbs(orbArray, frameRateFactor) { // Removed speed, width, height parameters
    for (let i = orbArray.length - 1; i >= 0; i--) {
        const orb = orbArray[i];
        orb.y += orb.speed * frameRateFactor; // Use orb.speed from orbData
        orb.element.style.top = `${orb.y}px`;

        // Remove if the top of the orb is below the game height
        if (orb.y > GAME_HEIGHT) {
            orb.element.remove();
            orbArray.splice(i, 1);
        }
    }
}

function createOrbDestroyedAnimation(x, y, type) {
    const numParticles = 5;
    let particleColor = '#ffffff'; // Default
    let particleShadow = '0 0 5px #ffffff';

    if (type === 'health') {
        particleColor = '#00ff00';
        particleShadow = '0 0 5px #00ff00';
    } else if (type === 'shield') {
        particleColor = '#00BFFF';
        particleShadow = '0 0 5px #00BFFF';
    } else if (type === 'weapon') {
        particleColor = '#ff8c00';
        particleShadow = '0 0 5px #ff8c00';
    }

    for (let i = 0; i < numParticles; i++) {
        const particle = document.createElement('div');
        particle.classList.add('orb-destroyed-particle');
        particle.style.backgroundColor = particleColor;
        particle.style.boxShadow = particleShadow;
        gameContainer.appendChild(particle);

        particle.style.left = `${x - 1.5}px`;
        particle.style.top = `${y - 1.5}px`;

        const angle = Math.random() * Math.PI * 2;
        const distance = Math.random() * 20 + 10;
        const targetX = x + Math.cos(angle) * distance;
        const targetY = y + Math.sin(angle) * distance;

        requestAnimationFrame(() => {
            particle.style.transform = `translate(${targetX - x}px, ${targetY - y}px)`;
            particle.style.opacity = '0';
        });

        setTimeout(() => {
            particle.remove();
        }, 400);
    }
}

function createOrbCollectedAnimation(x, y, type) {
    const animationElement = document.createElement('div');
    if (type === 'health') {
        animationElement.classList.add('orb-collected-animation');
    } else if (type === 'shield') {
        animationElement.classList.add('blue-orb-collected-animation');
    } else if (type === 'weapon') {
        animationElement.classList.add('weapon-orb-collected-animation');
    }

    animationElement.style.left = `${x}px`;
    animationElement.style.top = `${y}px`;
    gameContainer.appendChild(animationElement);

    setTimeout(() => {
        animationElement.remove();
    }, 300);
}

function createPlayerDestroyedAnimation(centerX, centerY) {
    const numParticles = 15; // More particles for player
    const colors = ['#FF00CC', '#00FFFF', '#8e2de2', '#4a00e0', '#3333FF']; // Player-themed colors

    for (let i = 0; i < numParticles; i++) {
        const particle = document.createElement('div');
        particle.classList.add('player-destroyed-particle');

        // Assign a random player-themed color
        particle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];

        gameContainer.appendChild(particle);

        particle.style.left = `${centerX - 3}px`; // Half of particle width/height
        particle.style.top = `${centerY - 3}px`;

        const angle = Math.random() * Math.PI * 2;
        const distance = Math.random() * 50 + 30; // Further scatter
        const targetX = centerX + Math.cos(angle) * distance;
        const targetY = centerY + Math.sin(angle) * distance;

        requestAnimationFrame(() => {
            particle.style.transform = `translate(${targetX - centerX}px, ${targetY - centerY}px)`;
            particle.style.opacity = '0';
        });

        setTimeout(() => {
            particle.remove();
        }, 800); // Longer animation duration
    }
}


// --- Collision Detection ---
function checkCollision(rect1, rect2) {
    return rect1.left < rect2.right &&
           rect1.right > rect2.left &&
           rect1.top < rect2.bottom &&
           rect1.bottom > rect2.top;
}

function checkCollisions(currentTime) {
    players.forEach(player => {
        if (player.lives <= 0) return; // Skip collision checks for defeated players

        const playerRect = player.playerJetElement.getBoundingClientRect();

        // Player vs. Orbs
        [
            { array: healthOrbs, type: 'health' },
            { array: blueOrbs, type: 'shield' },
            { array: weaponOrbs, type: 'weapon' }
        ].forEach(orbGroup => {
            for (let i = orbGroup.array.length - 1; i >= 0; i--) {
                const orb = orbGroup.array[i];
                const orbRect = orb.element.getBoundingClientRect();

                if (checkCollision(playerRect, orbRect)) {
                    if (orbGroup.type === 'health') {
                        if (player.lives < player.maxLives) { // Check against player's max health
                            player.lives++;
                            player.updateHealthBarDisplay();
                            createOrbCollectedAnimation(orb.x, orb.y, 'health');
                        }
                    } else if (orbGroup.type === 'shield') {
                        player.activateShield(orb.x, orb.y);
                    } else if (orbGroup.type === 'weapon') {
                        const randomWeapon = WEAPON_TYPES[Math.floor(Math.random() * WEAPON_TYPES.length)];
                        player.activateWeaponUpgrade(randomWeapon, orb.x, orb.y);
                    }
                    orb.element.remove();
                    orbGroup.array.splice(i, 1);
                }
            }
        });
    });


    // Player Projectile vs. Orbs
    for (let i = allProjectiles.length - 1; i >= 0; i--) {
        const p = allProjectiles[i];
        const pRect = p.element.getBoundingClientRect();

        let projectileRemoved = false;

        [
            { array: healthOrbs, type: 'health' },
            { array: blueOrbs, type: 'shield' },
            { array: weaponOrbs, type: 'weapon' }
        ].forEach(orbGroup => {
            if (projectileRemoved) return;

            for (let j = orbGroup.array.length - 1; j >= 0; j--) {
                const orb = orbGroup.array[j];
                const orbRect = orb.element.getBoundingClientRect();

                if (checkCollision(pRect, orbRect)) {
                    // If it's a piercing projectile, it hits but isn't removed by the orb
                    if (!p.piercing) {
                        p.element.remove();
                        allProjectiles.splice(i, 1);
                        projectileRemoved = true;
                    }
                    createOrbDestroyedAnimation(orb.x, orb.y, orbGroup.type);
                    orb.element.remove();
                    orbGroup.array.splice(j, 1);
                    // If piercing, we don't set projectileRemoved = true here.
                    // If a non-piercing projectile was removed, adjust 'i' to prevent skipping next projectile.
                    if (projectileRemoved) { // This condition is already true if projectile was removed
                        break;
                    }
                }
            }
        });
        if (projectileRemoved) continue;
    }

    // Delegate enemy and enemy projectile collisions to the current level module
    if (window.currentLevelModule) {
        // Player Projectile vs. Enemy
        window.currentLevelModule.checkCollisionsWithPlayerProjectiles(
            allProjectiles,
            (points, ownerId) => { // Callback for scoring, now includes ownerId
                const player = players.find(p => p.id === ownerId);
                if (player) {
                    player.score += points;
                    player.updateScoreDisplay();
                }
            },
            (x, y) => createExplosionParticles(x, y)
        );

        // Enemy Projectile & Enemy vs. Player (shield check handled in loseLife)
        players.forEach(player => {
            if (player.lives <= 0) return;
            const playerRect = player.playerJetElement.getBoundingClientRect();
            window.currentLevelModule.checkCollisionsWithPlayer(
                playerRect,
                () => player.loseLife() // Pass a function to call player.loseLife
            );
        });


        // Check for boss defeat for level progression
        if (bossActive && window.currentLevelModule.isBossDefeated()) {
            levelComplete();
        }
    }
}

// --- Explosion Particles ---
function createExplosionParticles(centerX, centerY) {
    const numParticles = 8;
    for (let i = 0; i < numParticles; i++) {
        const particle = document.createElement('div');
        particle.classList.add('explosion-particle');
        gameContainer.appendChild(particle);

        particle.style.left = `${centerX - 2}px`;
        particle.style.top = `${centerY - 2}px`;

        const angle = Math.random() * Math.PI * 2;
        const distance = Math.random() * 30 + 20;
        const targetX = centerX + Math.cos(angle) * distance;
        const targetY = centerY + Math.sin(angle) * distance;

        requestAnimationFrame(() => {
            particle.style.transform = `translate(${targetX - centerX}px, ${targetY - centerY}px)`;
            particle.style.opacity = '0';
        });

        setTimeout(() => {
            particle.remove();
        }, 600);
    }
}

// --- Level Progression ---
function levelComplete() {
    gameRunning = false;
    cancelAnimationFrame(animationFrameId);
    //clearInterval(gamepadPollInterval); // Stop gamepad polling for in-game
    levelTransitioning = true;

    gameContainer.querySelectorAll('.enemy-projectile, .enemy-jet-wrapper').forEach(el => el.remove());

    if (currentLevel < 5) { // Assuming 5 levels total
        levelMessageText.textContent = `LEVEL ${currentLevel} COMPLETE!`;
        levelMessageOverlay.classList.add('visible');
        setTimeout(() => {
            startLevel(currentLevel + 1);
        }, LEVEL_TRANSITION_DELAY_MS);
    } else {
        gameFinished();
    }
}


// --- Game Loop ---
function gameLoop(currentTime) {
    if (!gameRunning || levelTransitioning) {
        animationFrameId = requestAnimationFrame(gameLoop);
        return;
    }

    const deltaTime = currentTime - lastFrameTime;
    lastFrameTime = currentTime;
    const targetFrameTime = 1000 / 60;
    const frameRateFactor = deltaTime / targetFrameTime;

    updateStars(frameRateFactor);

    // Update gamepad states (for in-game controls)
    pollGamepads();

    // Update all players
    players.forEach(player => {
        if (player.lives > 0) {
            updatePlayerPosition(player, frameRateFactor);

            // Player Shooting
            let actualShotCooldown = player.shotCooldownMs;
            if (player.weaponType === 'fast') {
                actualShotCooldown = 75;
            } else if (player.weaponType === 'burst') {
                // Burst has a specific firing pattern that might need more advanced state/timing
                // For simplicity now, let's just make it fire faster for the duration of the power-up
                actualShotCooldown = 80;
            } else if (player.weaponType === 'heatseeker') {
                actualShotCooldown = 350; // Slower fire rate for heatseeker
            }

            if (player.isShooting && currentTime - player.lastShotTime > actualShotCooldown) {
                shootProjectile(player);
                player.lastShotTime = currentTime;
            }

            // Shield management
            if (player.shieldActive) {
                if (currentTime > player.shieldEndTime) {
                    player.deactivateShield();
                } else {
                    player.updatePlayerShieldVisual();
                }
            }

            // Weapon upgrade management
            if (player.weaponActive) {
                if (currentTime > player.weaponEndTime) {
                    player.deactivateWeaponUpgrade();
                }
            }
        }
    });

    updateProjectiles(frameRateFactor);

    // Collect active player X positions for enemy modules that need to track
    const activePlayerXRefs = players.filter(p => p.lives > 0).map(p => p.x);

    if (window.currentLevelModule) {
        // currentLevelModule.activeEnemies is exposed by enemy modules
        window.currentLevelModule.updateEnemies(currentTime, frameRateFactor, activePlayerXRefs); // Pass activePlayerXRefs
        window.currentLevelModule.updateEnemyProjectiles(frameRateFactor);
        bossActive = window.currentLevelModule.isBossLevel();
    }

    // --- ADDED: Update orb positions ---
    updateOrbs(healthOrbs, frameRateFactor);
    updateOrbs(blueOrbs, frameRateFactor);
    updateOrbs(weaponOrbs, frameRateFactor);
    // --- END ADDED ---

    checkCollisions(currentTime);

    // Orb Spawning (Health, Shield, Weapon)
    if (currentTime - lastOrbSpawnTime > ORB_SPAWN_INTERVAL_MS) {
        spawnOrb('health');
        lastOrbSpawnTime = currentTime;
    }
    if (currentTime - lastBlueOrbSpawnTime > BLUE_ORB_SPAWN_INTERVAL_MS) {
        spawnOrb('shield');
        lastBlueOrbSpawnTime = currentTime;
    }
    if (currentTime - lastWeaponOrbSpawnTime > WEAPON_ORB_SPAWN_INTERVAL_MS) {
        spawnOrb('weapon');
        lastWeaponOrbSpawnTime = currentTime;
    }

    animationFrameId = requestAnimationFrame(gameLoop);
}

function startGameLoop() {
    if (gameRunning) {
        animationFrameId = requestAnimationFrame(gameLoop);
    }
}

// --- Plane Selection Logic ---
function renderPlaneSelection() {
    planeOptionsContainer.innerHTML = ''; // Clear previous options
    planesData.forEach(plane => {
        const planeCard = document.createElement('div');
        planeCard.classList.add('plane-card');
        planeCard.dataset.planeId = plane.id;
        planeCard.innerHTML = `
            <div class="plane-svg">${plane.svg}</div>
            <h2>${plane.name}</h2>
            <p>${plane.description}</p>
            <p class="stat">Speed: ${plane.maxSpeedX} / ${plane.maxSpeedY}</p>
            <p class="stat">Fire Rate: ${Math.round(1000 / plane.shotCooldownMs)} shots/sec</p>
            <p class="stat">Starting Health: ${plane.initialHealth}</p>
            <p class="stat">Starting Weapon: ${plane.startingWeapon.charAt(0).toUpperCase() + plane.startingWeapon.slice(1)}</p>
        `;
        planeCard.addEventListener('click', () => selectPlane(plane.id));
        planeOptionsContainer.appendChild(planeCard);
    });

    // Re-apply selections after rendering
    if (selectedPlane1) {
        planeOptionsContainer.querySelector(`[data-plane-id="${selectedPlane1.id}"]`).classList.add('selected-p1');
    }
    if (selectedPlane2) {
        planeOptionsContainer.querySelector(`[data-plane-id="${selectedPlane2.id}"]`).classList.add('selected-p2');
    }

    // If it's P1's turn and no selection, default to first for gamepad/keyboard focus
    // This is handled by updatePlaneSelectionState now
}

function selectPlane(planeId) {
    const planeData = planesData.find(plane => plane.id === planeId);
    if (!planeData) return;

    if (currentPlayerSelecting === 'P1') {
        if (selectedPlane1 && selectedPlane1.id === planeId) {
            // Deselect
            planeOptionsContainer.querySelector(`[data-plane-id="${selectedPlane1.id}"]`).classList.remove('selected-p1');
            selectedPlane1 = null;
        } else if (selectedPlane2 && selectedPlane2.id === planeId && numPlayers === 2) {
            // P1 cannot select P2's already selected plane
            playerTurnMessage.textContent = `Player 2 has already chosen ${planeData.name}! Please choose a different fighter.`;
            setTimeout(() => {
                updatePlaneSelectionState(); // Reset message after a short delay
            }, 2000);
            return;
        }
        else {
            if (selectedPlane1) {
                planeOptionsContainer.querySelector(`[data-plane-id="${selectedPlane1.id}"]`).classList.remove('selected-p1');
            }
            selectedPlane1 = planeData;
            planeOptionsContainer.querySelector(`[data-plane-id="${planeId}"]`).classList.add('selected-p1');
        }
    } else if (currentPlayerSelecting === 'P2') {
        // *** NEW LOGIC FOR P2 DUPLICATE SELECTION ***
        if (selectedPlane1 && selectedPlane1.id === planeId) {
            playerTurnMessage.textContent = `Player 1 has already chosen ${planeData.name}! Please choose a different fighter.`;
            setTimeout(() => {
                updatePlaneSelectionState(); // Reset message after a short delay
            }, 2000);
            return; // Prevent selection
        }

        if (selectedPlane2 && selectedPlane2.id === planeId) {
            // Deselect
            planeOptionsContainer.querySelector(`[data-plane-id="${selectedPlane2.id}"]`).classList.remove('selected-p2');
            selectedPlane2 = null;
        } else {
            if (selectedPlane2) {
                planeOptionsContainer.querySelector(`[data-plane-id="${selectedPlane2.id}"]`).classList.remove('selected-p2');
            }
            selectedPlane2 = planeData;
            planeOptionsContainer.querySelector(`[data-plane-id="${planeId}"]`).classList.add('selected-p2');
        }
    }

    updatePlaneSelectionState();
}

function updatePlaneSelectionState() {
    let allPlayersSelected = false;

    if (numPlayers === 1) {
        if (selectedPlane1) {
            allPlayersSelected = true;
            playerTurnMessage.textContent = `Player 1 selected: ${selectedPlane1.name}.`;
            setupGamepadNavigation([startGameButton], 0); // Focus on Start Game button
        } else {
            playerTurnMessage.textContent = `Player 1: Select your fighter.`;
            setupGamepadNavigation(Array.from(planeOptionsContainer.children), 0); // Focus on planes
        }
    } else if (numPlayers === 2) {
        if (selectedPlane1 && selectedPlane2) {
            allPlayersSelected = true;
            playerTurnMessage.textContent = `Player 1: ${selectedPlane1.name}, Player 2: ${selectedPlane2.name}. Both players ready!`;
            setupGamepadNavigation([startGameButton], 0); // Focus on Start Game button
        } else if (selectedPlane1 && !selectedPlane2) {
            playerTurnMessage.textContent = `Player 1 selected: ${selectedPlane1.name}. Player 2: Select your fighter.`;
            currentPlayerSelecting = 'P2';
            setupGamepadNavigation(Array.from(planeOptionsContainer.children), 0); // Reset focus for P2
        } else if (!selectedPlane1 && selectedPlane2) {
            playerTurnMessage.textContent = `Player 2 selected: ${selectedPlane2.name}. Player 1: Select your fighter.`;
            currentPlayerSelecting = 'P1';
            setupGamepadNavigation(Array.from(planeOptionsContainer.children), 0); // Reset focus for P1
        } else { // No selections yet or both deselected
            playerTurnMessage.textContent = `Player 1: Select your fighter.`;
            currentPlayerSelecting = 'P1';
            setupGamepadNavigation(Array.from(planeOptionsContainer.children), 0);
        }
    }

    startGameButton.disabled = !allPlayersSelected;
    if (allPlayersSelected) {
        setupGamepadNavigation([startGameButton], 0); // Ensure focus is on Start Game
    } else if (currentNavigableElements[focusedButtonIndex] === startGameButton && startGameButton.disabled) {
        // If start button was focused but is now disabled, shift focus to plane cards
        setupGamepadNavigation(Array.from(planeOptionsContainer.children), 0);
    }
}

function showPlaneSelection() {
    gameRunning = false;
    cancelAnimationFrame(animationFrameId);
    //clearInterval(gamepadPollInterval); // Stop game loop gamepad polling

    // Explicitly hide the actual player jet elements from the game scene
    // This ensures they don't appear in the background of the selection screen
    document.getElementById('player-jet-wrapper1').style.display = 'none';
    document.getElementById('player-jet-wrapper2').style.display = 'none'; // Also hide P2 if it was visible

    planeSelectionScreen.classList.add('visible');
    introScreen.style.display = 'none'; // Hide intro screen
    selectedPlane1 = null;
    selectedPlane2 = null;
    currentPlayerSelecting = 'P1'; // Start with P1 selection
    renderPlaneSelection();
    updatePlaneSelectionState(); // Set initial message and button state
    showTouchControls(false); // Hide touch controls
    // setupGamepadNavigation already done by updatePlaneSelectionState
}

startGameButton.addEventListener('click', () => {
    if (!startGameButton.disabled && (selectedPlane1 || numPlayers === 1)) { // Ensure P1 selected a plane
        if (numPlayers === 2 && !selectedPlane2) {
            // This case should be prevented by disabled button, but as a safeguard.
            playerTurnMessage.textContent = 'Player 2 needs to select a fighter jet!';
            setTimeout(() => { updatePlaneSelectionState(); }, 2000);
            return;
        }
        planeSelectionScreen.classList.remove('visible');
        resetGame();
        showTouchControls(true); // Show touch controls
    } else {
        // This scenario should be rare if button is disabled correctly
        playerTurnMessage.textContent = 'Please select a fighter jet for Player 1!';
        setTimeout(() => { updatePlaneSelectionState(); }, 2000);
    }
});

// --- Intro Screen Logic ---
function showIntroScreen() {
    introScreen.style.display = 'flex';
    planeSelectionScreen.classList.remove('visible');
    gameOverScreen.classList.remove('visible');
    gameFinishedScreen.classList.remove('visible');
    //clearInterval(gamepadPollInterval); // Stop any existing game/menu polling
    setupGamepadNavigation([onePlayerButton, twoPlayersButton], 0);
}

onePlayerButton.addEventListener('click', () => {
    numPlayers = 1;
    showPlaneSelection();
});

twoPlayersButton.addEventListener('click', () => {
    numPlayers = 2;
    showPlaneSelection();
});

touchOpacitySlider.addEventListener('input', (event) => {
    const opacity = event.target.value;
    touchControlsContainer.style.opacity = opacity;
});

// --- Gamepad API ---
window.addEventListener("gamepadconnected", (e) => {
    console.log("Gamepad connected at index %d: %s. %d buttons, %d axes.",
        e.gamepad.index, e.gamepad.id,
        e.gamepad.buttons.length, e.gamepad.axes.length);
    gamepads[e.gamepad.index] = e.gamepad;
    // If on a menu, trigger a navigation update to potentially show focus
    if (!gameRunning) {
        pollGamepads(); // Immediate poll to set initial focus
    }
});

window.addEventListener("gamepaddisconnected", (e) => {
    console.log("Gamepad disconnected from index %d: %s",
        e.gamepad.index, e.gamepad.id);
    delete gamepads[e.gamepad.index];
});

function setupGamepadNavigation(elements, defaultFocusIndex = 0) {
    currentNavigableElements.forEach(el => el.classList.remove('focused')); // Clear old focus
    currentNavigableElements = elements;
    focusedButtonIndex = defaultFocusIndex;

    if (currentNavigableElements.length > 0 && focusedButtonIndex >= 0 && focusedButtonIndex < currentNavigableElements.length) {
        currentNavigableElements[focusedButtonIndex].classList.add('focused');
        // Ensure the focused element is scrolled into view if it's a plane card
        if (planeSelectionScreen.classList.contains('visible') && currentNavigableElements[focusedButtonIndex].classList.contains('plane-card')) {
            currentNavigableElements[focusedButtonIndex].scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
    }
}

function navigateButtons(direction) { // direction: -1 for up/left, 1 for down/right
    if (currentNavigableElements.length === 0) return;

    currentNavigableElements[focusedButtonIndex].classList.remove('focused');

    focusedButtonIndex += direction;
    if (focusedButtonIndex < 0) {
        focusedButtonIndex = currentNavigableElements.length - 1;
    } else if (focusedButtonIndex >= currentNavigableElements.length) {
        focusedButtonIndex = 0;
    }

    currentNavigableElements[focusedButtonIndex].classList.add('focused');
    // Scroll into view for plane cards
    if (planeSelectionScreen.classList.contains('visible') && currentNavigableElements[focusedButtonIndex].classList.contains('plane-card')) {
        currentNavigableElements[focusedButtonIndex].scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
}

function selectCurrentButton() {
    if (currentNavigableElements.length > 0 && focusedButtonIndex !== -1) {
        const elementToClick = currentNavigableElements[focusedButtonIndex];
        if (!elementToClick.disabled) { // Only click if not disabled
            elementToClick.click();
        }
    }
}

function pollGamepads() {
    const now = performance.now();
    const currentGamepads = navigator.getGamepads ? navigator.getGamepads() : [];
    let navigated = false;

    for (let i = 0; i < currentGamepads.length; i++) {
        const gp = currentGamepads[i];
        if (gp) {
            gamepads[gp.index] = gp; // Update the gamepad object

            // In-game controls
            if (gameRunning) {
                const player = players.find(p => p.gamepadIndex === gp.index);
                if (player && player.lives > 0) {
                    // Buttons (e.g., A button for shooting)
                    const fireButton = gp.buttons[0]; // Standard A button
                    if (fireButton && fireButton.pressed) {
                        player.isShooting = true;
                    } else {
                        player.isShooting = false;
                    }
                }
            } else { // Menu navigation (only P1's gamepad controls menus)
                if (i !== 0) continue; // Only process gamepad 0 for menu navigation

                const xAxis = gp.axes[0]; // Left stick horizontal
                const yAxis = gp.axes[1]; // Left stick vertical
                const dpadUp = gp.buttons[12]; // D-pad Up
                const dpadDown = gp.buttons[13]; // D-pad Down
                const dpadLeft = gp.buttons[14]; // D-pad Left
                const dpadRight = gp.buttons[15]; // D-pad Right
                const selectButton = gp.buttons[0]; // Standard A button for selection

                if (now - lastGamepadNavigationTime > GAMEPAD_NAV_COOLDOWN) {
                    // Prioritize D-pad, then analog stick
                    if (dpadUp && dpadUp.pressed || yAxis < -GAMEPAD_AXIS_THRESHOLD) { // Up
                        navigateButtons(-1);
                        navigated = true;
                    } else if (dpadDown && dpadDown.pressed || yAxis > GAMEPAD_AXIS_THRESHOLD) { // Down
                        navigateButtons(1);
                        navigated = true;
                    } else if (dpadLeft && dpadLeft.pressed || xAxis < -GAMEPAD_AXIS_THRESHOLD) { // Left
                        navigateButtons(-1);
                        navigated = true;
                    } else if (dpadRight && dpadRight.pressed || xAxis > GAMEPAD_AXIS_THRESHOLD) { // Right
                        navigateButtons(1);
                        navigated = true;
                    }

                    if (navigated) {
                        lastGamepadNavigationTime = now;
                    }
                }
                if (selectButton && selectButton.pressed && (now - lastGamepadNavigationTime > GAMEPAD_NAV_COOLDOWN)) {
                    selectCurrentButton();
                    lastGamepadNavigationTime = now; // Prevent double click
                }
            }
        }
    }
}


// --- Touch Screen Controls ---
function showTouchControls(visible) {
    if (visible) {
        touchControlsContainer.classList.add('visible');
        touchJoystickLeftBase.classList.add('visible');
        touchFireLeft.classList.add('visible');

        if (numPlayers === 2) {
            touchJoystickRightBase.classList.add('visible');
            touchFireRight.classList.add('visible');
        } else {
            touchJoystickRightBase.classList.remove('visible');
            touchFireRight.classList.remove('visible');
        }
    } else {
        touchControlsContainer.classList.remove('visible');
        touchJoystickLeftBase.classList.remove('visible');
        touchFireLeft.classList.remove('visible');
        touchJoystickRightBase.classList.remove('visible');
        touchFireRight.classList.remove('visible');
    }
}

touchControlsContainer.addEventListener('touchstart', handleTouchStart);
touchControlsContainer.addEventListener('touchmove', handleTouchMove);
touchControlsContainer.addEventListener('touchend', handleTouchEnd);
touchControlsContainer.addEventListener('touchcancel', handleTouchEnd); // Handle if touch leaves browser window

// Add touch events for the plane selection screen specifically for swiping
planeOptionsContainer.addEventListener('touchstart', handlePlaneSelectionTouchStart);
planeOptionsContainer.addEventListener('touchend', handlePlaneSelectionTouchEnd);


function getTouchPosition(touch) {
    const rect = gameContainer.getBoundingClientRect();
    return {
        x: touch.clientX - rect.left,
        y: touch.clientY - rect.top
    };
}

function handleTouchStart(e) {
    e.preventDefault(); // Prevent scrolling/zooming

    for (let i = 0; i < e.changedTouches.length; i++) {
        const touch = e.changedTouches[i];
        const touchPos = getTouchPosition(touch);

        // Player 1 Controls (left half of the screen)
        if (touchPos.x < GAME_WIDTH / 2 && players[0] && players[0].lives > 0) {
            const joystickLeftRect = touchJoystickLeftBase.getBoundingClientRect();
            const fireLeftRect = touchFireLeft.getBoundingClientRect();

            // Check if touch is within joystick base
            if (checkCollision({left: touchPos.x, right: touchPos.x + 1, top: touchPos.y, bottom: touchPos.y + 1}, joystickLeftRect)) {
                touchInput.player1.joystickActive = true;
                // Store the *center* of the base for joystick calculation
                touchInput.player1.joystickStartX = joystickLeftRect.left + joystickLeftRect.width / 2;
                touchInput.player1.joystickStartY = joystickLeftRect.top + joystickLeftRect.height / 2;
                touchInput.player1.touchId = touch.identifier;
                updateJoystickHandlePosition(touchJoystickLeftHandle, touchInput.player1, touchPos);
            }
            // Check if touch is within fire button
            else if (checkCollision({left: touchPos.x, right: touchPos.x + 1, top: touchPos.y, bottom: touchPos.y + 1}, fireLeftRect)) {
                players[0].isShooting = true;
                touchFireLeft.classList.add('active');
                touchInput.player1.fireActive = true;
                touchInput.player1.touchId = touch.identifier;
            }
        }

        // Player 2 Controls (right half of the screen)
        if (numPlayers === 2 && touchPos.x >= GAME_WIDTH / 2 && players[1] && players[1].lives > 0) {
            const joystickRightRect = touchJoystickRightBase.getBoundingClientRect();
            const fireRightRect = touchFireRight.getBoundingClientRect();

            // Check if touch is within joystick base
            if (checkCollision({left: touchPos.x, right: touchPos.x + 1, top: touchPos.y, bottom: touchPos.y + 1}, joystickRightRect)) {
                touchInput.player2.joystickActive = true;
                // Store the *center* of the base for joystick calculation
                touchInput.player2.joystickStartX = joystickRightRect.left + joystickRightRect.width / 2;
                touchInput.player2.joystickStartY = joystickRightRect.top + joystickRightRect.height / 2;
                touchInput.player2.touchId = touch.identifier;
                updateJoystickHandlePosition(touchJoystickRightHandle, touchInput.player2, touchPos);
            }
            // Check if touch is within fire button
            else if (checkCollision({left: touchPos.x, right: touchPos.x + 1, top: touchPos.y, bottom: touchPos.y + 1}, fireRightRect)) {
                players[1].isShooting = true;
                touchFireRight.classList.add('active');
                touchInput.player2.fireActive = true;
                touchInput.player2.touchId = touch.identifier;
            }
        }
    }
}

function handleTouchMove(e) {
    e.preventDefault();

    for (let i = 0; i < e.changedTouches.length; i++) {
        const touch = e.changedTouches[i];
        const touchPos = getTouchPosition(touch);

        // Player 1 Joystick
        if (touchInput.player1.joystickActive && touch.identifier === touchInput.player1.touchId) {
            updateJoystickHandlePosition(touchJoystickLeftHandle, touchInput.player1, touchPos);
        }
        // Player 2 Joystick
        if (touchInput.player2.joystickActive && touch.identifier === touchInput.player2.touchId) {
            updateJoystickHandlePosition(touchJoystickRightHandle, touchInput.player2, touchPos);
        }
    }
}

function handleTouchEnd(e) {
    e.preventDefault();

    for (let i = 0; i < e.changedTouches.length; i++) {
        const touch = e.changedTouches[i];

        // Player 1 Joystick
        if (touchInput.player1.joystickActive && touch.identifier === touchInput.player1.touchId) {
            touchInput.player1.joystickActive = false;
            touchInput.player1.joystickCurrentX = 0;
            touchInput.player1.joystickCurrentY = 0;
            touchJoystickLeftHandle.style.left = '50%';
            touchJoystickLeftHandle.style.top = '50%';
            touchInput.player1.touchId = null;
        }
        // Player 1 Fire
        if (touchInput.player1.fireActive && touch.identifier === touchInput.player1.touchId) {
            if (players[0]) players[0].isShooting = false;
            touchFireLeft.classList.remove('active');
            touchInput.player1.fireActive = false;
            touchInput.player1.touchId = null;
        }

        // Player 2 Joystick
        if (touchInput.player2.joystickActive && touch.identifier === touchInput.player2.touchId) {
            touchInput.player2.joystickActive = false;
            touchInput.player2.joystickCurrentX = 0;
            touchInput.player2.joystickCurrentY = 0;
            touchJoystickRightHandle.style.left = '50%';
            touchJoystickRightHandle.style.top = '50%';
            touchInput.player2.touchId = null;
        }
        // Player 2 Fire
        if (touchInput.player2.fireActive && touch.identifier === touchInput.player2.touchId) {
            if (players[1]) players[1].isShooting = false;
            touchFireRight.classList.remove('active');
            touchInput.player2.fireActive = false;
            touchInput.player2.touchId = null;
        }
    }
}

function updateJoystickHandlePosition(handleElement, playerTouchInput, currentTouchPos) {
    // Get the bounding rect of the joystick base (parent of the handle)
    const joystickBaseRect = handleElement.parentElement.getBoundingClientRect();

    // Calculate center of the joystick base relative to the game container
    const centerX = joystickBaseRect.left + joystickBaseRect.width / 2;
    const centerY = joystickBaseRect.top + joystickBaseRect.height / 2;

    // Calculate the delta (offset) of the touch from the center of the base
    let deltaX = currentTouchPos.x - centerX;
    let deltaY = currentTouchPos.y - centerY;

    // Calculate the distance of the touch from the center
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

    // Limit the handle's movement to within the JOYSTICK_MAX_DISTANCE radius
    if (distance > JOYSTICK_MAX_DISTANCE) {
        const angle = Math.atan2(deltaY, deltaX);
        deltaX = Math.cos(angle) * JOYSTICK_MAX_DISTANCE;
        deltaY = Math.sin(angle) * JOYSTICK_MAX_DISTANCE;
    }

    // Update the handle's position relative to its parent (the base)
    // It's `50%` + `(delta / base_dimension) * 100%` because handle's left/top are relative to its parent
    handleElement.style.left = `${50 + (deltaX / joystickBaseRect.width) * 100}%`;
    handleElement.style.top = `${50 + (deltaY / joystickBaseRect.height) * 100}%`;

    // Store normalized joystick input (-1 to 1) for player movement logic
    playerTouchInput.joystickCurrentX = deltaX / JOYSTICK_MAX_DISTANCE;
    playerTouchInput.joystickCurrentY = deltaY / JOYSTICK_MAX_DISTANCE;
}

// --- Plane Selection Touch Swiping ---
let planeSelectionTouchStartX = 0;
let planeSelectionTouchStartTime = 0;

function handlePlaneSelectionTouchStart(e) {
    if (planeSelectionScreen.classList.contains('visible') && e.touches.length === 1) {
        planeSelectionTouchStartX = e.touches[0].clientX;
        planeSelectionTouchStartTime = performance.now();
        e.preventDefault(); // Prevent accidental scrolling
    }
}

function handlePlaneSelectionTouchEnd(e) {
    if (planeSelectionScreen.classList.contains('visible') && e.changedTouches.length === 1) {
        const touchEndX = e.changedTouches[0].clientX;
        const touchEndTime = performance.now();
        const deltaX = touchEndX - planeSelectionTouchStartX;
        const deltaTime = touchEndTime - planeSelectionTouchStartTime;

        // Only consider a swipe if it's horizontal enough and fast enough
        if (Math.abs(deltaX) > SWIPE_THRESHOLD && deltaTime < 300) { // Swipe threshold and quick swipe
            const now = performance.now();
            if (now - lastGamepadNavigationTime > GAMEPAD_NAV_COOLDOWN) {
                if (deltaX < 0) { // Swiped left
                    navigateButtons(1); // Move right in options
                } else { // Swiped right
                    navigateButtons(-1); // Move left in options
                }
                lastGamepadNavigationTime = now;
            }
        } else if (Math.abs(deltaX) <= SWIPE_THRESHOLD && deltaTime < 300) {
            // This is a tap, simulate click on the currently focused element
            const now = performance.now();
            if (now - lastGamepadNavigationTime > GAMEPAD_NAV_COOLDOWN) {
                // Check if the tap happened on a focused element
                const touchedElement = document.elementFromPoint(e.changedTouches[0].clientX, e.changedTouches[0].clientY);
                if (touchedElement && touchedElement.classList.contains('plane-card') && touchedElement.classList.contains('focused')) {
                     selectCurrentButton();
                     lastGamepadNavigationTime = now;
                } else {
                    // If not on a focused element, maybe it's a direct tap on an unfocused card
                    let targetCard = null;
                    e.changedTouches.forEach(touch => {
                        const card = document.elementFromPoint(touch.clientX, touch.clientY);
                        if (card && card.classList.contains('plane-card')) {
                            targetCard = card;
                        }
                    });
                    if (targetCard) {
                        // Find its index to set focus and then select it
                        const index = Array.from(planeOptionsContainer.children).indexOf(targetCard);
                        if (index !== -1) {
                            if (focusedButtonIndex !== -1) {
                                currentNavigableElements[focusedButtonIndex].classList.remove('focused');
                            }
                            focusedButtonIndex = index;
                            currentNavigableElements[focusedButtonIndex].classList.add('focused');
                            selectCurrentButton();
                            lastGamepadNavigationTime = now;
                        }
                    }
                }
            }
        }
        e.preventDefault();
    }
}


// Initial setup: Show intro screen first
window.onload = () => {
    showIntroScreen();
    // Set initial opacity of touch controls
    touchControlsContainer.style.opacity = touchOpacitySlider.value;
    // Start gamepad polling specifically for menu navigation. In-game polling is handled by gameLoop.
    gamepadPollInterval = setInterval(pollGamepads, 1000 / 60);
};
