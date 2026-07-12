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
const fxToggleButton = document.getElementById('fx-toggle-button');
const musicToggleButton = document.getElementById('music-toggle-button');
const touchOpacitySlider = document.getElementById('touch-opacity-slider');

// Touch Control Elements
const touchControlsContainer = document.getElementById('touch-controls-container');
const touchJoystickLeftBase = document.getElementById('touch-joystick-left-base');
const touchJoystickLeftHandle = document.getElementById('touch-joystick-left-handle');
const touchFireLeft = document.getElementById('touch-fire-left');
const touchJoystickRightBase = document.getElementById('touch-joystick-right-base');
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
const ORB_SPAWN_INTERVAL_MS = 4000; // Spawn new health orb more frequently (was 7000)
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
const WEAPON_TYPES = ['standard', 'triple', 'laser', 'fast', 'piercing', 'burst', 'scatter', 'heatseeker']; // Available weapon types for pickups

// Level Management
let currentLevel = 0;
let bossActive = false; // Is a boss currently on the screen?
let levelTransitioning = false;
const LEVEL_TRANSITION_DELAY_MS = 1000; // Time to wait between levels

// Boss epic destruction variables
let bossDestructionPlaying = false;
let lastKilledBossPoints = 0;
let lastKilledBossPos = { x: 0, y: 0 };

// Intro screen space warp stars
let introCanvas = null;
let introCtx = null;
let introWarpStars = [];
const NUM_INTRO_WARP_STARS = 100;
let introWarpAnimationId = null;

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
        swipeStartX: 0, swipeStartY: 0
    },
    player2: {
        joystickActive: false,
        joystickStartX: 0, joystickStartY: 0,
        joystickCurrentX: 0, joystickCurrentY: 0,
        fireActive: false,
        touchId: null,
        swipeStartX: 0, swipeStartY: 0
    }
};
const JOYSTICK_MAX_DISTANCE = 40; // Max distance handle can move from base center
const SWIPE_THRESHOLD = 50; // Minimum pixel distance for a swipe to register

// --- Web Audio API state ---
let audioCtx = null;
let sfxEnabled = true;
let musicEnabled = true;
let currentMusic = null;

// Node reference variables for the routing chain
let masterGainNode = null;
let hpfNode = null;
let lpfNode = null;
let limiterNode = null;

function initAudio() {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();

        // Create Master Gain
        masterGainNode = audioCtx.createGain();
        masterGainNode.gain.setValueAtTime(1.0, audioCtx.currentTime);

        // Create High Pass Filter (cut sub-bass rumble)
        hpfNode = audioCtx.createBiquadFilter();
        hpfNode.type = 'highpass';
        hpfNode.frequency.setValueAtTime(60, audioCtx.currentTime);

        // Create Low Pass Filter (soften piercing/harsh frequencies)
        lpfNode = audioCtx.createBiquadFilter();
        lpfNode.type = 'lowpass';
        lpfNode.frequency.setValueAtTime(7500, audioCtx.currentTime);

        // Create Peak Limiter (using DynamicsCompressor)
        limiterNode = audioCtx.createDynamicsCompressor();
        limiterNode.threshold.setValueAtTime(-1.0, audioCtx.currentTime); // Threshold -1 dB
        limiterNode.knee.setValueAtTime(0, audioCtx.currentTime); // Hard knee for peak limiting
        limiterNode.ratio.setValueAtTime(20.0, audioCtx.currentTime); // High ratio
        limiterNode.attack.setValueAtTime(0.003, audioCtx.currentTime); // Fast attack (3ms)
        limiterNode.release.setValueAtTime(0.1, audioCtx.currentTime); // Release (100ms)

        // Chain connections: Sources -> HPF -> LPF -> Limiter -> Master Gain -> Destination
        hpfNode.connect(lpfNode);
        lpfNode.connect(limiterNode);
        limiterNode.connect(masterGainNode);
        masterGainNode.connect(audioCtx.destination);
    }
    if (audioCtx && audioCtx.state === 'suspended') {
        audioCtx.resume();
    }
}

// Procedural sound synth fallback generators routing through the filters and limiter
function playLaserSoundSynth() {
    initAudio();
    if (!audioCtx || !hpfNode) return;

    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(800, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(100, audioCtx.currentTime + 0.15);

    gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.15);

    osc.connect(gain);
    gain.connect(hpfNode);

    osc.start();
    osc.stop(audioCtx.currentTime + 0.15);
}

// Custom weapon synth sound generator if corresponding MP3 is missing
function playWeaponSoundSynth(weaponType) {
    initAudio();
    if (!audioCtx || !hpfNode) return;

    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    let duration = 0.15;

    switch (weaponType) {
        case 'triple':
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(440, audioCtx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(150, audioCtx.currentTime + 0.18);
            gain.gain.setValueAtTime(0.09, audioCtx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.18);
            duration = 0.18;
            break;
        case 'laser':
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(1200, audioCtx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(300, audioCtx.currentTime + 0.25);
            gain.gain.setValueAtTime(0.06, audioCtx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.25);
            duration = 0.25;
            break;
        case 'fast':
            osc.type = 'sine';
            osc.frequency.setValueAtTime(600, audioCtx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(200, audioCtx.currentTime + 0.08);
            gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.08);
            duration = 0.08;
            break;
        case 'piercing':
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(900, audioCtx.currentTime);
            osc.frequency.setValueAtTime(700, audioCtx.currentTime + 0.05);
            osc.frequency.setValueAtTime(500, audioCtx.currentTime + 0.1);
            gain.gain.setValueAtTime(0.07, audioCtx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.15);
            duration = 0.15;
            break;
        case 'burst':
            osc.type = 'square';
            osc.frequency.setValueAtTime(300, audioCtx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(80, audioCtx.currentTime + 0.12);
            gain.gain.setValueAtTime(0.05, audioCtx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.12);
            duration = 0.12;
            break;
        case 'scatter':
            osc.type = 'sine';
            osc.frequency.setValueAtTime(500, audioCtx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(100, audioCtx.currentTime + 0.15);
            gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.15);
            duration = 0.15;
            break;
        case 'heatseeker':
            osc.type = 'sine';
            osc.frequency.setValueAtTime(200, audioCtx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(800, audioCtx.currentTime + 0.25);
            gain.gain.setValueAtTime(0.07, audioCtx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.25);
            duration = 0.25;
            break;
        default:
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(800, audioCtx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(100, audioCtx.currentTime + 0.15);
            gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.15);
            duration = 0.15;
            break;
    }

    osc.connect(gain);
    gain.connect(hpfNode);

    osc.start();
    osc.stop(audioCtx.currentTime + duration);
}

function playExplosionSoundSynth() {
    initAudio();
    if (!audioCtx || !hpfNode) return;

    const bufferSize = audioCtx.sampleRate * 0.4;
    const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
    }

    const noise = audioCtx.createBufferSource();
    noise.buffer = buffer;

    const filter = audioCtx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(800, audioCtx.currentTime);
    filter.frequency.exponentialRampToValueAtTime(80, audioCtx.currentTime + 0.35);

    const gain = audioCtx.createGain();
    gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.4);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(hpfNode);

    noise.start();
    noise.stop(audioCtx.currentTime + 0.4);
}

function playPickupSoundSynth() {
    initAudio();
    if (!audioCtx || !hpfNode) return;

    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(250, audioCtx.currentTime);
    osc.frequency.setValueAtTime(400, audioCtx.currentTime + 0.08);
    osc.frequency.setValueAtTime(600, audioCtx.currentTime + 0.16);

    gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.25);

    osc.connect(gain);
    gain.connect(hpfNode);

    osc.start();
    osc.stop(audioCtx.currentTime + 0.25);
}

function playDamageSoundSynth() {
    initAudio();
    if (!audioCtx || !hpfNode) return;

    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(160, audioCtx.currentTime);
    osc.frequency.linearRampToValueAtTime(40, audioCtx.currentTime + 0.2);

    gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.2);

    osc.connect(gain);
    gain.connect(hpfNode);

    osc.start();
    osc.stop(audioCtx.currentTime + 0.2);
}

// Standard fallback sound wrapper
function playLaserSound() {
    playSoundWithFallback('laser.mp3', playLaserSoundSynth);
}

function playExplosionSound() {
    playSoundWithFallback('explosion.mp3', playExplosionSoundSynth);
}

function playPickupSound() {
    playSoundWithFallback('pickup.mp3', playPickupSoundSynth);
}

function playDamageSound() {
    playSoundWithFallback('damage.mp3', playDamageSoundSynth);
}

