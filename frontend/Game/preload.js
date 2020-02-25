export default function preload() {
  try {
    console.log('preload');
  } catch (err) {
    console.log('PRELOAD ERR: ', err);
  }
}