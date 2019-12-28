export default function draw() {

    if (!frameRate()) {
        return;
    }

    background(Koji.config.colors.backgroundColor);
    // set the background color from the configuration options
    if (imgBackground) {
        background(imgBackground);
    }

    //===Draw UI


    board.pos.x = boardPos;
    board.render();

    if (boardSquare) {
        boardSquare.render();
        boardSquare.pos.x = boardPos;
    }


    boardPos = Smooth(boardPos, desiredBoardPos, 8); //Move board pos towards desired position

    //===Score modifier draw
    let x = boardPos;
    let y = hoopSides[0].pos.y - objSize * hoopWidthModifier / 100 / 3;
    textSize(objSize * 0.5);
    fill(Koji.config.colors.scoreModifierColor);
    textAlign(CENTER, BOTTOM);
    text("x" + scoreGainModifier, x, y);

    //Update left and right side of the hoop (the ones used for collision)
    for (let i = 0; i < hoopSides.length; i++) {
        hoopSides[i].update();
        hoopSides[i].render();
    }

    // if the ball has been created, update it and render
    if (ball) {
        ball.update();
        hoop.update();

        //Determine draw order of ball, hoop and platform depending on what the ball is currently doing
        //If the ball is falling, draw it behind hoop and platform, otherwise in front
        if (ball.falling) {

            ball.render();
            hoop.render();
            platform.render();

        } else {
            platform.render();
            hoop.render();
            ball.render();

        }

        //if the ball fell offscreen, create a new one
        if (ball.pos.y > height) {
            spawnBall();
        }
    }

    //===Update all floating text objects
    for (let i = 0; i < floatingTexts.length; i++) {
        floatingTexts[i].update();
        floatingTexts[i].render();
    }

    if(guide){
      guide.update();
      guide.render();
    }

    //===Ingame UI

    // Game Timer
  
    if (startCountdown <= -1) {
        if (gameTimer > 0) {


            let timerX = objSize / 2;
            let timerY = objSize / 2;
            textSize(objSize);
            fill(Koji.config.colors.gameCountdownTimer);
            textAlign(LEFT, TOP);
            text(gameTimer.toFixed(1), timerX, timerY);

            gameTimer -= 1 / frameRate();
        }

    }else{
        countdownInterval -= 1/frameRate();

        if(countdownInterval <= 0){
            doCountdown();
            countdownInterval = 1;
        }
    }




    //===Score draw
    let scoreX = width - objSize / 2;
    let scoreY = objSize / 3;
    textSize(objSize * 2);
    fill(Koji.config.colors.scoreColor);
    textAlign(RIGHT, TOP);
    text(score, scoreX, scoreY);


    //===Countdown draw
    if (startCountdown > -1) {
        if (countdownAnimTimer < 1) {
            countdownAnimTimer += 1 / frameRate() * 5;
        }

        let countdownX = width / 2;
        let countdownY = height / 2 - objSize * 4;
        let countdownSize = Ease(EasingFunctions.outBounce, countdownAnimTimer, 3, -1);
        textSize(objSize * countdownSize);
        fill(Koji.config.colors.countdownTimer);
        textAlign(CENTER, CENTER);

        let countdownText = startCountdown;
        if (startCountdown <= 0) {
            countdownText = "GO!";
        }
        text(countdownText, countdownX, countdownY);
    }
    //===


    //===Endgame countdown draw
    if (gameTimer <= 0) {
        timeUpTimer -= 1 / frameRate();

        if (timeUpTimer <= 0) {
            loseLife();
        }

        if (countdownAnimTimer < 1) {
            countdownAnimTimer += 1 / frameRate() * 5;
        }

        try {
            fill("rgba(0,0,0," + (1 - timeUpTimer / timeUpDuration) + ")");
            rect(0, 0, width, height);
        } catch{

        }


        let countdownX = width / 2;
        let countdownY = height / 2;
        let countdownSize = Ease(EasingFunctions.outBounce, countdownAnimTimer, 2, -1);
        textSize(objSize * countdownSize);
        fill(Koji.config.colors.countdownTimer);
        textAlign(CENTER, CENTER);

        text(Koji.config.settings.timeUpText, countdownX, countdownY);


    }
    //===


    cleanup();

    updateSound();
}

