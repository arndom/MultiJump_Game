export default function draw() {

    if (!frameRate()) {
        return;
    }

    if (window.getAppView() != "game") {
        return;
    }

    background(Koji.config.template.config.primaryColor);

    if (imgBackground) {
        background(imgBackground);
    }



    if (currentView == VIEW_TUTORIAL) {
        drawTutorial();

        return;
    }

    //Update and render all game objects here

    for (let i = 0; i < tapObjects.length; i++) {
        tapObjects[i].update();
        tapObjects[i].render();
    }

    for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].render();
    }


    for (let i = 0; i < floatingTexts.length; i++) {
        floatingTexts[i].update();
        floatingTexts[i].render();
    }

    //===Ingame UI
    //===Ingame UI

    // Game Timer
    if (startCountdown <= -1) {
        if (gameTimer > 0) {

            drawGameTimer();

            gameTimer -= 1 / frameRate();

            manageSpawn();
        } else {
            if (!hasGameEnded) {
                hasGameEnded = true;

                if (endState == STATE_WIN) {
                    spawnWinText();
                }

                if (endState == STATE_LOSE) {
                    spawnLoseText();
                }
            }
        }
    } else {
        countdownInterval -= 1 / frameRate();

        if (countdownInterval <= 0) {
            doCountdown();
            countdownInterval = 1;
        }
    }

    //===Countdown draw
    if (startCountdown > -1) {
        if (countdownAnimTimer < 1) {
            countdownAnimTimer += 1 / frameRate() * 5;
        }

        drawCountdown();
    }

    if (hasGameEnded) {
        if (endState == STATE_WIN) {
            handleWinAnimation();
        }

        if (endState == STATE_NONE) {
            drawTimeUpText();
        }

        drawContinueText();
    }

    //===Endgame fadeout draw
    if (canTransition) {
        timeUpTimer -= 1 / frameRate();

        if (timeUpTimer <= 0) {
            endGame();
        }

        try {
            //Draw black rectangle over the screen with increasing opacity
            fill("rgba(0,0,0," + (1 - timeUpTimer / timeUpDuration) + ")");
            rect(0, 0, width, height);
        } catch{

        }
    }
    //===


    //===Score draw
    if (scoreAnimTimer < 1) {
        scoreAnimTimer += 1 / frameRate() * 4;
    }

    let scoreX = width - objSize / 2;
    let scoreY = objSize / 3;
    let txtSize = Ease(EasingFunctions.outBack, scoreAnimTimer, objSize * 2.5, -objSize * 0.5);

    push();
    textSize(txtSize);
    fill(textColor);
    textAlign(RIGHT, TOP);
    text(score.toLocaleString(), scoreX, scoreY);
    pop();
    //===

    cleanup();

    updateSound();
}