// Integrated primary weapon audio player attempting to load specific physical MP3s with fallback to Web Audio
function playWeaponSound(weaponType) {
    if (!sfxEnabled) return;
    
    let mp3Name = 'laser.mp3'; // Standard
    if (weaponType === 'triple') mp3Name = 'triple.mp3';
    else if (weaponType === 'laser') mp3Name = 'laser_beam.mp3';
    else if (weaponType === 'fast') mp3Name = 'fast.mp3';
    else if (weaponType === 'piercing') mp3Name = 'piercing.mp3';
    else if (weaponType === 'burst') mp3Name = 'burst.mp3';
    else if (weaponType === 'scatter') mp3Name = 'scatter.mp3';
    else if (weaponType === 'heatseeker') mp3Name = 'heatseeker.mp3';

    const audio = new Audio(mp3Name);
    audio.volume = 0.4;
    
    audio.play()
        .then(() => {
            // Success
        })
        .catch(() => {
            // Load synthesizer fallback
            playWeaponSoundSynth(weaponType);
        });
}

function playSoundWithFallback(mp3Path, synthCallback) {
    if (!sfxEnabled) return;
    const audio = new Audio(mp3Path);
    audio.volume = 0.4;
    
    audio.play()
        .then(() => {
            // Success
        })
        .catch(() => {
            synthCallback();
        });
}

function stopMusic() {
    if (currentMusic) {
        currentMusic.pause();
        currentMusic = null;
    }
}

function playBackgroundMusic(filename, loop = true) {
    stopMusic();
    if (!musicEnabled) return;

    currentMusic = new Audio(filename);
    currentMusic.loop = loop;
    currentMusic.volume = 0.3;

    currentMusic.addEventListener('error', () => {
        console.warn(`Music file '${filename}' could not be loaded. Music output is muted.`);
        currentMusic = null;
    });

    currentMusic.play().catch(err => {
        console.warn(`Autoplay blocked or '${filename}' load failed:`, err);
        currentMusic = null;
    });
}

function playMusicForLevel(levelNumber) {
    const filename = (levelNumber === 5) ? 'final.mp3' : `level${levelNumber}.mp3`;
    playBackgroundMusic(filename, true);
}


// Player Class Definition
class Player {
    constructor(id, planeData, initialX, initialY, playerJetElement, scoreDisplayElement, healthBarContainerElement, healthBarElement, gamepadIndex = null) {
        this.id = id;
        this.planeData = planeData;

        this.x = initialX;
        this.y = initialY;
        this.lives = planeData.initialHealth;
        this.maxLives = planeData.initialHealth;
        this.score = 0;
        
        // Shooting state properties (Toggle / Hold method)
        this.fireState = true; // Auto-firing default to On
        this.isHoldingFire = false;
        this.firePressTime = 0;
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

        this.weaponType;
        this.weaponActive = false;
        this.weaponEndTime = 0;

        this.shieldActive = false;
        this.shieldEndTime = 0;
        this.shieldHitPoints = 0;
        this.maxShieldHitPoints = 3;

        this.playerJetElement = playerJetElement;
        this.playerJetSVGContainer = this.playerJetElement.querySelector('svg');
        this.healthBarContainerElement = healthBarContainerElement;
        this.healthBarElement = healthBarElement;
        this.scoreDisplayElement = scoreDisplayElement;
        this.gamepadIndex = gamepadIndex;

        this.shieldElement = null;
        this.weaponIndicatorElement = null;

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
        const healthPercentage = (this.lives / this.maxLives) * 100;
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
            this.shieldHitPoints--;
            playPickupSound();
            if (this.shieldHitPoints <= 0) {
                this.deactivateShield();
                createOrbCollectedAnimation(this.x, this.y, 'shield');
            }
            return;
        }

        this.lives--;
        playDamageSound();
        this.updateHealthBarDisplay();
        this.playerJetElement.classList.add('damaged-flash');
        setTimeout(() => {
            this.playerJetElement.classList.remove('damaged-flash');
        }, 500);

        if (this.lives <= 0) {
            createPlayerDestroyedAnimation(this.x, this.y, this.playerJetSVGContainer);

            this.playerJetElement.style.display = 'none';
            this.scoreDisplayElement.style.display = 'none';
            this.healthBarContainerElement.style.display = 'none';
            
            this.fireState = false;
            this.isHoldingFire = false;
            
            if (this.id === 'player1') {
                touchInput.player1.joystickActive = false;
                touchInput.player1.fireActive = false;
            } else if (this.id === 'player2') {
                touchInput.player2.joystickActive = false;
                touchInput.player2.fireActive = false;
            }
        }

        let allPlayersDefeated = true;
        for (const p of players) {
            if (p.lives > 0) {
                allPlayersDefeated = false;
                break;
            }
        }
        if (allPlayersDefeated) {
            gameRunning = false;
            setTimeout(() => {
                gameOver();
            }, 1500);
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
        this.shieldHitPoints = this.maxShieldHitPoints;
        createOrbCollectedAnimation(orbX, orbY, 'shield');
        this.updatePlayerShieldVisual();
    }

