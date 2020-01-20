//Define all globals here
window.myFont = null;

window.VIEW_TUTORIAL = 0;
window.VIEW_GAME = 1;

window.STATE_NONE = 0;
window.STATE_WIN = 1;
window.STATE_LOSE = 2;

window.currentView = VIEW_TUTORIAL;
window.endState = STATE_NONE;

window.textColor = Koji.config.settings.textColor;

//===Game objects
window.floatingTexts = [];
window.particles = [];
window.obstacles = [];
window.player = null;
window.guide = null;
window.backgroundLayers = [];
window.collectibles = [];
window.ground = null;

//===Score data
window.score = 0;
window.scoreGain = 1;
window.scoreAnimTimer = 1;

//===Images
window.imgBackground = [];
window.imgParticle = null;
window.imgWinParticle = [];
window.imgGuide = null;
window.imgObstacle = [];
window.imgPlayer = null;
window.imgCollectible = null;
window.imgPowerup = null;
window.imgGroundTile = null;
window.imgPlayerPowerup = null;

//===Audio
window.sndMusic = null;
window.sndTap = null;
window.sndGameOver = null;

//===Size stuff
window.objSize = 30;
window.gameSize = 18;

window.isMobile = false;
window.isTouching = false;

//Timers
window.gameTimer = null;
window.gameLength = null;
window.startCountdown = null;
window.countdownAnimTimer = 0;
window.countdownInterval = 1;
window.timeUpTimer = null;
window.timeUpDuration = 0.5;
window.fireworkInterval = 0.5;
window.fireworkTimer = 0;

window.hasGameEnded = false;
window.canTransition = false;

window.goodBadRatio = 75;
window.averageSpawnPeriod = null;
window.spawnTimer = 0.5;

window.timeUntilAbleToTransition = 0.5;
window.backgroundSpeedFactorMax = 0.25;

window.groundLevel = null;

window.globalSpeed = null;
window.globalSpeedModifier = 1;
window.globalSizeMod = 3;
window.groundSizeMod = 5;

export default function preload() {
    loadGoogleFont();
    loadImages();
    loadSounds();
    loadSettings();
}

function loadImages() {
    imgParticle = loadImage(Koji.config.settings.particle);
    imgGuide = loadImage(Koji.config.settings.guide);
    imgPlayer = loadImage(Koji.config.settings.player);
    imgPlayerPowerup = loadImage(Koji.config.settings.playerPowerup);
    imgGroundTile = loadImage(Koji.config.settings.ground);
    imgCollectible = loadImage(Koji.config.settings.collectible);
    imgPowerup = loadImage(Koji.config.settings.powerup);
     
     for (let i = 0; i < Koji.config.settings.obstacle.length; i++) {
        imgObstacle[i] = loadImage(Koji.config.settings.obstacle[i]);
    }

    for (let i = 0; i < Koji.config.settings.winParticles.length; i++) {
        imgWinParticle[i] = loadImage(Koji.config.settings.winParticles[i]);
    }

    for (let i = 0; i < Koji.config.settings.background.length; i++) {
        imgBackground[i] = loadImage(Koji.config.settings.background[i]);
    }
}

function loadSounds() {
    if (Koji.config.settings.tap) sndTap = loadSound(Koji.config.settings.tap);
    if (Koji.config.settings.gameOver) sndGameOver = loadSound(Koji.config.settings.gameOver);
    if (Koji.config.settings.backgroundMusic) sndMusic = loadSound(Koji.config.settings.backgroundMusic);
}

function loadSettings() {
    scoreGain = Koji.config.settings.scoreGain;
    gameLength = Koji.config.settings.gameLength;
    gameTimer = gameLength;
    timeUpTimer = timeUpDuration;
    averageSpawnPeriod = Koji.config.settings.averageSpawnPeriod;
}

function loadGoogleFont() {
    let link = document.createElement('link');
    link.href = "https://fonts.googleapis.com/css?family=" + Koji.config.general.fontFamily.replace(" ", "+");
    link.rel = 'stylesheet';
    document.head.appendChild(link);
    myFont = Koji.config.general.fontFamily;
}
