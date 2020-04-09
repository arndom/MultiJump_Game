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
window.playerDeath = null;
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
window.imgCollectible = [];
window.imgPowerup = null;
window.imgGroundTile = null;
window.imgPlayerPowerup = null;
window.imgLife = null;

//===Audio
window.sndMusic = null;
window.sndJump = null;
window.sndGameOver = null;
window.sndCollect = null;
window.sndPowerup = null;

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

window.startingLives = null;
window.lives = null;

export default function preload() {
    loadGoogleFont();
    loadImages();
    loadSounds();
    loadSettings();
}

function loadImages() {
    imgParticle = loadImage(`${Koji.config.settings.particle}?fit=max&h=40&w=40`);
    imgGuide = loadImage(`${Koji.config.settings.guide}?fit=max&h=128&w=128`);
    imgPlayer = loadImage(`${Koji.config.settings.player}?fit=max&h=128&w=128`);
    imgPlayerPowerup = loadImage(`${Koji.config.settings.playerPowerup}?fit=max&h=128&w=128`);
    imgGroundTile = loadImage(`${Koji.config.settings.ground}?fit=max&h=128&w=128`);
    imgPowerup = loadImage(`${Koji.config.settings.powerup}?fit=max&h=128&w=128`);
    imgLife = loadImage(`${Koji.config.settings.lifeIcon}?fit=max&h=40&w=40`);
    for (let i = 0; i < Koji.config.settings.obstacle.length; i++) imgObstacle[i] = loadImage(`${Koji.config.settings.obstacle[i]}?fit=max&h=128&w=128`);
    for (let i = 0; i < Koji.config.settings.winParticles.length; i++) imgWinParticle[i] = loadImage(`${Koji.config.settings.winParticles[i]}?fit=max&h=40&w=40`);
    for (let i = 0; i < Koji.config.settings.collectible.length; i++) imgCollectible[i] = loadImage(`${Koji.config.settings.collectible[i]}?fit=max&h=128&w=128`);


    for (let i = 0; i < Koji.config.settings.background.length; i++) {
        imgBackground[i] = loadImage(Koji.config.settings.background[i]);
    }
}

function loadSounds() {
    if (Koji.config.settings.jump) sndJump = loadSound(Koji.config.settings.jump);
    if (Koji.config.settings.gameOver) sndGameOver = loadSound(Koji.config.settings.gameOver);
    if (Koji.config.settings.collect) sndCollect = loadSound(Koji.config.settings.collect);
    if (Koji.config.settings.powerupSound) sndPowerup = loadSound(Koji.config.settings.powerupSound);
    if (Koji.config.settings.backgroundMusic) sndMusic = loadSound(Koji.config.settings.backgroundMusic);
}

function loadSettings() {
    scoreGain = Koji.config.settings.scoreGain;
    gameLength = Koji.config.settings.gameLength;
    gameTimer = gameLength;
    timeUpTimer = timeUpDuration;
    averageSpawnPeriod = Koji.config.settings.averageSpawnPeriod;
    startingLives = Koji.config.settings.lives;
    lives = startingLives;
    backgroundSpeedFactorMax = Koji.config.settings.backgroundSpeed;

}

function loadGoogleFont() {
    const fontFamily = Koji.config.general.fontFamily.family;
    const link = document.createElement('link');
    link.href = "https://fonts.googleapis.com/css?family=" + fontFamily.replace(" ", "+");
    link.rel = 'stylesheet';
    document.head.appendChild(link);
    myFont = fontFamily;
}
