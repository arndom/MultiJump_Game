//Define all globals here
window.myFont = null;

window.VIEW_TUTORIAL = 0;
window.VIEW_GAME = 1;

window.STATE_NONE = 0;
window.STATE_WIN = 1;
window.STATE_LOSE = 2;

//Tap object types
window.TYPE_GOOD = 0;
window.TYPE_BAD = 1;

window.currentView = VIEW_TUTORIAL;
window.endState = STATE_NONE;

window.textColor = Koji.config.template.config.secondaryColor;


//===Game objects
window.floatingTexts = [];
window.particles = [];
window.tapObjects = [];
window.imgWinParticle = [];


//===Score data
window.score = 0;
window.scoreGain = 1;
window.scoreAnimTimer = 1;

window.startingLives = 1;
window.lives = 1;

//===Images
window.imgBackground = null;
window.imgParticle = null;
window.imgParticleGood = null;
window.imgParticleBad = null;
window.imgGood = [];
window.imgBad = [];
window.imgWinParticle = [];

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
window.timeUpDuration = 0.5;
window.fireworkInterval = 0.5;
window.fireworkTimer = 0;

window.hasGameEnded = false;
window.canTransition = false;

window.goodBadRatio = 75;
window.averageSpawnPeriod = null;
window.spawnTimer = 0.5;

window.timeUntilAbleToTransition = 0.5;

export default function preload() {
  loadGoogleFont();
  loadImages();
  loadSounds();
  loadSettings();
}

function loadImages() {
  imgParticle = loadImage(Koji.config.settings.particle);
  imgParticleGood = loadImage(Koji.config.settings.particleGood);
  imgParticleBad = loadImage(Koji.config.settings.particleBad);

  for (let i = 0; i < Koji.config.settings.goodObject.length; i++) {
    imgGood[i] = loadImage(Koji.config.settings.goodObject[i]);
  }

  for (let i = 0; i < Koji.config.settings.badObject.length; i++) {
    imgBad[i] = loadImage(Koji.config.settings.badObject[i]);
  }

  for (let i = 0; i < Koji.config.settings.winParticles.length; i++) {
    imgWinParticle[i] = loadImage(Koji.config.settings.winParticles[i]);
  }

  if (Koji.config.settings.background != "") {
    imgBackground = loadImage(Koji.config.settings.background);
  }
}

function loadSounds() {
  if (Koji.config.settings.tapGood) sndTapGood = loadSound(Koji.config.settings.tapGood);
  if (Koji.config.settings.tapBad) sndTapBad = loadSound(Koji.config.settings.tapBad);
  if (Koji.config.settings.backgroundMusic) sndMusic = loadSound(Koji.config.settings.backgroundMusic);
}

function loadSettings() {
  startingLives = 1;
  lives = startingLives;
  scoreGain = Koji.config.settings.scoreGain;
  gameLength = Koji.config.settings.gameLength;
  gameTimer = gameLength;
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
