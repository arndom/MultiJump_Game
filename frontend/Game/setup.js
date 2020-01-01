export default function setup() {

  width = window.innerWidth;
  height = window.innerHeight;

  createCanvas(width, height);

  textFont(myFont);

  //===How much of the screen should the game take
  let sizeModifier = 0.85;
  if (height > width) {
    sizeModifier = 1;
  }

  //===Determine basic object size depending on size of the screen
  objSize = floor(min(floor(width / gameSize), floor(height / gameSize)) * sizeModifier);

  isMobile = detectMobile();

  //playMusic();

  if (Koji.config.sounds.backgroundMusic) sndMusic = loadSound(Koji.config.sounds.backgroundMusic, playMusic);


  init();

}

