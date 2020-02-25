export default function setup() {
  try {
    createCanvas(window.innerWidth, 400, WEBGL);
  } catch (err) {
    console.log('SETUP ERROR: ', err);
  }
}