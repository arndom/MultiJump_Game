export default function setup() {

  width = window.innerWidth;
  height = window.innerHeight;

  createCanvas(width, height);



//   cnv =  createCanvas(width, height);

  textFont(myFont);

    calculateObjSize();

  isMobile = detectMobile();






  init();
  window.addEventListener('touchstart', function(e) {
  // Cache the client X/Y coordinates
    // myTouchX = e.touches[0].clientX;
    // myTouchY = e.touches[0].clientY;

        if (!hasGameEnded && startCountdown <= -1 && !isTouching && isMobile ){  
        console.log(e.touches[0].clientY);
        
            if(e.touches[0].clientY <= height*0.45 ){
                player1.handleTap(); 
            }
            if(e.touches[0].clientY >= height*0.45 ){
                player.handleTap(); 
            }

        }

    }, false);
}

