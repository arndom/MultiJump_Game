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

        if (!hasGameEnded) {
            handleGame();
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


        if (currentView == VIEW_GAME) {
            if (hasGameEnded && timeUntilAbleToTransition <= 0) {
                canTransition = true;
            }

            if (!hasGameEnded && startCountdown <= -1 && !isTouching) {
                if (sndTap) {
                    sndTap.play();
                }
                player.handleTap();
            }
        }

        isTouching = true;


        if (currentView == VIEW_TUTORIAL) {
            currentView = VIEW_GAME;
        }
    }
}

export function touchEnded() {
    try {
        handleTouchEnd();

        if (currentView == VIEW_GAME) {

            return false;
        }
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

    for (let i = 0; i < obstacles.length; i++) {
        if (obstacles[i].removable) {
            obstacles.splice(i, 1);
        }
    }
    if (guide && guide.removable) {
        guide = null;
    }
}

export function init() {
    updateSound();

    score = 0;

    gameTimer = gameLength;
    timeUpTimer = timeUpDuration;
    countdownInterval = 1;
    startCountdown = 2;
    hasGameEnded = false;
    canTransition = false;
    window.currentView = VIEW_TUTORIAL;
    window.endState = STATE_NONE;
    timeUntilAbleToTransition = 0.5;

    groundLevel = height * 0.85;
    globalSpeed = objSize * 0.4;

    clearArrays();

    spawnBackground();

    guide = new Guide(width / 2, height / 2);
    player = new Player(width * 0.2, height / 2);

    if (window.getAppView() == 'game') {
        playMusic();
    }
}

function clearArrays() {
    obstacles = [];
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

    for (let i = 0; i < backgroundLayers.length; i++) {
        backgroundLayers[i].update();
        backgroundLayers[i].render();
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

    if (guide) {
        guide.update();
        guide.render();
    }

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
    if (ground) {
        ground.update();
        ground.render();
    }

    for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].render();
    }

    if (player) {
        player.update();
        player.render();
    }

    for (let i = 0; i < obstacles.length; i++) {
        obstacles[i].update();
        obstacles[i].render();
    }

    for (let i = 0; i < collectibles.length; i++) {
        collectibles[i].update();
        collectibles[i].render();
    }

    for (let i = 0; i < floatingTexts.length; i++) {
        floatingTexts[i].update();
        floatingTexts[i].render();
    }
}

export function endGame() {
    hasGameEnded = true;

    determineGameOutcome();

    if (endState == STATE_WIN) {
        spawnWinText();
    }

    if (endState == STATE_LOSE) {
        spawnLoseText();
    }

    if (sndGameOver) {
        sndGameOver.play();
    }
}

function determineGameOutcome() {
    if (score >= Koji.config.settings.minimumScoreForWin) {
        winGame();
    } else {
        loseGame();
    }
}



function handleGame() {
    manageSpawn();
}


function handleGameEnd() {
    if (endState == STATE_WIN) {
        handleWinAnimation();
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
        //spawnObstacle();
        spawnTimer = averageSpawnPeriod * random(0.65, 1);
    }
}

function spawnObstacle() {

    const x = width + objSize * 5;
    let y = groundLevel - objSize * groundSizeMod / 2 - globalSizeMod * objSize / 2;

    let isAir = random() * 100 < Koji.config.airObstacleRate;

    if (isAir) {
        y -= globalSizeMod * objSize / 2;
    }

    const obstacle = new Obstacle(x, y);
    obstacle.isAir = isAir;

    obstacles.push(obstacle);
}

function spawnBackground() {
    for (let i = 0; i < imgBackground.length; i++) {
        backgroundLayers.push(new BackgroundLayer(i));
    }
}