export default function draw() {
    if (!frameRate() || window.getAppView() != 'game') {
        return;
    }

    drawBackground();

    if (currentView == VIEW_TUTORIAL) {
        drawTutorial();
        return;
    }

    if (!isCountdownDone()) {
        handleCountdown();
    } else {
        updateEntities();
        
        if (gameTimer > 0) {
            handleGame();
        } else {
            if (!hasGameEnded) {
                endGame();
            }
        }
    }

    if (hasGameEnded) {

        handleGameEnd();
    }

    if (canTransition) {
        handleEndTransition();
    }

    drawScore();
    cleanup();
}

export function touchStarted() {
    try {
        handleTouchStart();
    } catch (error) {
        console.log(error);
    }
}

function handleTouchStart() {
    if (window.getAppView() == 'game') {
        isTouching = true;

        if (currentView == VIEW_GAME) {
            if (hasGameEnded && timeUntilAbleToTransition <= 0) {
                canTransition = true;
            }
        }

        if (gameTimer > 0) {
            spawnParticles(mouseX, mouseY, 2);
            for (let i = 0; i < tapObjects.length; i++) {
                tapObjects[i].handleTap();
            }
        }

        if (currentView == VIEW_TUTORIAL) {
            currentView = VIEW_GAME;
        }
    }
}

export function touchEnded() {
    try {
        handleTouchEnd();
    } catch (error) {
        console.log(error);
    }
}

function handleTouchEnd() {
    //===This is required to fix a problem where the music sometimes doesn't start on mobile
    if (window.__template_config.soundEnabled && getAudioContext().state !== 'running') {
        getAudioContext().resume();
    }

    isTouching = false;
}

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


export function init() {
    updateSound();

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
    timeUntilAbleToTransition = 0.5;

    clearArrays();

    if (window.getAppView() == 'game') {
        playMusic();
    }
}

function clearArrays() {
    tapObjects = [];
    floatingTexts = [];
    particles = [];
}

export function addScore(amount) {
    score += amount;
    scoreAnimTimer = 0;
}

export function goToPostGame() {
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

    calculateObjSize();
}

function drawBackground() {
    background(Koji.config.general.backgroundColor);

    if (imgBackground) {
        background(imgBackground);
    }
}

function drawTutorial() {

    const instructionsX = width / 2;
    const instructionsY = height * 0.12;
    const instructionsSize = objSize * 1;

    const instructionsText = Koji.config.settings.instructionsText;

    textSize(instructionsSize);

    fill(textColor);
    textAlign(CENTER, TOP);

    text(instructionsText, instructionsX, instructionsY);


    drawContinueText();
}

function handleCountdown() {
    countdownInterval -= 1 / frameRate();

    if (countdownInterval <= 0) {
        startCountdown--;
        countdownAnimTimer = 0;
        countdownInterval = 1;
    }

    if (countdownAnimTimer < 1) {
        countdownAnimTimer += 1 / frameRate() * 5;
    }

    drawCountdown();
}

function spawnWinText() {
    const floatingText = new FloatingText(width / 2, height / 2, Koji.config.settings.winText);
    floatingText.timer = 1;
    floatingText.maxVelocityY = 0;
    floatingText.velocityY = 0;
    floatingText.timer = 100;
    floatingText.shouldPulse = true;
    floatingText.maxSize = objSize * 2;

    floatingTexts.push(floatingText);

}

function spawnLoseText() {
    const floatingText = new FloatingText(width / 2, height / 2, Koji.config.settings.loseText);
    floatingText.timer = 1;
    floatingText.maxVelocityY = 0;
    floatingText.velocityY = 0;
    floatingText.timer = 100;
    floatingText.easeFunction = EasingFunctions.easeInOutQuad;
    floatingText.maxSize = objSize * 2;

    floatingTexts.push(floatingText);
}

function handleWinAnimation() {
    const animationSetting = Koji.config.settings.winAnimation;

    if (animationSetting == 'fireworks' || animationSetting == 'confettiFireworks') {
        manageFireworks();
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

function manageFireworks() {
    fireworkTimer -= 1 / frameRate();

    if (fireworkTimer <= 0) {
        fireworkTimer = fireworkInterval * random(0.8, 1.2);
        spawnFireworks(random(0, width), random(0, height), random(20, 30));
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

function handleEndTransition() {
    timeUpTimer -= 1 / frameRate();

    if (timeUpTimer <= 0) {
        goToPostGame();
    }

    try {
        drawFadeOutRectangle();
    } catch{
    }
}

function drawFadeOutRectangle() {
    fill("rgba(0,0,0," + (1 - timeUpTimer / timeUpDuration) + ")");
    rect(0, 0, width, height);
}

function drawScore() {
    if (scoreAnimTimer < 1) {
        scoreAnimTimer += 1 / frameRate() * 4;
    }

    const scoreX = width - objSize / 2;
    const scoreY = objSize / 3;
    const txtSize = Ease(EasingFunctions.outBack, scoreAnimTimer, objSize * 2.5, -objSize * 0.5);

    push();
    textSize(txtSize);
    fill(textColor);
    textAlign(RIGHT, TOP);
    text(score.toLocaleString(), scoreX, scoreY);
    pop();
}

function updateEntities() {

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
}

function endGame() {
    hasGameEnded = true;

    determineGameOutcome();

    

    if (endState == STATE_WIN) {
        spawnWinText();
    }

    if (endState == STATE_LOSE) {
        spawnLoseText();
    }
}

function determineGameOutcome() {
    if (score >= Koji.config.settings.minimumScoreForWin) {
        winGame();
    } else {
        if (!isLeaderboardEnabled()) {
            loseGame();
        }
    }
}

function updateGameTimer() {
    gameTimer -= 1 / frameRate();
}

function handleGame() {
    
    drawGameTimer();
    updateGameTimer();
    manageSpawn();
}


function handleGameEnd() {
    if (endState == STATE_WIN) {
        handleWinAnimation();
    }

    if (endState == STATE_NONE) {
        drawTimeUpText();
    }

    drawContinueText();

    timeUntilAbleToTransition -= 1 / frameRate();
}

function isLeaderboardEnabled() {
    return Koji.config.postGameScreen.actions.action == 'leads';
}

function isCountdownDone() {
    return startCountdown <= -1;
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