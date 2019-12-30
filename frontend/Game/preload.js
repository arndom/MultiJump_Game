//Define all globals here

window.myFont = null; //The font we'll use throughout the app

//===Game objects
//Declare game objects here like player, enemies etc
window.floatingTexts = [];
window.particles = [];
window.explosions = [];

//EXAMPLE
window.nodes = [];


//===Score data
window.score = 0;
window.scoreGain = null;
window.scoreAnimTimer = 1;

//===Data taken from Game Settings
window.startingLives = null;
window.lives = null;

//===Images
window.imgLife = null;
window.imgBackground = null;
window.imgParticle = null;
window.imgExplosion = null;

//===Audio
window.sndMusic = null;
window.sndTap = null;

//===Size stuff
window.objSize = 30;
window.gameSize = 18;

window.isMobile = false;
window.isTouching = false;


export default function preload() {
    loadGoogleFont();

    //===Load images
    imgLife = loadImage(Koji.config.images.lifeIcon);
    imgParticle = loadImage(Koji.config.images.particle);
    imgExplosion = loadImage(Koji.config.images.explosion);

    //Load background if there's any
    if (Koji.config.images.background != "") {
        imgBackground = loadImage(Koji.config.images.background);
    }


    //===Load Sounds

    //===Load Sounds here
    //Include a simple IF check to make sure there is a sound in config, also include a check when you try to play the sound, so in case there isn't one, it will just be ignored instead of crashing the game
    if (Koji.config.sounds.tap) sndTap = loadSound(Koji.config.sounds.tap);

    //Music is loaded in setup(), to make it asynchronous

    //===Load settings from Game Settings
    startingLives = Koji.config.settings.lives;
    lives = startingLives;
    scoreGain = Koji.config.settings.scoreGain;
}

function loadGoogleFont() {
    let link = document.createElement('link');
    link.href = "https://fonts.googleapis.com/css?family=" + Koji.config.settings.fontFamily.replace(" ", "+");
    link.rel = 'stylesheet';
    document.head.appendChild(link);
    myFont = Koji.config.settings.fontFamily;
}
