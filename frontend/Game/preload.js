//Define all globals here

window.myFont = null; //The font we'll use throughout the app

//===Game objects
//Declare game objects here like player, enemies etc
window.floatingTexts = [];
window.particles = [];
window.tapObjects = [];


//===Score data
window.score = 0;
window.scoreGain = 1;
window.scoreAnimTimer = 1;

//===Data taken from Game Settings
window.startingLives = 1;
window.lives = 1;

//===Images
window.imgBackground = null;
window.imgParticle = null;
window.imgParticleGood = null;
window.imgParticleBad = null;
window.imgGood = [];
window.imgBad = [];
window.imgGuide = null;

//===Audio
window.sndMusic = null;
window.sndTapGood = null;
window.sndTapBad = null;

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
window.timeUpDuration = null;

window.canLoop = false;

window.TYPE_GOOD = 0;
window.TYPE_BAD = 1;

window.goodBadRatio = 75;
window.averageSpawnPeriod = null;
window.spawnTimer = 0.5;

export default function preload() {
    loadGoogleFont();

    //===Load images
    imgParticle = loadImage(Koji.config.images.particle);
    imgParticleGood = loadImage(Koji.config.images.particleGood);
    imgParticleBad = loadImage(Koji.config.images.particleBad);
    imgGuide = loadImage(Koji.config.images.guide);

    for (let i = 0; i < Koji.config.images.goodObject.length; i++) {
        imgGood[i] = loadImage(Koji.config.images.goodObject[i]);
    }


    for (let i = 0; i < Koji.config.images.badObject.length; i++) {
        imgBad[i] = loadImage(Koji.config.images.badObject[i]);
    }


    //Load background if there's any
    if (Koji.config.images.background != "") {
        imgBackground = loadImage(Koji.config.images.background);
    }


    //===Load Sounds

    //===Load Sounds here
    //Include a simple IF check to make sure there is a sound in config, also include a check when you try to play the sound, so in case there isn't one, it will just be ignored instead of crashing the game
    if (Koji.config.sounds.tapGood) sndTapGood = loadSound(Koji.config.sounds.tapGood);
    if (Koji.config.sounds.tapBad) sndTapBad = loadSound(Koji.config.sounds.tapBad);

    //Music is loaded in setup(), to make it asynchronous

    //===Load settings from Game Settings
    startingLives = 1;
    lives = startingLives;
    scoreGain = Koji.config.settings.scoreGain;

    gameLength = Koji.config.settings.gameLength;
    gameTimer = gameLength;
    timeUpDuration = Koji.config.settings.timeUpDuration;
    timeUpTimer = timeUpDuration;

    averageSpawnPeriod = Koji.config.settings.averageSpawnPeriod;
}

function loadGoogleFont() {
    let link = document.createElement('link');
    link.href = "https://fonts.googleapis.com/css?family=" + Koji.config.settings.fontFamily.replace(" ", "+");
    link.rel = 'stylesheet';
    document.head.appendChild(link);
    myFont = Koji.config.settings.fontFamily;
}