    deactivateShield() {
        this.shieldActive = false;
        this.shieldHitPoints = 0;
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
        this.weaponIndicatorElement.style.background =
            (this.weaponType === 'triple') ? 'linear-gradient(to right, #ff00ff, #aa00aa)' :
            (this.weaponType === 'laser') ? 'linear-gradient(to right, #00ffff, #00aaaa)' :
            (this.weaponType === 'fast') ? 'linear-gradient(to right, #00ff00, #00aa00)' :
            (this.weaponType === 'piercing') ? 'linear-gradient(to right, #FF00FF, #CC00CC)' :
            (this.weaponType === 'burst') ? 'linear-gradient(to right, #FFFF00, #FFCC00)' :
            (this.weaponType === 'scatter') ? 'linear-gradient(to right, #FF00FF, #CC00FF)' :
            (this.weaponType === 'heatseeker') ? 'linear-gradient(to right, #FFA500, #FFD700)' :
            'gold';
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

// --- Fullscreen Functionality ---
function requestFullScreen() {
    const element = document.documentElement;
    if (element.requestFullscreen) {
        element.requestFullscreen();
    } else if (element.mozRequestFullScreen) {
        element.mozRequestFullScreen();
    } else if (element.webkitRequestFullscreen) {
        element.webkitRequestFullscreen();
    } else if (element.msRequestFullscreen) {
        element.msRequestFullscreen();
    }
}


// --- Game Initialization and Reset ---
function resetGame() {
    GAME_WIDTH = window.innerWidth;
    GAME_HEIGHT = window.innerHeight;

    gameContainer.querySelectorAll('.projectile, .enemy-projectile, .enemy-jet-wrapper, .star, .explosion-particle, .health-orb, .blue-orb, .weapon-orb, .orb-destroyed-particle, .orb-collected-animation, .blue-orb-collected-animation, .weapon-orb-collected-animation, .player-shield, .weapon-indicator, .player-destroyed-particle').forEach(el => el.remove());
    allProjectiles.length = 0;
    stars.length = 0;

    healthOrbs.length = 0;
    lastOrbSpawnTime = 0;
    blueOrbs.length = 0;
    lastBlueOrbSpawnTime = 0;
    weaponOrbs.length = 0;
    lastWeaponOrbSpawnTime = 0;

    players.length = 0;

    const p1PlaneData = selectedPlane1 || planesData.find(p => p.id === 'interceptor');
    const player1 = new Player(
        'player1',
        p1PlaneData,
        (numPlayers === 1 ? GAME_WIDTH / 2 : GAME_WIDTH / 3),
        GAME_HEIGHT - 80,
        document.getElementById('player-jet-wrapper1'),
        document.getElementById('score-display1'),
        document.getElementById('health-bar-container1'),
        document.getElementById('health-bar1'),
        0
    );
    players.push(player1);
    player1.playerJetElement.style.display = 'flex';
    player1.scoreDisplayElement.style.display = 'block';
    player1.healthBarContainerElement.style.display = 'block';

    if (numPlayers === 2) {
        const p2PlaneData = selectedPlane2 || planesData.find(p => p.id === 'interceptor');
        const player2 = new Player(
            'player2',
            p2PlaneData,
            (2 * GAME_WIDTH / 3),
            GAME_HEIGHT - 80,
            document.getElementById('player-jet-wrapper2'),
            document.getElementById('score-display2'),
            document.getElementById('health-bar-container2'),
            document.getElementById('health-bar2'),
            1
        );
        players.push(player2);
        player2.playerJetElement.style.display = 'flex';
        player2.scoreDisplayElement.style.display = 'block';
        player2.healthBarContainerElement.style.display = 'block';
    } else {
        document.getElementById('player-jet-wrapper2').style.display = 'none';
        document.getElementById('score-display2').style.display = 'none';
        document.getElementById('health-bar-container2').style.display = 'none';
    }

    if (window.currentLevelModule && typeof window.currentLevelModule.reset === 'function') {
        window.currentLevelModule.reset();
    }

    createStars();
    gameOverScreen.classList.remove('visible');
    gameFinishedScreen.classList.remove('visible');
    levelMessageOverlay.classList.remove('visible');

    currentLevel = 0;
    startLevel(1);
}

function startLevel(levelNumber) {
    levelTransitioning = true;
    gameRunning = false;
    cancelAnimationFrame(animationFrameId);

    currentLevel = levelNumber;

    gameContainer.querySelectorAll('.enemy-projectile, .enemy-jet-wrapper, .health-orb, .blue-orb, .weapon-orb').forEach(el => el.remove());
    healthOrbs.length = 0;
    blueOrbs.length = 0;
    weaponOrbs.length = 0;

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

    playMusicForLevel(currentLevel);

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
    playBackgroundMusic('gameover.mp3', false);
    let totalScore = 0;
    players.forEach(p => totalScore += p.score);
    finalScoreDisplay.textContent = `Final Score: ${totalScore}`;
    gameOverScreen.classList.add('visible');
    showTouchControls(false);
    setupGamepadNavigation([restartButton], 0);
}

function gameFinished() {
    gameRunning = false;
    cancelAnimationFrame(animationFrameId);
    playBackgroundMusic('finish.mp3', false); // Play once (false loop parameter)
    let totalScore = 0;
    players.forEach(p => totalScore += p.score);
    finalScoreFinishedDisplay.textContent = `Final Score: ${totalScore}`;
    gameFinishedScreen.classList.add('visible');
    showTouchControls(false);
    setupGamepadNavigation([playAgainButton], 0);
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
        if (player.playerJetElement.style.display !== 'none') {
            player.x = Math.max(player.playerJetElement.offsetWidth / 2, Math.min(GAME_WIDTH - player.playerJetElement.offsetWidth / 2, player.x));
            player.y = Math.max(player.playerJetElement.offsetHeight / 2, Math.min(GAME_HEIGHT - player.playerJetElement.offsetHeight / 2, player.y));
            player.updatePlayerElementPosition();
            player.updatePlayerShieldVisual();
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
        // Game Over / Game Finished Screen Navigation
        else if (gameOverScreen.classList.contains('visible') || gameFinishedScreen.classList.contains('visible')) {
            if (['Space', 'ShiftRight', 'Enter'].includes(e.code)) {
                selectCurrentButton();
                handledNav = true;
            }
        }

        if (handledNav) {
            lastGamepadNavigationTime = now;
            e.preventDefault();
            return;
        }
    }

    if (!gameRunning || levelTransitioning) return;

    // Player 1 controls (WASD or Gamepad 0 or Touch Left)
    if (players[0] && players[0].lives > 0) {
        if (['Space', 'KeyW', 'KeyA', 'KeyS', 'KeyD'].includes(e.code)) {
            e.preventDefault();
            if (e.code === 'Space') {
                if (!players[0].isHoldingFire) {
                    players[0].isHoldingFire = true;
                    players[0].firePressTime = now;
                }
            }
        }
    }
    // Player 2 controls (Arrows or Gamepad 1 or Touch Right)
    if (players[1] && players[1].lives > 0) {
        if (['ShiftRight', 'ArrowUp', 'ArrowLeft', 'ArrowDown', 'ArrowRight'].includes(e.code)) {
            e.preventDefault();
            if (e.code === 'ShiftRight') {
                if (!players[1].isHoldingFire) {
                    players[1].isHoldingFire = true;
                    players[1].firePressTime = now;
                }
            }
        }
    }
});

document.addEventListener('keyup', (e) => {
    keysPressed[e.code] = false;
    const now = performance.now();

    if (!gameRunning || levelTransitioning) return;

    if (players[0] && players[0].lives > 0) {
        if (e.code === 'Space') {
            if (players[0].isHoldingFire) {
                players[0].isHoldingFire = false;
                const duration = now - players[0].firePressTime;
                if (duration < 250) {
                    players[0].fireState = !players[0].fireState;
                }
            }
        }
    }
    if (players[1] && players[1].lives > 0) {
        if (e.code === 'ShiftRight') {
            if (players[1].isHoldingFire) {
                players[1].isHoldingFire = false;
                const duration = now - players[1].firePressTime;
                if (duration < 250) {
                    players[1].fireState = !players[1].fireState;
                }
            }
        }
    }
});

// Mouse wheel for plane selection
planeOptionsContainer.addEventListener('wheel', (e) => {
    if (planeSelectionScreen.classList.contains('visible')) {
        e.preventDefault();
        const now = performance.now();
        if (now - lastGamepadNavigationTime > GAMEPAD_NAV_COOLDOWN) {
            if (e.deltaY > 0) {
                navigateButtons(1);
            } else if (e.deltaY < 0) {
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
        if (keysPressed['KeyA'] || (gamepadXAxis < -gamepadThreshold) || (touchInput.player1.joystickActive && touchInput.player1.joystickCurrentX < -0.1)) inputX = -1;
        else if (keysPressed['KeyD'] || (gamepadXAxis > gamepadThreshold) || (touchInput.player1.joystickActive && touchInput.player1.joystickCurrentX > 0.1)) inputX = 1;

        if (keysPressed['KeyW'] || (gamepadYAxis < -gamepadThreshold) || (touchInput.player1.joystickActive && touchInput.player1.joystickCurrentY < -0.1)) inputY = -1;
        else if (keysPressed['KeyS'] || (gamepadYAxis > gamepadThreshold) || (touchInput.player1.joystickActive && touchInput.player1.joystickCurrentY > 0.1)) inputY = 1;
    } else if (player.id === 'player2') {
        if (keysPressed['ArrowLeft'] || (gamepadXAxis < -gamepadThreshold) || (touchInput.player2.joystickActive && touchInput.player2.joystickCurrentX < -0.1)) inputX = -1;
        else if (keysPressed['ArrowRight'] || (gamepadXAxis > gamepadThreshold) || (touchInput.player2.joystickActive && touchInput.player2.joystickCurrentX > 0.1)) inputX = 1;

        if (keysPressed['ArrowUp'] || (gamepadYAxis < -gamepadThreshold) || (touchInput.player2.joystickActive && touchInput.player2.joystickCurrentY < -0.1)) inputY = -1;
        else if (keysPressed['ArrowDown'] || (gamepadYAxis > gamepadThreshold) || (touchInput.player2.joystickActive && touchInput.player2.joystickCurrentY > 0.1)) inputY = 1;
    }

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

    playWeaponSound(player.weaponType); // Play weapon-specific custom sound with fallback

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
            speedX: 0,
            speedY: -HEATSEEKER_PROJECTILE_SPEED,
            styleClass: 'projectile-heatseeker-ball',
            type: 'heatseeker',
            currentAngle: -Math.PI / 2
        });
    }
    else {
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
            x: parseFloat(projectile.style.left),
            y: parseFloat(projectile.style.top),
            speedX: pC.speedX || 0,
            speedY: pC.speedY || -PLAYER_PROJECTILE_SPEED_Y,
            owner: player.id,
            piercing: pC.piercing || false,
            type: pC.type || 'standard',
            currentAngle: pC.currentAngle
        });
    });
}

