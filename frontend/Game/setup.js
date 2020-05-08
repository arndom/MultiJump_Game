export default function setup() {

  width = window.innerWidth;
  height = window.innerHeight;

    createCanvas(width, height);

 window.addEventListener('touchstart', function(e) {

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

//   cnv =  createCanvas(width, height);

  textFont(myFont);

    calculateObjSize();

  isMobile = detectMobile();

  init();


}