export function touchStarted() {
    try {
        //Do Ingame stuff
        isTouching = true;

        if (ball) {
            if (ball.checkClick()) {
                ball.canThrow = true;
            }
        }
    } catch (error) {
        console.log(error);
    }

}


export function touchEnded() {
    try {
        //===This is required to fix a problem where the music sometimes doesn't start on mobile
        if (window.__template_config.soundEnabled && getAudioContext().state !== 'running') {
            getAudioContext().resume();
        }

        isTouching = false;

        if (ball) {
            ball.canThrow = false;
        }
    } catch (error) {
        console.log(error);
    }


}


//===Go through objects and see which ones need to be removed
function cleanup() {
    for (let i = 0; i < floatingTexts.length; i++) {
        if (floatingTexts[i].timer <= 0) {
            floatingTexts.splice(i, 1);
        }
    }

    if(guide && guide.removable){
      guide = null;
    }
}


//===Initialize/reset the game
export function init() {

    score = 0;
    lives = 1;

    //Clear all arrays
    floatingTexts = [];
    hoopSides = [];
    scoreGainModifier = 1;

    gameTimer = gameLength;
    timeUpTimer = timeUpDuration;

    countdownInterval = 1;
    startCountdown = 3;

    //reset desired position
    desiredBoardPos = width / 2;

    //spawn all objects fresh
    spawnBall();

    board = new Entity(boardPos, height / 2 - objSize * 4);
    board.sizeMod = 7;
    board.img = imgBoard;

    hoopSides.push(new HoopSide(boardPos - objSize * hoopWidthModifier / 100, board.pos.y + objSize * board.sizeMod * hoopHeightOnBoard / 100 - objSize * board.sizeMod * 0.5 - objSize * hoopWidthModifier / 100 / 2));
    hoopSides.push(new HoopSide(boardPos + objSize * hoopWidthModifier / 100, board.pos.y + objSize * board.sizeMod * hoopHeightOnBoard / 100 - objSize * board.sizeMod * 0.5 - objSize * hoopWidthModifier / 100 / 2));

    hoop = new Hoop((hoopSides[0].pos.x + hoopSides[1].pos.x) / 2, hoopSides[0].pos.y + objSize * hoopWidthModifier / 100);
    hoop.sizeMod = hoopWidthModifier / 100 * 2;

    if (imgBoardSquare) {
        boardSquare = new Entity(boardPos, hoop.pos.y - objSize * hoop.sizeMod + objSize * hoop.sizeMod * 0.1);
        boardSquare.img = imgBoardSquare;
        boardSquare.sizeMod = hoopWidthModifier / 100 * 2;

    }


    platform = new Entity(ball.pos.x, ball.pos.y + objSize * 2.5);
    platform.img = imgPlatform;
    platform.sizeMod = 5;

    guide = new Guide(ball.pos.x + objSize, ball.pos.y);

}

function doCountdown() {
    startCountdown--;

    countdownAnimTimer = 0;


}

function spawnBall() {
    ball = null;
    ball = new Ball(width / 2, height / 2 + objSize * 2);
}



//===Call this when a lose life event should trigger
export function loseLife() {

    lives--;

    if (lives <= 0) {
        submitScore();

        lives = 1;

        if (backgroundMusic) {
            backgroundMusic.stop();
        }

        try {
            if (sndLoseGame) sndLoseGame.play();
        } catch (error) {
            console.log(error);
        }

    } else {
        //===Choose a random loseLifeText from the array
        let textID = floor(random() * loseLifeText.length);
        let text = loseLifeText[textID];
        floatingTexts.push(new FloatingText(boardPos, height / 2 - objSize * 4, text, Koji.config.colors.loseLifeColor, objSize * 1));
        if (sndMiss) sndMiss.play();
    }


}

function updateSound() {
    if (window.__template_config.soundEnabled) {
        if (getAudioContext().state == 'suspended') {
            getAudioContext().resume();
        }
    } else {
        if (getAudioContext().state == 'running') {
            getAudioContext().suspend();
        }
    }



}