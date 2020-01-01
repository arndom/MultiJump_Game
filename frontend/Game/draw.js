export default function draw() {

    if (!frameRate()) {
        return;
    }

    if (window.getAppView() != "game") {
        return;
    }

    background(Koji.config.colors.backgroundColor);

    if (imgBackground) {
        background(imgBackground);
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

            manageSpawn();
        }

    } else {
        countdownInterval -= 1 / frameRate();

        if (countdownInterval <= 0) {
            doCountdown();
            countdownInterval = 1;
        }
    }


    //===Score draw
    if (scoreAnimTimer < 1) {
        scoreAnimTimer += 1 / frameRate() * 4;
    }

    let scoreX = width - objSize / 2;
    let scoreY = objSize / 3;
    let txtSize = Ease(EasingFunctions.outBack, scoreAnimTimer, objSize * 2.5, -objSize * 0.5);

    push();
    textSize(txtSize);
    fill(Koji.config.colors.scoreColor);
    textAlign(RIGHT, TOP);
    text(score.toLocaleString(), scoreX, scoreY);
    pop();
    //===


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

        drawTutorial();
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


        if (gameTimer > 0) {
            spawnParticles(mouseX, mouseY, 2);
            for (let i = 0; i < tapObjects.length; i++) {
                tapObjects[i].handleTap();
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
    tapObjects = [];

    //Clear out all arrays
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

//===Call this when a lose life event should trigger
function loseLife() {

    lives--;

    if (lives <= 0) {

        // Go to leaderboard submission
        submitScore();

        if (sndMusic) {
            sndMusic.stop();
        }
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
    let goodX = width / 2 - objSize * 4;
    let badX = width / 2 + objSize * 4;
    let y = height / 2 + objSize * 4;

    textSize(objSize * 1.25);
    fill(Koji.config.colors.scoreColor);
    textAlign(CENTER, BOTTOM);

    text("TAP", goodX, y);

    let imgSize = objSize * 3;
    push();
    translate(goodX, y + imgSize);
    image(imgGood[0], -imgSize / 2, -imgSize / 2, imgSize, imgSize);
    pop();

    textSize(objSize * 1.25);
    fill(Koji.config.colors.countdownTimer);
    textAlign(CENTER, BOTTOM);

    text("AVOID", badX, y);

    push();
    translate(badX, y + imgSize);
    image(imgBad[0], -imgSize / 2, -imgSize / 2, imgSize, imgSize);
    pop();
}