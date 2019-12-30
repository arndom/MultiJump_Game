export default function draw() {

    if (!frameRate()) {
        return;
    }

    background(Koji.config.colors.backgroundColor);

    if (imgBackground) {
        background(imgBackground);
    }

    //Update and render all game objects here

    //===EXAMPLE
    for (let i = 0; i < nodes.length; i++) {
        nodes[i].update();
        nodes[i].render();
    }
    //===

    for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].render();
    }

    for (let i = 0; i < explosions.length; i++) {
        explosions[i].update();
        explosions[i].render();
    }

    for (let i = 0; i < floatingTexts.length; i++) {
        floatingTexts[i].update();
        floatingTexts[i].render();
    }

    //===Ingame UI

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

    //===Lives draw
    let lifeSize = objSize;
    for (let i = 0; i < lives; i++) {
        image(imgLife, lifeSize / 2 + lifeSize * i, lifeSize / 2, lifeSize, lifeSize);
    }
    //===

    //===EXAMPLE
    push();
    fill(Koji.config.colors.scoreColor);
    textAlign(LEFT, TOP);
    textSize(objSize * 0.75);
    text("Click - Score Points\nE - Spawn Explosion\nP - Submit Score to leaderboard", lifeSize / 2, lifeSize * 2);
    pop();
    //===

    cleanup();



    updateSound();
}

export function touchStarted() {
    try {
        //Do Ingame stuff
        isTouching = true;

        //EXAMPLE
        if (sndTap) sndTap.play();
        addScore(scoreGain);
        floatingTexts.push(new FloatingText(mouseX, mouseY, scoreGain, Koji.config.colors.scoreColor, objSize));
        spawnParticles(mouseX, mouseY, random(10, 15));
        //===

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


//Keyboard input
/*
You can check if the keyCode equals:

BACKSPACE, DELETE, ENTER, RETURN, TAB, ESCAPE, SHIFT, CONTROL, OPTION, ALT, UP_ARROW, DOWN_ARROW, LEFT_ARROW, RIGHT_ARROW
*/

export function keyPressed() {

    //Ingame
    if (keyCode == UP_ARROW) {
        console.log("up")
    }
    if (keyCode == DOWN_ARROW) {
        console.log("down")
    }
    if (keyCode == LEFT_ARROW) {
        console.log("left")
    }
    if (keyCode == RIGHT_ARROW) {
        console.log("right")
    }

    if (key == 'p') {
        console.log("Pressed P key")
        submitScore();
    }

    if (key == 'e') {
        console.log("Pressed E key")

        spawnExplosion(mouseX, mouseY, 3);
    }
}

//Same usage as keyPressed
export function keyReleased() {

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


    for (let i = 0; i < explosions.length; i++) {
        if (explosions[i].removable) {
            explosions.splice(i, 1);
        }
    }
}


//===Initialize/reset the game
export function init() {

    score = 0;
    lives = startingLives;

    //Clear out all arrays
    floatingTexts = [];
    particles = [];
    explosions = [];


    //EXAMPLE
    spawnNodes();
    //===

}

function doCountdown() {
    startCountdown--;

    countdownAnimTimer = 0;


}



//EXAMPLE
function spawnNodes() {
    nodes = [];

    let nodeCount = floor(random(80, 100));
    if (isMobile) {
        nodeCount = 30;
    }
    for (let i = 0; i < nodeCount; i++) {
        let x = random(0, width);
        let y = random(0, height);
        let node = new Node(x, y);
        nodes.push(node);
        node.changeVelocity();
    }
}
//===

//Use this to add score and trigger animation
function addScore(amount) {
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
