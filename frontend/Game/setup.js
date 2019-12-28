export default function setup() {

  width = window.innerWidth;
  height = window.innerHeight;

  createCanvas(width, height);

  //===How much of the screen should the game take
  let sizeModifier = 0.85;
  if (height > width) {
    sizeModifier = 1;
  }

  //===Determine basic object size depending on size of the screen
  objSize = floor(min(floor(width / gameSize), floor(height / gameSize)) * sizeModifier);

  gravity = objSize * 0.75;

  isMobile = detectMobile();

  //===Where the board X position will be, used for moving it later in the game
  desiredBoardPos = width / 2;
  boardPos = desiredBoardPos;

  //playMusic();

  if (Koji.config.sounds.backgroundMusic) backgroundMusic = loadSound(Koji.config.sounds.backgroundMusic, playMusic);

  textFont(myFont);
  strokeWeight(Koji.config.settings.textStroke * objSize);
  stroke("#000000");

  init();
}

