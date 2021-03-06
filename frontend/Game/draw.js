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

    if (gameTimer > 0) {
        if (isCountdownDone()) {
            handleGame();
        }
    } 
    else {
        if (!hasGameEnded) {
            endGame();
        }
    }

    if (hasGameEnded) {
        handleGameEnd();
    }

    // if (canTransition) {
    //     handleEndTransition();
    // }

    if(!hasGameEnded){
        drawScore();    
    }

    cleanup();
}

export function touchStarted() {

    try{
        
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

                
        if (!hasGameEnded && startCountdown <= -1 && !isTouching && !isMobile  ){  
            console.log(event.clientY);
            
            if(mouseY <= height*0.45 ){
                player1.handleTap(); 
            }
            if(mouseY >= height*0.45 ){
                player.handleTap(); 
            }         
        }
        
        }

        isTouching = true;

        if (currentView == VIEW_TUTORIAL) {
            currentView = VIEW_GAME;
        }

        //Prevent double tap on mobile/ios
        if (currentView == VIEW_GAME && !hasGameEnded) {
            return false;
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

    if (window.getTemplateConfig().soundEnabled && getAudioContext().state !== 'running') getAudioContext().resume();

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

    for (let i = 0; i < collectibles.length; i++) {
        if (collectibles[i].removable) {
            collectibles.splice(i, 1);
        }
    }

    if (guide && guide.removable) {
        guide = null;
    }
}

export function init() {
    cleanup();

    updateSound();


    score  = 0;

    gameTimer = gameLength;
    timeUpTimer = timeUpDuration;
    countdownInterval = 1;
    startCountdown = 2;
    hasGameEnded = false;
    canTransition = false;
    window.currentView = VIEW_TUTORIAL;
    window.endState = STATE_NONE;
    timeUntilAbleToTransition = 0.5;
    globalSpeedModifier = 1;
    lives = startingLives;
    // score = 0;
    // spawnTimer = 0.5;

    groundLevel = height * 0.95;
    midLevel = height * 0.45;

    globalSpeed = objSize * Koji.config.settings.gameSpeed;

    clearArrays();

    spawnBackground();


    ground = new Ground();
    guide = new Guide(width / 2, height * 0.35);
    player = new Player(width * 0.2, height * 0.85, 0);
    player1 = new Player(width * 0.2, height * 0.35, 1);


    if (window.getAppView() == 'game') {
        playMusic();
    }

    // touchEnded();
}

function clearArrays() {
    obstacles = [];
    floatingTexts = [];
    particles = [];
    collectibles = [];
    backgroundLayers = [];
}

export function addScore(amount) {
    score += amount;
    scoreAnimTimer = 0;
}

export function goToPostGame() {
    try {
        sndMusic.dispose();
    } catch (error) {
        console.log(error);
    }

    submitScore();

    
}

export function updateSound() {
    try {
        if (getTemplateConfig().soundEnabled) {
            getAudioContext().resume();
        } else {
            getAudioContext().suspend();
        }
    } catch (error) {
        console.log(error);
    }
}

export function windowResized() {
    resizeCanvas(windowWidth, windowHeight);

    width = window.innerWidth;
    height = window.innerHeight;

    calculateObjSize();
}

function drawBackground() {
    background("#ffffff");

    for (let i = 0; i < backgroundLayers.length; i++) {
        backgroundLayers[i].update();
        backgroundLayers[i].render();
    }
}

function drawTutorial() {

    const instructionsX = width / 2;
    const instructionsY = height * 0.12;
    let instructionsSize = objSize * 1;
    if (width > height) {
        instructionsSize = objSize * 0.75;
    }

    const instructionsText = Koji.config.settings.instructionsText;

    textSize(instructionsSize);

    fill(textColor);
    textAlign(CENTER, TOP);

    const desiredTextWidth = width * 0.9;
    text(instructionsText, instructionsX - desiredTextWidth / 2, instructionsY, desiredTextWidth);

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
    floatingText.maxSize = constrainTextSize(Koji.config.settings.winText, objSize * 2);

    floatingTexts.push(floatingText);

}

function spawnLoseText() {
    const floatingText = new FloatingText(width / 2, height / 2, Koji.config.settings.loseText);
    floatingText.timer = 1;
    floatingText.maxVelocityY = 0;
    floatingText.velocityY = 0;
    floatingText.timer = 100;
    floatingText.easeFunction = EasingFunctions.easeInOutQuad;
    floatingText.maxSize = constrainTextSize(Koji.config.settings.loseText, objSize * 2);

    floatingTexts.push(floatingText);
}

function constrainTextSize(txt, initialSize) {
    let size = initialSize;

    textSize(size);

    while (textWidth(txt) > width * 0.9) {
        size *= 0.99;
        textSize(size);
    }

    return size;

}


function drawContinueText() {
    const textX = width / 2;
    const textY = height * 0.95;
    const txtSize = objSize * 0.75;

    textAlign(CENTER, BOTTOM);
    textSize(txtSize);
    fill(textColor);

    text("Tap to continue...", textX, textY);
}

function drawGameTimer() {
    if (!Koji.config.settings.enableTimer) return;
    const timerX = width / 2;
    const timerY = objSize / 2;
    textSize(objSize);
    fill(textColor);
    textAlign(CENTER, TOP);
    text(gameTimer.toFixed(1), timerX, timerY);
}

function drawLives() {
    const livesX = objSize / 2;
    const livesY = objSize / 2;
    const lifeSize = globalSizeMod * objSize * 0.5;

    for (let i = 0; i < lives; i++) {
        image(imgLife, livesX + i * lifeSize, livesY, lifeSize, lifeSize);
    }
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
        
    for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].render();
    }
    if (ground) {
        ground.update();
        ground.render();
    }

    if (player) {
        player.update();
        player.render();
    }
    if (player1) {
        player1.update();
        player1.render();
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

    if (playerDeath) {
        playerDeath.update();
        playerDeath.render();
    }
}