function updateProjectiles(frameRateFactor) {
    for (let i = allProjectiles.length - 1; i >= 0; i--) {
        const p = allProjectiles[i];

        if (p.type === 'heatseeker') {
            let closestEnemy = null;
            let minDistanceSq = Infinity;

            if (window.currentLevelModule && window.currentLevelModule.activeEnemies) {
                for (const enemy of window.currentLevelModule.activeEnemies) {
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
                let dy = closestEnemy.y - p.y;

                const targetAngle = Math.atan2(dy, dx);
                let angleDiff = targetAngle - p.currentAngle;

                if (angleDiff > Math.PI) angleDiff -= 2 * Math.PI;
                if (angleDiff < -Math.PI) angleDiff += 2 * Math.PI;

                const maxTurn = MAX_HEATSEEKER_TURN_ANGLE_RAD * frameRateFactor;
                if (angleDiff > maxTurn) angleDiff = maxTurn;
                if (angleDiff < -maxTurn) angleDiff = -maxTurn;

                p.currentAngle += angleDiff;

                p.speedX = Math.cos(p.currentAngle) * HEATSEEKER_PROJECTILE_SPEED;
                p.speedY = Math.sin(p.currentAngle) * HEATSEEKER_PROJECTILE_SPEED;

            } else {
                if (Math.abs(p.currentAngle - (-Math.PI / 2)) > EPSILON * 10) {
                    let angleDiffToUp = (-Math.PI / 2) - p.currentAngle;
                    if (angleDiffToUp > Math.PI) angleDiffToUp -= 2 * Math.PI;
                    if (angleDiffToUp < -Math.PI) angleDiffToUp += 2 * Math.PI;

                    const maxTurn = MAX_HEATSEEKER_TURN_ANGLE_RAD * frameRateFactor;
                    p.currentAngle += Math.max(-maxTurn, Math.min(maxTurn, angleDiffToUp));
                }
                p.speedX = Math.cos(p.currentAngle) * HEATSEEKER_PROJECTILE_SPEED;
                p.speedY = Math.sin(p.currentAngle) * HEATSEEKER_PROJECTILE_SPEED;
            }

            p.x += p.speedX * frameRateFactor;
            p.y += p.speedY * frameRateFactor;

        } else {
            p.x += p.speedX * frameRateFactor;
            p.y += p.speedY * frameRateFactor;
        }

        p.element.style.left = `${p.x}px`;
        p.element.style.top = `${p.y}px`;

        if (p.y + p.element.offsetHeight < 0 || p.y > GAME_HEIGHT || p.x + p.element.offsetWidth < 0 || p.x > GAME_WIDTH) {
            p.element.remove();
            allProjectiles.splice(i, 1);
        }
    }
}

// --- Starfield ---
function createStars() {
    starsContainer.innerHTML = '';
    for (let i = 0; i < NUM_STARS; i++) {
        const star = document.createElement('div');
        star.classList.add('star');
        const size = Math.random() * (STAR_MAX_SIZE - STAR_MIN_SIZE) + STAR_MIN_SIZE;
        star.style.width = `${size}px`;
        star.style.height = `${size}px`;
        star.style.opacity = Math.random() * 0.8 + 0.2;
        star.x = Math.random() * GAME_WIDTH;
        star.y = Math.random() * GAME_HEIGHT;
        star.style.left = `${star.x}px`;
        star.style.top = `${star.y}px`;
        starsContainer.appendChild(star);
        stars.push({ element: star, x: star.x, y: star.y, size: size });
    }
}

// --- Starfield Update ---
function updateStars(frameRateFactor) {
    for (let i = 0; i < stars.length; i++) {
        const star = stars[i];
        star.y += STAR_SPEED * frameRateFactor;
        if (star.y > GAME_HEIGHT) {
            star.y = -star.size;
            star.x = Math.random() * GAME_WIDTH;
            star.element.style.left = `${star.x}px`;
        }
        star.element.style.top = `${star.y}px`;
    }
}

// --- Orb Functions (Health, Shield, Weapon) ---
function createOrbElement(orbData, classList, x, y, width, height) {
    const orb = document.createElement('div');
    orb.classList.add(...classList);
    orb.style.width = `${width}px`;
    orb.style.height = `${height}px`;
    orb.style.left = `${x - width / 2}px`;
    orb.style.top = `${y}px`;
    gameContainer.appendChild(orb);
    orbData.element = orb;
    return orb;
}

function spawnOrb(type) {
    if (!gameRunning || levelTransitioning) return;

    const x = Math.random() * (GAME_WIDTH - ORB_WIDTH) + ORB_WIDTH / 2;
    const y = -ORB_HEIGHT;

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

function updateOrbs(orbArray, frameRateFactor) {
    for (let i = orbArray.length - 1; i >= 0; i--) {
        const orb = orbArray[i];
        orb.y += orb.speed * frameRateFactor;
        orb.element.style.top = `${orb.y}px`;

        if (orb.y > GAME_HEIGHT) {
            orb.element.remove();
            orbArray.splice(i, 1);
        }
    }
}

function createOrbDestroyedAnimation(x, y, type) {
    const numParticles = 5;
    let particleColor = '#ffffff';
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

// Expanded player destroyed animation featuring grey debris, yellow/red scatter, and expanding smoke rings
function createPlayerDestroyedAnimation(centerX, centerY, svgContainer) {
    playExplosionSound();

    // Expansive smoke rings
    createExpandingSmokeRing(centerX, centerY, 18);
    setTimeout(() => createExpandingSmokeRing(centerX, centerY, 12), 150);

    // Yellow and Red scatter particles
    createScatterParticles(centerX, centerY, '#ffcc00'); // Yellow
    createScatterParticles(centerX, centerY, '#ff3300'); // Red

    const numParticles = 20;
    const colors = ['#FF00CC', '#00FFFF', '#8e2de2'];
    for (let i = 0; i < numParticles; i++) {
        const particle = document.createElement('div');
        particle.classList.add('player-destroyed-particle');
        particle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        particle.style.width = `${Math.random() * 8 + 4}px`;
        particle.style.height = particle.style.width;
        particle.style.boxShadow = `0 0 10px ${particle.style.backgroundColor}, 0 0 20px ${particle.style.backgroundColor}`;
        gameContainer.appendChild(particle);

        particle.style.left = `${centerX}px`;
        particle.style.top = `${centerY}px`;

        const angle = Math.random() * Math.PI * 2;
        const distance = Math.random() * 120 + 50;
        const targetX = centerX + Math.cos(angle) * distance;
        const targetY = centerY + Math.sin(angle) * distance;

        particle.style.transition = 'transform 1.2s cubic-bezier(0.1, 0.8, 0.3, 1), opacity 1.2s ease-out';

        requestAnimationFrame(() => {
            particle.style.transform = `translate(${targetX - centerX}px, ${targetY - centerY}px) scale(0.2)`;
            particle.style.opacity = '0';
        });

        setTimeout(() => {
            particle.remove();
        }, 1200);
    }

    // Flying grey debris chunks
    createGreyDebrisChunks(centerX, centerY, 8);
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
        if (player.lives <= 0) return;

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
                    playPickupSound();
                    if (orbGroup.type === 'health') {
                        if (player.lives < player.maxLives) {
                            player.lives = Math.min(player.maxLives, player.lives + 2); // Restores 2 health points instead of 1
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
                    playDamageSound();
                    if (!p.piercing) {
                        p.element.remove();
                        allProjectiles.splice(i, 1);
                        projectileRemoved = true;
                    }
                    createOrbDestroyedAnimation(orb.x, orb.y, orbGroup.type);
                    orb.element.remove();
                    orbGroup.array.splice(j, 1);
                    if (projectileRemoved) {
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
            (points, ownerId) => {
                const player = players.find(p => p.id === ownerId);
                if (player) {
                    player.score += points;
                    player.updateScoreDisplay();
                }
                // Check if this was a boss or elite
                if (points >= 1000) {
                    lastKilledBossPoints = points;
                }
            },
            (x, y) => {
                if (lastKilledBossPoints >= 1000) {
                    lastKilledBossPos = { x, y };
                } else {
                    createExplosionParticles(x, y);
                }
            }
        );

        // Enemy Projectile & Enemy vs. Player (shield check handled in loseLife)
        players.forEach(player => {
            if (player.lives <= 0) return;
            const playerRect = player.playerJetElement.getBoundingClientRect();
            window.currentLevelModule.checkCollisionsWithPlayer(
                playerRect,
                () => player.loseLife()
            );
        });


        // Check for boss defeat for level progression
        if (bossActive && window.currentLevelModule.isBossDefeated() && !bossDestructionPlaying) {
            bossDestructionPlaying = true;
            
            // Freeze game loop during spectacular explosion sequence
            gameRunning = false;
            cancelAnimationFrame(animationFrameId);
            stopMusic();

            const bx = lastKilledBossPos.x || GAME_WIDTH / 2;
            const by = lastKilledBossPos.y || GAME_HEIGHT * 0.25;
            const bp = lastKilledBossPoints || 1000;

            triggerBossEpicDestructionSequence(bx, by, bp, () => {
                bossDestructionPlaying = false;
                levelComplete();
            });
        }
    }
}

// --- Explosion Particles ---
function createExplosionParticles(centerX, centerY) {
    playExplosionSound();
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

// New scatter particles helper (Red and Yellow)
function createScatterParticles(x, y, color) {
    const numParticles = 12;
    for (let i = 0; i < numParticles; i++) {
        const p = document.createElement('div');
        p.style.position = 'absolute';
        p.style.width = `${Math.random() * 5 + 3}px`;
        p.style.height = p.style.width;
        p.style.borderRadius = '50%';
        p.style.backgroundColor = color;
        p.style.boxShadow = `0 0 8px ${color}, 0 0 15px ${color}`;
        p.style.pointerEvents = 'none';
        p.style.zIndex = '45';
        p.style.left = `${x}px`;
        p.style.top = `${y}px`;
        p.style.transition = 'transform 0.8s cubic-bezier(0.1, 0.8, 0.3, 1), opacity 0.8s ease-out';
        gameContainer.appendChild(p);
        
        const angle = Math.random() * Math.PI * 2;
        const dist = Math.random() * 80 + 30;
        const tx = x + Math.cos(angle) * dist;
        const ty = y + Math.sin(angle) * dist;
        
        requestAnimationFrame(() => {
            p.style.transform = `translate(${tx - x}px, ${ty - y}px) scale(0.2)`;
            p.style.opacity = '0';
        });
        setTimeout(() => p.remove(), 800);
    }
}

// New expanding smoke ring helper
function createExpandingSmokeRing(x, y, scale = 18) {
    const ring = document.createElement('div');
    ring.style.position = 'absolute';
    ring.style.width = '10px';
    ring.style.height = '10px';
    ring.style.borderRadius = '50%';
    ring.style.border = '8px solid rgba(150, 150, 150, 0.5)';
    ring.style.boxShadow = '0 0 20px rgba(150, 150, 150, 0.3)';
    ring.style.left = `${x}px`;
    ring.style.top = `${y}px`;
    ring.style.transform = 'translate(-50%, -50%) scale(1)';
    ring.style.pointerEvents = 'none';
    ring.style.zIndex = '44';
    ring.style.transition = 'transform 1.0s ease-out, opacity 1.0s ease-out, border-width 1.0s ease-out';
    gameContainer.appendChild(ring);
    
    requestAnimationFrame(() => {
        ring.style.transform = `translate(-50%, -50%) scale(${scale})`;
        ring.style.opacity = '0';
        ring.style.borderWidth = '1px';
    });
    setTimeout(() => ring.remove(), 1000);
}

// Grey flying debris chunks helper
function createGreyDebrisChunks(x, y, count) {
    const debrisPolygons = [
        'polygon(0% 0%, 100% 0%, 50% 100%)',
        'polygon(20% 0%, 80% 0%, 100% 100%, 0% 100%)',
        'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)',
        'polygon(0% 20%, 100% 0%, 80% 100%, 20% 80%)'
    ];
    for (let i = 0; i < count; i++) {
        const chunk = document.createElement('div');
        chunk.style.position = 'absolute';
        chunk.style.width = `${Math.random() * 15 + 15}px`;
        chunk.style.height = chunk.style.width;
        chunk.style.clipPath = debrisPolygons[i % debrisPolygons.length];
        chunk.style.background = 'linear-gradient(135deg, #707070, #303030)';
        chunk.style.border = '1px solid #a0a0a0';
        chunk.style.boxShadow = '0 0 10px rgba(255, 255, 255, 0.3)';
        chunk.style.pointerEvents = 'none';
        chunk.style.zIndex = '46';
        chunk.style.left = `${x}px`;
        chunk.style.top = `${y}px`;
        chunk.style.transition = 'transform 1.5s cubic-bezier(0.1, 0.8, 0.3, 1), opacity 1.5s ease-out';
        gameContainer.appendChild(chunk);
        
        const angle = Math.random() * Math.PI * 2;
        const dist = Math.random() * 150 + 80;
        const tx = x + Math.cos(angle) * dist;
        const ty = y + Math.sin(angle) * dist;
        const rotation = Math.random() * 720 - 360;
        
        requestAnimationFrame(() => {
            chunk.style.transform = `translate(${tx - x}px, ${ty - y}px) rotate(${rotation}deg) scale(0.5)`;
            chunk.style.opacity = '0';
        });
        setTimeout(() => chunk.remove(), 1500);
    }
}

// Heavy screen shake helper
function triggerScreenShake(intensity) {
    gameContainer.style.transform = `translate(${(Math.random() * 2 - 1) * intensity}px, ${(Math.random() * 2 - 1) * intensity}px)`;
    setTimeout(() => {
        gameContainer.style.transform = 'none';
    }, 50);
}

// Boss/Final Boss epic destruction sequence
function triggerBossEpicDestructionSequence(x, y, points, onCompleteCallback) {
    const isFinalBoss = (points >= 10000);
    const totalExplosions = isFinalBoss ? 15 : 3;
    const delayBetween = isFinalBoss ? 180 : 150;
    
    let count = 0;
    
    function nextExplosion() {
        if (count < totalExplosions) {
            const maxOffset = isFinalBoss ? 100 : 35;
            const offsetX = (Math.random() * 2 - 1) * maxOffset;
            const offsetY = (Math.random() * 2 - 1) * maxOffset;
            
            createExplosionParticles(x + offsetX, y + offsetY);
            playExplosionSound();
            
            createScatterParticles(x + offsetX, y + offsetY, '#ff3300');
            createScatterParticles(x + offsetX, y + offsetY, '#ffcc00');
            
            if (count % 2 === 0 || !isFinalBoss) {
                createExpandingSmokeRing(x + offsetX, y + offsetY, isFinalBoss ? 24 : 16);
            }
            
            triggerScreenShake(isFinalBoss ? 16 : 8);
            
            count++;
            setTimeout(nextExplosion, delayBetween);
        } else {
            createExplosionParticles(x, y);
            playExplosionSound();
            createExpandingSmokeRing(x, y, isFinalBoss ? 35 : 20);
            
            const numDebris = isFinalBoss ? 25 : 12;
            createGreyDebrisChunks(x, y, numDebris);
            
            setTimeout(() => {
                onCompleteCallback();
            }, 600);
        }
    }
    
    nextExplosion();
}


// --- Level Progression ---
function levelComplete() {
    gameRunning = false;
    cancelAnimationFrame(animationFrameId);
    stopMusic();
    levelTransitioning = true;

    gameContainer.querySelectorAll('.enemy-projectile, .enemy-jet-wrapper').forEach(el => el.remove());

    if (currentLevel < 5) {
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

    pollGamepads();

    players.forEach(player => {
        if (player.lives > 0) {
            updatePlayerPosition(player, frameRateFactor);

            let actualShotCooldown = player.shotCooldownMs;
            if (player.weaponType === 'fast') {
                actualShotCooldown = 75;
            } else if (player.weaponType === 'burst') {
                actualShotCooldown = 80;
            } else if (player.weaponType === 'heatseeker') {
                actualShotCooldown = 350;
            }

            const shouldShoot = player.fireState || player.isHoldingFire;

            if (shouldShoot && currentTime - player.lastShotTime > actualShotCooldown) {
                shootProjectile(player);
                player.lastShotTime = currentTime;
            }

            if (player.shieldActive) {
                if (currentTime > player.shieldEndTime) {
                    player.deactivateShield();
                } else {
                    player.updatePlayerShieldVisual();
                }
            }

            if (player.weaponActive) {
                if (currentTime > player.weaponEndTime) {
                    player.deactivateWeaponUpgrade();
                }
            }
        }
    });

    updateProjectiles(frameRateFactor);

    const activePlayerXRefs = players.filter(p => p.lives > 0).map(p => p.x);

    if (window.currentLevelModule) {
        window.currentLevelModule.updateEnemies(currentTime, frameRateFactor, activePlayerXRefs);
        window.currentLevelModule.updateEnemyProjectiles(frameRateFactor);
        bossActive = window.currentLevelModule.isBossLevel();
    }

    updateOrbs(healthOrbs, frameRateFactor);
    updateOrbs(blueOrbs, frameRateFactor);
    updateOrbs(weaponOrbs, frameRateFactor);

    checkCollisions(currentTime);

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
    planeOptionsContainer.innerHTML = '';
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

    if (selectedPlane1) {
        planeOptionsContainer.querySelector(`[data-plane-id="${selectedPlane1.id}"]`).classList.add('selected-p1');
    }
    if (selectedPlane2) {
        planeOptionsContainer.querySelector(`[data-plane-id="${selectedPlane2.id}"]`).classList.add('selected-p2');
    }
}

function selectPlane(planeId) {
    const planeData = planesData.find(plane => plane.id === planeId);
    if (!planeData) return;

    if (currentPlayerSelecting === 'P1') {
        if (selectedPlane1 && selectedPlane1.id === planeId) {
            planeOptionsContainer.querySelector(`[data-plane-id="${selectedPlane1.id}"]`).classList.remove('selected-p1');
            selectedPlane1 = null;
        } else if (selectedPlane2 && selectedPlane2.id === planeId && numPlayers === 2) {
            playerTurnMessage.textContent = `Player 2 has already chosen ${planeData.name}! Please choose a different fighter.`;
            setTimeout(() => {
                updatePlaneSelectionState();
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
        if (selectedPlane1 && selectedPlane1.id === planeId) {
            playerTurnMessage.textContent = `Player 1 has already chosen ${planeData.name}! Please choose a different fighter.`;
            setTimeout(() => {
                updatePlaneSelectionState();
            }, 2000);
            return;
        }

        if (selectedPlane2 && selectedPlane2.id === planeId) {
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
            setupGamepadNavigation([startGameButton], 0);
        } else {
            playerTurnMessage.textContent = `Player 1: Select your fighter.`;
            setupGamepadNavigation(Array.from(planeOptionsContainer.children), 0);
        }
    } else if (numPlayers === 2) {
        if (selectedPlane1 && selectedPlane2) {
            allPlayersSelected = true;
            playerTurnMessage.textContent = `Player 1: ${selectedPlane1.name}, Player 2: ${selectedPlane2.name}. Both players ready!`;
            setupGamepadNavigation([startGameButton], 0);
        } else if (selectedPlane1 && !selectedPlane2) {
            playerTurnMessage.textContent = `Player 1 selected: ${selectedPlane1.name}. Player 2: Select your fighter.`;
            currentPlayerSelecting = 'P2';
            setupGamepadNavigation(Array.from(planeOptionsContainer.children), 0);
        } else if (!selectedPlane1 && selectedPlane2) {
            playerTurnMessage.textContent = `Player 2 selected: ${selectedPlane2.name}. Player 1: Select your fighter.`;
            currentPlayerSelecting = 'P1';
            setupGamepadNavigation(Array.from(planeOptionsContainer.children), 0);
        } else {
            playerTurnMessage.textContent = `Player 1: Select your fighter.`;
            currentPlayerSelecting = 'P1';
            setupGamepadNavigation(Array.from(planeOptionsContainer.children), 0);
        }
    }

    startGameButton.disabled = !allPlayersSelected;
    if (allPlayersSelected) {
        setupGamepadNavigation([startGameButton], 0);
    } else if (currentNavigableElements[focusedButtonIndex] === startGameButton && startGameButton.disabled) {
        setupGamepadNavigation(Array.from(planeOptionsContainer.children), 0);
    }
}

function showPlaneSelection() {
    gameRunning = false;
    cancelAnimationFrame(animationFrameId);

    document.getElementById('player-jet-wrapper1').style.display = 'none';
    document.getElementById('player-jet-wrapper2').style.display = 'none';

    planeSelectionScreen.classList.add('visible');
    introScreen.style.display = 'none';
    selectedPlane1 = null;
    selectedPlane2 = null;
    currentPlayerSelecting = 'P1';
    renderPlaneSelection();
    updatePlaneSelectionState();
    showTouchControls(false);
}

startGameButton.addEventListener('click', () => {
    if (!startGameButton.disabled && (selectedPlane1 || numPlayers === 1)) {
        if (numPlayers === 2 && !selectedPlane2) {
            playerTurnMessage.textContent = 'Player 2 needs to select a fighter jet!';
            setTimeout(() => { updatePlaneSelectionState(); }, 2000);
            return;
        }
        planeSelectionScreen.classList.remove('visible');
        resetGame();
        showTouchControls(true);
    } else {
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
    playBackgroundMusic('intro.mp3', true);
    setupGamepadNavigation([onePlayerButton, twoPlayersButton], 0);
    initIntroWarpSpeed(); // Initialize space warp stars
}

onePlayerButton.addEventListener('click', () => {
    initAudio();
    numPlayers = 1;
    requestFullScreen();
    showPlaneSelection();
});

// Sound toggles
twoPlayersButton.addEventListener('click', () => {
    initAudio();
    numPlayers = 2;
    requestFullScreen();
    showPlaneSelection();
});

fxToggleButton.addEventListener('click', () => {
    initAudio();
    sfxEnabled = !sfxEnabled;
    fxToggleButton.textContent = `FX: ${sfxEnabled ? 'ON' : 'OFF'}`;
});

musicToggleButton.addEventListener('click', () => {
    initAudio();
    musicEnabled = !musicEnabled;
    musicToggleButton.textContent = `MUSIC: ${musicEnabled ? 'ON' : 'OFF'}`;
    if (!musicEnabled) {
        stopMusic();
    } else {
        if (gameRunning && currentLevel > 0) {
            playMusicForLevel(currentLevel);
        } else if (introScreen.style.display === 'flex') {
            playBackgroundMusic('intro.mp3', true);
        }
    }
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
    if (!gameRunning) {
        pollGamepads();
    }
});

window.addEventListener("gamepaddisconnected", (e) => {
    console.log("Gamepad disconnected from index %d: %s",
        e.gamepad.index, e.gamepad.id);
    delete gamepads[e.gamepad.index];
});

function setupGamepadNavigation(elements, defaultFocusIndex = 0) {
    currentNavigableElements.forEach(el => el.classList.remove('focused'));
    currentNavigableElements = elements;
    focusedButtonIndex = defaultFocusIndex;

    if (currentNavigableElements.length > 0 && focusedButtonIndex >= 0 && focusedButtonIndex < currentNavigableElements.length) {
        currentNavigableElements[focusedButtonIndex].classList.add('focused');
        if (planeSelectionScreen.classList.contains('visible') && currentNavigableElements[focusedButtonIndex].classList.contains('plane-card')) {
            currentNavigableElements[focusedButtonIndex].scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
    }
}

function navigateButtons(direction) {
    if (currentNavigableElements.length === 0) return;

    currentNavigableElements[focusedButtonIndex].classList.remove('focused');

    focusedButtonIndex += direction;
    if (focusedButtonIndex < 0) {
        focusedButtonIndex = currentNavigableElements.length - 1;
    } else if (focusedButtonIndex >= currentNavigableElements.length) {
        focusedButtonIndex = 0;
    }

    currentNavigableElements[focusedButtonIndex].classList.add('focused');
    if (planeSelectionScreen.classList.contains('visible') && currentNavigableElements[focusedButtonIndex].classList.contains('plane-card')) {
        currentNavigableElements[focusedButtonIndex].scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
}

function selectCurrentButton() {
    if (currentNavigableElements.length > 0 && focusedButtonIndex !== -1) {
        const elementToClick = currentNavigableElements[focusedButtonIndex];
        if (!elementToClick.disabled) {
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
            gamepads[gp.index] = gp;

            if (gameRunning) {
                const player = players.find(p => p.gamepadIndex === gp.index);
                if (player && player.lives > 0) {
                    const fireButton = gp.buttons[0];
                    if (fireButton && fireButton.pressed) {
                        if (!player.isHoldingFire) {
                            player.isHoldingFire = true;
                            player.firePressTime = now;
                        }
                    } else {
                        if (player.isHoldingFire) {
                            player.isHoldingFire = false;
                            const duration = now - player.firePressTime;
                            if (duration < 250) {
                                player.fireState = !player.fireState;
                            }
                        }
                    }
                }
            } else {
                if (i !== 0) continue;

                const xAxis = gp.axes[0];
                const yAxis = gp.axes[1];
                const dpadUp = gp.buttons[12];
                const dpadDown = gp.buttons[13];
                const dpadLeft = gp.buttons[14];
                const dpadRight = gp.buttons[15];
                const selectButton = gp.buttons[0];

                if (now - lastGamepadNavigationTime > GAMEPAD_NAV_COOLDOWN) {
                    if (dpadUp && dpadUp.pressed || yAxis < -GAMEPAD_AXIS_THRESHOLD) {
                        navigateButtons(-1);
                        navigated = true;
                    } else if (dpadDown && dpadDown.pressed || yAxis > GAMEPAD_AXIS_THRESHOLD) {
                        navigateButtons(1);
                        navigated = true;
                    } else if (dpadLeft && dpadLeft.pressed || xAxis < -GAMEPAD_AXIS_THRESHOLD) {
                        navigateButtons(-1);
                        navigated = true;
                    } else if (dpadRight && dpadRight.pressed || xAxis > GAMEPAD_AXIS_THRESHOLD) {
                        navigateButtons(1);
                        navigated = true;
                    }

                    if (navigated) {
                        lastGamepadNavigationTime = now;
                    }
                }
                if (selectButton && selectButton.pressed && (now - lastGamepadNavigationTime > GAMEPAD_NAV_COOLDOWN)) {
                    selectCurrentButton();
                    lastGamepadNavigationTime = now;
                }
            }
        }
    }
}


// --- Touch Screen Controls ---
function showTouchControls(visible) {
    if (visible) {
        touchControlsContainer.classList.add('visible');
        if (numPlayers === 1) {
            touchJoystickLeftBase.classList.remove('visible');
            touchJoystickRightBase.classList.add('visible');
            touchFireLeft.classList.add('visible');
            touchFireRight.classList.remove('visible');

            touchFireLeft.style.left = '40px';
            touchJoystickRightBase.style.right = '40px';
        } else {
            touchJoystickLeftBase.classList.add('visible');
            touchJoystickRightBase.classList.add('visible');
            touchFireLeft.classList.add('visible');
            touchFireRight.classList.add('visible');

            touchJoystickLeftBase.style.left = '30px';
            touchFireLeft.style.left = '170px';
            touchJoystickRightBase.style.right = '30px';
            touchFireRight.style.right = '170px';
        }
    } else {
        touchControlsContainer.classList.remove('visible');
        touchJoystickLeftBase.classList.remove('visible');
        touchFireLeft.classList.remove('visible');
        touchJoystickRightBase.classList.remove('visible');
        touchFireRight.classList.remove('visible');
    }
}

touchControlsContainer.addEventListener('touchstart', (e) => {
    initAudio();
    handleTouchStart(e);
});
touchControlsContainer.addEventListener('touchmove', handleTouchMove);
touchControlsContainer.addEventListener('touchend', handleTouchEnd);
touchControlsContainer.addEventListener('touchcancel', handleTouchEnd);

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
    e.preventDefault();

    for (let i = 0; i < e.changedTouches.length; i++) {
        const touch = e.changedTouches[i];
        const touchPos = getTouchPosition(touch);

        if (numPlayers === 1) {
            const joystickRightRect = touchJoystickRightBase.getBoundingClientRect();
            const fireLeftRect = touchFireLeft.getBoundingClientRect();

            if (touchPos.x >= GAME_WIDTH / 2 && players[0] && players[0].lives > 0) {
                if (checkCollision({left: touchPos.x, right: touchPos.x + 1, top: touchPos.y, bottom: touchPos.y + 1}, joystickRightRect)) {
                    touchInput.player1.joystickActive = true;
                    touchInput.player1.joystickStartX = joystickRightRect.left + joystickRightRect.width / 2;
                    touchInput.player1.joystickStartY = joystickRightRect.top + joystickRightRect.height / 2;
                    touchInput.player1.touchId = touch.identifier;
                    updateJoystickHandlePosition(touchJoystickRightHandle, touchInput.player1, touchPos);
                }
            } else if (touchPos.x < GAME_WIDTH / 2 && players[0] && players[0].lives > 0) {
                if (checkCollision({left: touchPos.x, right: touchPos.x + 1, top: touchPos.y, bottom: touchPos.y + 1}, fireLeftRect)) {
                    if (!players[0].isHoldingFire) {
                        players[0].isHoldingFire = true;
                        players[0].firePressTime = performance.now();
                    }
                    touchFireLeft.classList.add('active');
                    touchInput.player1.fireActive = true;
                    touchInput.player1.touchId = touch.identifier;
                }
            }
        } else if (numPlayers === 2) {
            if (touchPos.x < GAME_WIDTH / 2 && players[0] && players[0].lives > 0) {
                const joystickLeftRect = touchJoystickLeftBase.getBoundingClientRect();
                const fireLeftRect = touchFireLeft.getBoundingClientRect();

                if (checkCollision({left: touchPos.x, right: touchPos.x + 1, top: touchPos.y, bottom: touchPos.y + 1}, joystickLeftRect)) {
                    touchInput.player1.joystickActive = true;
                    touchInput.player1.joystickStartX = joystickLeftRect.left + joystickLeftRect.width / 2;
                    touchInput.player1.joystickStartY = joystickLeftRect.top + joystickLeftRect.height / 2;
                    touchInput.player1.touchId = touch.identifier;
                    updateJoystickHandlePosition(touchJoystickLeftHandle, touchInput.player1, touchPos);
                }
                else if (checkCollision({left: touchPos.x, right: touchPos.x + 1, top: touchPos.y, bottom: touchPos.y + 1}, fireLeftRect)) {
                    if (!players[0].isHoldingFire) {
                        players[0].isHoldingFire = true;
                        players[0].firePressTime = performance.now();
                    }
                    touchFireLeft.classList.add('active');
                    touchInput.player1.fireActive = true;
                    touchInput.player1.touchId = touch.identifier;
                }
            }

            if (touchPos.x >= GAME_WIDTH / 2 && players[1] && players[1].lives > 0) {
                const joystickRightRect = touchJoystickRightBase.getBoundingClientRect();
                const fireRightRect = touchFireRight.getBoundingClientRect();

                if (checkCollision({left: touchPos.x, right: touchPos.x + 1, top: touchPos.y, bottom: touchPos.y + 1}, joystickRightRect)) {
                    touchInput.player2.joystickActive = true;
                    touchInput.player2.joystickStartX = joystickRightRect.left + joystickRightRect.width / 2;
                    touchInput.player2.joystickStartY = joystickRightRect.top + joystickRightRect.height / 2;
                    touchInput.player2.touchId = touch.identifier;
                    updateJoystickHandlePosition(touchJoystickRightHandle, touchInput.player2, touchPos);
                }
                else if (checkCollision({left: touchPos.x, right: touchPos.x + 1, top: touchPos.y, bottom: touchPos.y + 1}, fireRightRect)) {
                    if (!players[1].isHoldingFire) {
                        players[1].isHoldingFire = true;
                        players[1].firePressTime = performance.now();
                    }
                    touchFireRight.classList.add('active');
                    touchInput.player2.fireActive = true;
                    touchInput.player2.touchId = touch.identifier;
                }
            }
        }
    }
}

function handleTouchMove(e) {
    e.preventDefault();

    for (let i = 0; i < e.changedTouches.length; i++) {
        const touch = e.changedTouches[i];
        const touchPos = getTouchPosition(touch);

        if (touchInput.player1.joystickActive && touch.identifier === touchInput.player1.touchId) {
            if (numPlayers === 1) {
                updateJoystickHandlePosition(touchJoystickRightHandle, touchInput.player1, touchPos);
            } else {
                updateJoystickHandlePosition(touchJoystickLeftHandle, touchInput.player1, touchPos);
            }
        }
        if (touchInput.player2.joystickActive && touch.identifier === touchInput.player2.touchId) {
            updateJoystickHandlePosition(touchJoystickRightHandle, touchInput.player2, touchPos);
        }
    }
}

function handleTouchEnd(e) {
    e.preventDefault();
    const now = performance.now();

    for (let i = 0; i < e.changedTouches.length; i++) {
        const touch = e.changedTouches[i];

        if (touchInput.player1.joystickActive && touch.identifier === touchInput.player1.touchId) {
            touchInput.player1.joystickActive = false;
            touchInput.player1.joystickCurrentX = 0;
            touchInput.player1.joystickCurrentY = 0;
            if (numPlayers === 1) {
                touchJoystickRightHandle.style.left = '50%';
                touchJoystickRightHandle.style.top = '50%';
            } else {
                touchJoystickLeftHandle.style.left = '50%';
                touchJoystickLeftHandle.style.top = '50%';
            }
            touchInput.player1.touchId = null;
        }
        if (touchInput.player1.fireActive && touch.identifier === touchInput.player1.touchId) {
            if (players[0]) {
                if (players[0].isHoldingFire) {
                    players[0].isHoldingFire = false;
                    const duration = now - players[0].firePressTime;
                    if (duration < 250) {
                        players[0].fireState = !players[0].fireState;
                    }
                }
            }
            touchFireLeft.classList.remove('active');
            touchInput.player1.fireActive = false;
            touchInput.player1.touchId = null;
        }

        if (touchInput.player2.joystickActive && touch.identifier === touchInput.player2.touchId) {
            touchInput.player2.joystickActive = false;
            touchInput.player2.joystickCurrentX = 0;
            touchInput.player2.joystickCurrentY = 0;
            touchJoystickRightHandle.style.left = '50%';
            touchJoystickRightHandle.style.top = '50%';
            touchInput.player2.touchId = null;
        }
        if (touchInput.player2.fireActive && touch.identifier === touchInput.player2.touchId) {
            if (players[1]) {
                if (players[1].isHoldingFire) {
                    players[1].isHoldingFire = false;
                    const duration = now - players[1].firePressTime;
                    if (duration < 250) {
                        players[1].fireState = !players[1].fireState;
                    }
                }
            }
            touchFireRight.classList.remove('active');
            touchInput.player2.fireActive = false;
            touchInput.player2.touchId = null;
        }
    }
}

function updateJoystickHandlePosition(handleElement, playerTouchInput, currentTouchPos) {
    const joystickBaseRect = handleElement.parentElement.getBoundingClientRect();

    const centerX = joystickBaseRect.left + joystickBaseRect.width / 2;
    const centerY = joystickBaseRect.top + joystickBaseRect.height / 2;

    let deltaX = currentTouchPos.x - centerX;
    let deltaY = currentTouchPos.y - centerY;

    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

    if (distance > JOYSTICK_MAX_DISTANCE) {
        const angle = Math.atan2(deltaY, deltaX);
        deltaX = Math.cos(angle) * JOYSTICK_MAX_DISTANCE;
        deltaY = Math.sin(angle) * JOYSTICK_MAX_DISTANCE;
    }

    handleElement.style.left = `${50 + (deltaX / joystickBaseRect.width) * 100}%`;
    handleElement.style.top = `${50 + (deltaY / joystickBaseRect.height) * 100}%`;

    playerTouchInput.joystickCurrentX = deltaX / JOYSTICK_MAX_DISTANCE;
    playerTouchInput.joystickCurrentY = deltaY / JOYSTICK_MAX_DISTANCE;
}

// --- Plane Selection Touch Swiping ---
let planeSelectionTouchStartX = 0;
let planeSelectionTouchStartY = 0;
let planeSelectionTouchStartTime = 0;

function handlePlaneSelectionTouchStart(e) {
    if (planeSelectionScreen.classList.contains('visible') && e.touches.length === 1) {
        planeSelectionTouchStartX = e.touches[0].clientX;
        planeSelectionTouchStartY = e.touches[0].clientY;
        planeSelectionTouchStartTime = performance.now();
    }
}

function handlePlaneSelectionTouchEnd(e) {
    if (!planeSelectionScreen.classList.contains('visible') || e.changedTouches.length !== 1) {
        return;
    }

    const now = performance.now();
    if (now - lastGamepadNavigationTime < GAMEPAD_NAV_COOLDOWN) {
        return;
    }

    const touchEndX = e.changedTouches[0].clientX;
    const touchEndY = e.changedTouches[0].clientY;
    const touchEndTime = performance.now();
    const deltaX = touchEndX - planeSelectionTouchStartX;
    const deltaY = touchEndY - planeSelectionTouchStartY;
    const deltaTime = touchEndTime - planeSelectionTouchStartTime;

    const isHorizontalSwipe = Math.abs(deltaX) > SWIPE_THRESHOLD && Math.abs(deltaX) > Math.abs(deltaY) && deltaTime < 300;
    const isTap = Math.abs(deltaX) <= SWIPE_THRESHOLD && Math.abs(deltaY) <= SWIPE_THRESHOLD && deltaTime < 300;

    if (isHorizontalSwipe) {
        if (deltaX < 0) {
            navigateButtons(1);
        } else {
            navigateButtons(-1);
        }
        lastGamepadNavigationTime = now;
        e.preventDefault();
    } else if (isTap) {
        const touchedElement = document.elementFromPoint(e.changedTouches[0].clientX, e.changedTouches[0].clientY);
        let targetCard = null;

        let currentElement = touchedElement;
        while (currentElement && currentElement !== planeOptionsContainer) {
            if (currentElement.classList.contains('plane-card')) {
                targetCard = currentElement;
                break;
            }
            currentElement = currentElement.parentElement;
        }

        if (targetCard) {
            const planeId = targetCard.dataset.planeId;
            selectPlane(planeId);
            lastGamepadNavigationTime = now;
            e.preventDefault();
        } else if (touchedElement === startGameButton && !startGameButton.disabled) {
            startGameButton.click();
            lastGamepadNavigationTime = now;
            e.preventDefault();
        }
    }
}

// --- Space Warp Starfield effect for Intro Screen ---
function initIntroWarpSpeed() {
    if (!introCanvas) {
        introCanvas = document.createElement('canvas');
        introCanvas.id = 'intro-warp-canvas';
        introCanvas.style.position = 'absolute';
        introCanvas.style.top = '0';
        introCanvas.style.left = '0';
        introCanvas.style.width = '100%';
        introCanvas.style.height = '100%';
        introCanvas.style.zIndex = '-1'; // Behind everything on intro screen
        introCanvas.style.pointerEvents = 'none';
        introScreen.appendChild(introCanvas);
        
        window.addEventListener('resize', resizeIntroCanvas);
    }
    resizeIntroCanvas();
    
    introWarpStars = [];
    for (let i = 0; i < NUM_INTRO_WARP_STARS; i++) {
        introWarpStars.push({
            x: Math.random() * introCanvas.width - introCanvas.width / 2,
            y: Math.random() * introCanvas.height - introCanvas.height / 2,
            z: Math.random() * 1000
        });
    }
    
    if (introWarpAnimationId) {
        cancelAnimationFrame(introWarpAnimationId);
    }
    animateIntroWarp();
}

function resizeIntroCanvas() {
    if (introCanvas) {
        introCanvas.width = window.innerWidth;
        introCanvas.height = window.innerHeight;
    }
}

function animateIntroWarp() {
    if (introScreen.style.display !== 'flex') {
        if (introWarpAnimationId) {
            cancelAnimationFrame(introWarpAnimationId);
            introWarpAnimationId = null;
        }
        return;
    }

    introCtx = introCanvas.getContext('2d');
    introCtx.fillStyle = 'rgba(26, 0, 51, 0.2)'; // Dark purple space trail
    introCtx.fillRect(0, 0, introCanvas.width, introCanvas.height);

    const centerX = introCanvas.width / 2;
    const centerY = introCanvas.height / 2;

    for (let i = 0; i < introWarpStars.length; i++) {
        const star = introWarpStars[i];
        
        star.z -= 15; // Velocity forward into space

        if (star.z <= 0) {
            star.x = Math.random() * introCanvas.width - introCanvas.width / 2;
            star.y = Math.random() * introCanvas.height - introCanvas.height / 2;
            star.z = 1000;
        }

        const k = 128 / star.z;
        const px = star.x * k + centerX;
        const py = star.y * k + centerY;

        if (px < 0 || px > introCanvas.width || py < 0 || py > introCanvas.height) {
            star.x = Math.random() * introCanvas.width - introCanvas.width / 2;
            star.y = Math.random() * introCanvas.height - introCanvas.height / 2;
            star.z = 1000;
            continue;
        }

        const nextK = 128 / (star.z + 30);
        const prevX = star.x * nextK + centerX;
        const prevY = star.y * nextK + centerY;

        const size = (1 - star.z / 1000) * 3;
        introCtx.beginPath();
        introCtx.moveTo(px, py);
        introCtx.lineTo(prevX, prevY);
        
        const gradient = introCtx.createLinearGradient(px, py, prevX, prevY);
        gradient.addColorStop(0, 'rgba(255, 0, 204, 0.9)'); // Synthwave Magenta
        gradient.addColorStop(1, 'rgba(0, 255, 255, 0.2)'); // Synthwave Cyan
        introCtx.strokeStyle = gradient;
        introCtx.lineWidth = size;
        introCtx.stroke();
    }

    introWarpAnimationId = requestAnimationFrame(animateIntroWarp);
}

// Inject visual enhancements like sparkle particles and pulsating neon text styles
function injectVisualUpgradeStyles() {
    const style = document.createElement('style');
    style.innerHTML = `
        @keyframes sparkle-flicker {
            0%, 100% { opacity: 0.1; transform: scale(0.6) rotate(0deg); }
            50% { opacity: 1; transform: scale(1.3) rotate(180deg); }
        }
        .sparkle-particle {
            position: absolute;
            border-radius: 50%;
            pointer-events: none;
            z-index: 10;
            animation: sparkle-flicker 1.5s infinite ease-in-out;
        }
        @keyframes textGlowPulse {
            0% { text-shadow: 0 0 5px #00ffff, 0 0 10px #ff00cc; }
            50% { text-shadow: 0 0 20px #00ffff, 0 0 35px #ff00cc, 0 0 50px #00ff00; }
            100% { text-shadow: 0 0 5px #00ffff, 0 0 10px #ff00cc; }
        }
        #intro-screen h1, #game-over-screen p:first-child, #game-finished-screen p:first-child {
            animation: textGlowPulse 2.5s infinite ease-in-out !important;
            letter-spacing: 2px;
        }
        .game-overlay button, #intro-screen button, #plane-selection-screen button {
            border-radius: 8px !important;
            transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275) !important;
            background-color: #1a0033 !important;
            color: #00ffff !important;
            border: 3px solid #ff00cc !important;
            box-shadow: 0 0 15px rgba(255, 0, 204, 0.4), inset 0 0 10px rgba(0, 255, 255, 0.2) !important;
        }
        .game-overlay button:hover, #intro-screen button:hover, #plane-selection-screen button:hover,
        .game-overlay button.focused, #intro-screen button.focused, #plane-selection-screen button.focused {
            transform: scale(1.1) !important;
            border-color: #00ff00 !important;
            box-shadow: 0 0 25px rgba(0, 255, 0, 0.8), inset 0 0 15px rgba(0, 255, 255, 0.5) !important;
            color: #ffffff !important;
            text-shadow: 0 0 5px #00ff00 !important;
        }
        .game-overlay, #intro-screen, #plane-selection-screen {
            background: radial-gradient(circle at center, #150030 0%, #000010 100%) !important;
        }
    `;
    document.head.appendChild(style);
}

function createMenuSparkles() {
    const sparkleCount = 15;
    const screens = [introScreen, gameOverScreen, gameFinishedScreen];
    
    screens.forEach(screen => {
        for (let i = 0; i < sparkleCount; i++) {
            const sparkle = document.createElement('div');
            sparkle.classList.add('sparkle-particle');
            sparkle.style.left = `${Math.random() * 100}%`;
            sparkle.style.top = `${Math.random() * 100}%`;
            sparkle.style.width = `${Math.random() * 6 + 3}px`;
            sparkle.style.height = sparkle.style.width;
            sparkle.style.animationDelay = `${Math.random() * 2}s`;
            
            const colors = ['rgba(0, 255, 255, 0.7)', 'rgba(255, 0, 204, 0.7)', 'rgba(255, 255, 255, 0.9)', 'rgba(255, 223, 0, 0.8)'];
            sparkle.style.background = colors[Math.floor(Math.random() * colors.length)];
            sparkle.style.boxShadow = `0 0 10px ${sparkle.style.background}`;
            screen.appendChild(sparkle);
        }
    });
}


// Initial setup: Show intro screen first
window.onload = () => {
    injectVisualUpgradeStyles();
    createMenuSparkles();
    showIntroScreen();
    touchControlsContainer.style.opacity = touchOpacitySlider.value;
    gamepadPollInterval = setInterval(pollGamepads, 1000 / 60);
};