export function touchStarted() {
    try {

        if (window.getAppView() == 'game') {
            isTouching = true;

            if (currentView == VIEW_GAME) {
                if (hasGameEnded) {
                    canTransition = true;
                }

                if (gameTimer > 0) {
                    spawnParticles(mouseX, mouseY, 2);
                    for (let i = 0; i < tapObjects.length; i++) {
                        tapObjects[i].handleTap();
                    }
                }
            }

            if (currentView == VIEW_TUTORIAL) {
                currentView = VIEW_GAME;
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

    for (let i = 0; i < particles.length; i++) {
        if (particles[i].removable) {
            particles.splice(i, 1);
        }
    }

    let maxParticles = Koji.config.settings.maxParticles;
    if (isMobile) {
        maxParticles = Koji.config.settings.maxParticlesMobile;
    }

    if (particles.length > maxParticles) {
        particles.splice(maxParticles - 1);
    }

    for (let i = 0; i < tapObjects.length; i++) {
        if (tapObjects[i].removable) {
            tapObjects.splice(i, 1);

            if(Koji.config.template.config.postGameAction == 'reveal'){
              if(score >= Koji.config.settings.minimumScoreForWin){
                winGame();
              }
            }
        }
    }
}


//===Initialize/reset the game
export function init() {

    score = 0;
    lives = startingLives;

    gameTimer = gameLength;
    timeUpTimer = timeUpDuration;
    countdownInterval = 1;
    startCountdown = 3;
    hasGameEnded = false;
    canTransition = false;
    window.currentView = VIEW_TUTORIAL;
    window.endState = STATE_NONE;

    tapObjects = [];
    floatingTexts = [];
    particles = [];

}

function doCountdown() {
    startCountdown--;

    countdownAnimTimer = 0;
}


function manageSpawn() {
    spawnTimer -= 1 / frameRate();

    if (spawnTimer <= 0) {
        spawnObject();
        spawnTimer = averageSpawnPeriod * random(0.8, 1.2);
    }
}

function spawnObject() {
    let side = 1;
    if (random() < 0.5) {
        side = -1;
    }


    const x = width / 2 + (width / 2 + objSize * 3) * side;
    const y = random(objSize * 3, height - objSize * 3);
    tapObjects.push(new TapObject(x, y));
}

//Use this to add score and trigger animation
export function addScore(amount) {
    score += amount;
    scoreAnimTimer = 0;
}


export function endGame() {

    if (sndMusic) {
        sndMusic.stop();
    }

    submitScore();

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


export function windowResized() {
    resizeCanvas(windowWidth, windowHeight);

    width = window.innerWidth;
    height = window.innerHeight;

    //===How much of the screen should the game take, this should usually be left as it is
    let sizeModifier = 0.75;
    if (height > width) {
        sizeModifier = 1;
    }

    //Determine basic object size depending on size of the screen
    objSize = floor(min(floor(width / gameSize), floor(height / gameSize)) * sizeModifier);
}


function drawTutorial() {
    const goodX = width / 2 - objSize * 4;
    const badX = width / 2 + objSize * 4;
    const y = height / 2;

    textSize(objSize * 1.25);
    fill(textColor);
    textAlign(CENTER, BOTTOM);

    text("TAP", goodX, y);

    const imgSize = objSize * 3;
    push();
    translate(goodX, y + imgSize);
    image(imgGood[0], -imgSize / 2, -imgSize / 2, imgSize, imgSize);
    pop();

    textSize(objSize * 1.25);
    fill(textColor);
    textAlign(CENTER, BOTTOM);

    text("AVOID", badX, y);

    push();
    translate(badX, y + imgSize);
    image(imgBad[0], -imgSize / 2, -imgSize / 2, imgSize, imgSize);
    pop();


    drawContinueText();
}


function spawnWinText() {
    const floatingText = new FloatingText(width / 2, height / 2, Koji.config.settings.winText, textColor, objSize * 2);
    floatingText.timer = 1;
    floatingText.maxVelocityY = 0;
    floatingText.velocityY = 0;
    floatingText.timer = 100;


    floatingTexts.push(floatingText);
}

function spawnLoseText() {
    const floatingText = new FloatingText(width / 2, height / 2, Koji.config.settings.loseText, textColor, objSize * 2);
    floatingText.timer = 1;
    floatingText.maxVelocityY = 0;
    floatingText.velocityY = 0;
    floatingText.timer = 100;
    floatingText.easeFunction = EasingFunctions.easeInOutQuad;

    floatingTexts.push(floatingText);
}




function handleWinAnimation() {
    const animationSetting = Koji.config.settings.winAnimation;

    if (animationSetting == 'fireworks' || animationSetting == 'confettiFireworks') {
        fireworkTimer -= 1 / frameRate();

        if (fireworkTimer <= 0) {
            fireworkTimer = fireworkInterval * random(0.8, 1.2);

            const margin = objSize * 3;
            spawnFireworks(random(margin, width - margin), random(margin, height - margin), random(20, 30));
        }
    }
    if (frameCount % 5 == 0) {
        if (animationSetting == 'confetti' || animationSetting == 'confettiFireworks') {
            spawnConfetti();
        }

        if (animationSetting == 'rising') {
            spawnRisingParticle();
        }
    }

}


function drawTimeUpText() {
    const textX = width / 2;
    const textY = height / 2;
    const txtSize = objSize * 1.25;

    textAlign(CENTER, CENTER);
    textSize(txtSize);
    fill(textColor);

    text(Koji.config.settings.timeUpText, textX, textY);
}

function drawContinueText() {
    const textX = width / 2;
    const textY = height - objSize * 3;
    const txtSize = objSize * 0.75;

    textAlign(CENTER, BOTTOM);
    textSize(txtSize);
    fill(textColor);

    text("Tap to continue...", textX, textY);
}

function drawGameTimer() {
    const timerX = objSize / 2;
    const timerY = objSize / 2;
    textSize(objSize);
    fill(textColor);
    textAlign(LEFT, TOP);
    text(gameTimer.toFixed(1), timerX, timerY);
}

function drawCountdown() {
    const countdownX = width / 2;
    const countdownY = height / 2 - objSize * 4;
    const countdownSize = Ease(EasingFunctions.outBounce, countdownAnimTimer, 3, -1);
    textSize(objSize * countdownSize);
    fill(textColor);
    textAlign(CENTER, CENTER);

    let countdownText = startCountdown;
    if (startCountdown <= 0) {
        countdownText = "GO!";
    }
    text(countdownText, countdownX, countdownY);
}