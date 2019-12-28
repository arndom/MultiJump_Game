//Define all globals here

window.myFont = null;

window.soundImage = null;
window.muteImage = null;
window.imgBackground = null;
window.imgBall = null;
window.imgHoop = null;
window.imgBoard = null;
window.imgPlatform = null;
window.imgBoardSquare = null;
window.imgGuide = null;

window.backgroundMusic = null;
window.sndCollision = null;
window.sndIncrement = null;
window.sndMiss = null;
window.sndScore = null;
window.sndThrow = null;
window.sndLoseGame = null;

window.width = null;
window.height = null;

window.isMobile = false;

window.objSize = 30;
window.gameSize = 12;

window.isTouching = false;


//===Game objects
window.floatingTexts = [];
window.ball = null;
window.hoop = null;
window.hoopSides = []; //hoop sides needed for collision
window.board = null;
window.platform = null;
window.boardSquare = null;
window.guide = null;


//===Score data
window.score = 0;
window.scoreGain = null;
window.scoreGainModifier = 1; //each time you gain score it will be multiplied by this number
window.scoreIncreaseInterval = null; //after how many shots does the score modifier increment
window.scoreModifierIncrement = null;

window.gameTimer = null;
window.gameLength = null;
window.startCountdown = null;
window.countdownAnimTimer = 0;
window.countdownInterval = 1;

window.timeUpTimer = null;
window.timeUpDuration = null;

//===Data taken from Game Settings
window.lives = 1;

window.gravity = null; //calculated later

window.hoopWidthModifier = 80; //how wide is the hoop
window.boardMoveStart = null; //after what score will the board start moving
window.desiredBoardPos = null;
window.boardPos = null;

//===Strings loaded from Game Settings
window.loseLifeText = [];
window.scoreAdvanceText = [];

window.hoopHeightOnBoard = null; //At what percentage of the game board height will the hoop be placed? (0-100)


export default function preload() {
  loadGoogleFont();

  //===Load images
  imgBall = loadImage(Koji.config.images.ball);
  imgHoop = loadImage(Koji.config.images.hoop);
  imgBoard = loadImage(Koji.config.images.board);

  imgPlatform = loadImage(Koji.config.images.platform);
  imgGuide = loadImage(Koji.config.images.guide);


  //Load background if there's any
  if (Koji.config.images.background != "") {
    imgBackground = loadImage(Koji.config.images.background);
  }

  //Load image square if there's any
  if (Koji.config.images.boardSquare != "") {
    imgBoardSquare = loadImage(Koji.config.images.boardSquare);

  }
  //===Load Sounds

  if (Koji.config.sounds.collisionSound) sndCollision = loadSound(Koji.config.sounds.collisionSound);
  if (Koji.config.sounds.scoreIncrementSound) sndIncrement = loadSound(Koji.config.sounds.scoreIncrementSound);
  if (Koji.config.sounds.loseLifeSound) sndMiss = loadSound(Koji.config.sounds.loseLifeSound);
  if (Koji.config.sounds.scoreSound) sndScore = loadSound(Koji.config.sounds.scoreSound);
  if (Koji.config.sounds.throwSound) sndThrow = loadSound(Koji.config.sounds.throwSound);
  if (Koji.config.sounds.loseGameSound) sndLoseGame = loadSound(Koji.config.sounds.loseGameSound);

  //===Load settings
  scoreGain = parseInt(Koji.config.settings.scoreGain);
  scoreIncreaseInterval = parseInt(Koji.config.settings.scoreIncreaseInterval);
  scoreModifierIncrement = parseInt(Koji.config.settings.scoreModifierIncrement);
  boardMoveStart = parseInt(Koji.config.settings.boardMoveStart);
  hoopHeightOnBoard = parseInt(Koji.config.settings.hoopHeightOnBoard);
  hoopWidthModifier = parseInt(Koji.config.settings.hoopWidth);

  //===Load text from Game Settings and split it into an array, separated by a comma
  loseLifeText = Koji.config.settings.loseLifeText;
  scoreAdvanceText = Koji.config.settings.scoreAdvanceText;
  gameLength = Koji.config.settings.gameLength;
  gameTimer = gameLength;
  timeUpDuration = Koji.config.settings.timeUpDuration;
  timeUpTimer = timeUpDuration;
}

function loadGoogleFont() {
  let link = document.createElement('link');
  link.href = "https://fonts.googleapis.com/css?family=" + Koji.config.settings.fontFamily.replace(" ", "+");
  link.rel = 'stylesheet';
  document.head.appendChild(link);
  myFont = Koji.config.settings.fontFamily;
}
