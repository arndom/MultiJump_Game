export default function setup() {

  width = window.innerWidth;
  height = window.innerHeight;

  createCanvas(width, height);

  textFont(myFont);

    calculateObjSize();

  isMobile = detectMobile();



  init();

}