export function endGame() {
    // clearArrays();
    // cleanup();

    hasGameEnded = true;
    gameTimer = 0;

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
        loseGame();
    }
}


function handleGame() {
    const globalGoalSpeed = objSize * Koji.config.settings.gameSpeed * globalSpeedModifier;
    globalSpeed = Smooth(globalSpeed, globalGoalSpeed, 2);

    // if(!hasGameEnded){
        manageSpawn(); 
    // }

    // if(gameTimer <= 0){
    //     endGame();
    // }

   

    updateGameTimer();
    drawGameTimer();

    drawLives();
}

function updateGameTimer() {
    if (!Koji.config.settings.enableTimer) return;
    gameTimer -= 1 / frameRate();
}

function handleGameEnd() {
    if (endState == STATE_WIN) {
        handleWinAnimation();
    }

    globalSpeed = Smooth(globalSpeed, 0, 8);

    drawContinueText();

    timeUntilAbleToTransition -= 1 / frameRate();
    if (canTransition) handleEndTransition();

}

function isCountdownDone() {
    return startCountdown <= -1;
}

function manageSpawn() {
    spawnTimer -= 1 / frameRate();

    if (spawnTimer <= 0) {
        spawnObstacle();
        spawnTimer = averageSpawnPeriod * random(0.75, 1.35); //.75
    }
}

function spawnObstacle() {

    const x = width + objSize * 5;
    const x2 = width + objSize;

    let y = groundLevel - objSize * groundSizeMod / 2 - globalSizeMod * objSize / 2;
    let y2 = midLevel - objSize * groundSizeMod /2 -globalSizeMod *objSize /2;

    // let isAir = random() * 100 < Koji.config.settings.airObstacleRate;

    // if (isAir) {
    //     y -= globalSizeMod * objSize;
    //     y2 -= globalSizeMod * objSize;
    // }

    const obstacle = new Obstacle(x, y);
    const  obstacle2 = new Obstacle(x2, y2);

    // obstacle.isAir = isAir;
    // obstacle2.isAir = isAir;

    obstacles.push(obstacle);
    obstacles.push(obstacle2);
}

function spawnBackground() {
    if (backgroundLayers.length < imgBackground.length) {
        for (let i = 0; i < imgBackground.length; i++) {
            backgroundLayers.push(new BackgroundLayer(i));
        }
    }
    
}