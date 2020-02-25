export default function setup() {
  try {
    createCanvas(window.innerWidth, 400, WEBGL);

    try {

      const scoreButton = createButton('end the game with a score of 10');
      scoreButton.position(window.innerWidth / 2 - scoreButton.width / 2, window.innerHeight / 2 - scoreButton.height / 2, 0);
      scoreButton.mousePressed(() => {
        window.setScore(10);
        window.setAppView('postGame');
      });

      const loseButton = createButton('end the game in a losing state');
      loseButton.position(window.innerWidth / 2 - loseButton.width / 2, window.innerHeight / 2 + loseButton.height * 2, 0);
      loseButton.mousePressed(() => {
        window.setOutcome('lose');
        window.setAppView('postGame');
      });

      const winButton = createButton('end the game in a winning state');
      winButton.position(window.innerWidth / 2 - winButton.width / 2, window.innerHeight / 2 + winButton.height * 4, 0);
      winButton.mousePressed(() => {
        window.setOutcome('win');
        window.setAppView('postGame');
      });

    } catch (err) {
      console.log('DRAW ERROR: ', err);
    }
  } catch (err) {
    console.log('SETUP ERROR: ', err);
  }
}