
export class Entity {
    constructor(x, y) {
        this.pos = createVector(x, y);
        this.rotation = 0;
        this.img; //Assign this after instantiating
        this.sizeMod = 1; //Size multiplier on top of objSize
        this.removable = false;
        this.scale = createVector(1, 1);
    }


    render() {
        if (!this.img) {
            return;
        }

        const size = objSize * this.sizeMod;

        push();
        translate(this.pos.x, this.pos.y);
        rotate(this.rotation);
        scale(this.scale.x, this.scale.y);
        image(this.img, -size / 2, -size / 2, size, size);
        pop();
    }

    //Basic circle collision
    collisionWith(other) {
        const distCheck = (objSize * this.sizeMod + objSize * other.sizeMod) / 2.25;

        if (dist(this.pos.x, this.pos.y, other.pos.x, other.pos.y) < distCheck) {
            return true;
        } else {
            return false;
        }
    }

    collisionWithCollectible(other) {
        const distCheck = (objSize * this.sizeMod + objSize * other.sizeMod) / 1.75;

        if (dist(this.pos.x, this.pos.y, other.pos.x, other.pos.y) < distCheck) {
            return true;
        } else {
            return false;
        }
    }
}

export class Player extends Entity {
    constructor(x, y, type) {
        super(x, y);

        this.img = imgPlayer;
        this.gravity = objSize * 0.02;
        this.velocityY = 0;
        this.jumpStrength = objSize * 0.42; //.42
        this.sizeMod = globalSizeMod;
        this.animTimer = 0;
        this.wasGrounded = false;
        this.jumpCount = 0;
        this.maxJumps = Koji.config.settings.maxJumps;
        this.jumpAnimTimer = 0;
        this.landAnimTimer = 0;

        this.bottom = groundLevel - groundSizeMod * objSize / 2 - this.sizeMod * objSize / 2;
        this.type = type;


        if(type == 1){
          this.img = imgPlayer1;
          this.bottom = midLevel - groundSizeMod * objSize / 2 - this.sizeMod * objSize / 2;
        }
        
        this.modifierY = 0;

        this.isPowerupEnabled = false;

        this.powerupDuration = Koji.config.settings.powerupDuration;
        this.powerupTimer = 0;

        this.invincibilityTimer = 0;

    }

    update() {

        const isNowGrounded = this.isGrounded();

        if (isNowGrounded) {
            this.velocityY = 0;
        } else {
            this.velocityY += this.gravity;
        }

        this.handleLanding();

        this.pos.y += this.velocityY;
        this.pos.y = constrain(this.pos.y, 0, this.bottom);

        this.wasGrounded = isNowGrounded;

        this.handlePowerup();
        this.handleCollisionCollectibles();
        this.handleCollisionObstacles();
        this.handleLandingAnimation();
        this.handleJumpingAnimation();

        this.invincibilityTimer -= 1 / frameRate();
    }

    handleCollisionObstacles() {
        if (!hasGameEnded) {
            for (let i = 0; i < obstacles.length; i++) {
                if (this.collisionWith(obstacles[i])) {
                    obstacles[i].handleDestroy();

                    if (!this.isPowerupEnabled && this.invincibilityTimer <= 0) {
                        this.loseLife();
                    }

                    break;
                }
            }
        }
    }

    handleCollisionCollectibles() {
        for (let i = 0; i < collectibles.length; i++) {
            if (this.collisionWith(collectibles[i])) {
                collectibles[i].handleCollect();
                break;
            }
        }
    }

    handleTap() {
        if (this.canJump() || this.jumpCount < this.maxJumps) {
            this.jump();
        }
    }

    jump() {
        this.pos.y -= 8;
        this.velocityY = -this.jumpStrength;

        spawnJumpParticles(this.pos.x, this.pos.y + objSize * this.sizeMod / 2, 5);

        this.jumpCount++;
        this.jumpAnimTimer = 0;

        if (sndJump) {
            sndJump.play();
        }
    }

    isGrounded() {
        if (this.pos.y >= this.bottom) {
            return true;
        }

        return false;

    }

    canJump() {
        if (this.pos.y > groundLevel - groundSizeMod * objSize / 2 - this.sizeMod * objSize / 2 - this.velocityY * 4) {
            return true;
        }

        return false;
    }

    handleLanding() {
        if (this.isGrounded() && !this.wasGrounded && !hasGameEnded) {
            this.landAnimTimer = 0;
            spawnLandingParticles(this.pos.x, this.pos.y + objSize * this.sizeMod / 2, 10);
            this.jumpCount = 0;
        }
    }

    handleLandingAnimation() {
        if (this.landAnimTimer < 1) {
            this.landAnimTimer += 1 / frameRate() * 3;

            this.scale.y = Ease(EasingFunctions.easeOutCubic, this.landAnimTimer, 0.5, 0.5);
            this.modifierY = Ease(EasingFunctions.easeOutCubic, this.landAnimTimer, this.sizeMod * objSize / 4, -this.sizeMod * objSize / 4);
        }
    }

    handleJumpingAnimation() {
        if (this.jumpAnimTimer < 1) {
            this.jumpAnimTimer += 1 / frameRate() * 1.75;

            const animationType = Koji.config.settings.playerJumpAnimation;

            if (animationType == 'frontflip') {
                this.rotation = Ease(EasingFunctions.easeOutCubic, this.jumpAnimTimer, 0, Math.PI * 2);
            }

            if (animationType == 'backflip') {
                this.rotation = Ease(EasingFunctions.easeOutCubic, this.jumpAnimTimer, 0, -Math.PI * 2);
            }

            if (animationType == 'elongate') {
                this.scale.y = Ease(EasingFunctions.easeOutCubic, this.jumpAnimTimer, 1.5, -0.5);
            }
        } else {
            this.rotation = 0;
        }
    }

    handlePowerup() {
        if (this.isPowerupEnabled) {
            this.powerupTimer -= 1 / frameRate();

            if (this.powerupTimer <= 0) {
                this.deactivatePowerup();
            }

            if (this.powerupTimer <= 0.5) {
                globalSpeedModifier = 1;
            }
        }
    }

    activatePowerup() {
        this.powerupTimer = this.powerupDuration;
        this.isPowerupEnabled = true;
        this.img = imgPlayerPowerup;
        globalSpeedModifier = 2;
    }

    deactivatePowerup() {
        this.isPowerupEnabled = false;
        this.img = imgPlayer;

        if(this.type == 1){
          this.img = imgPlayer1;
        }

    }

    loseLife() {
        lives--;

        if (sndGameOver) {
            sndGameOver.play();
        }

        if (lives <= 0) {
            spawnParticles(this.pos.x, this.pos.y, 20);
            // playerDeath = new PlayerDeath(this.pos.x, this.pos.y);
            endGame();
        } else {
            this.activateInvincibility();
        }
    }

    activateInvincibility() {
        this.invincibilityTimer = 1;
    }

    render() {
        if (hasGameEnded) {
            return;
        }

        if (this.invincibilityTimer > 0) {
            if ((floor(this.invincibilityTimer * 10)) % 2 == 0) {
                return;
            }
        }


        const size = objSize * this.sizeMod;

        push();
        translate(this.pos.x, this.pos.y + this.modifierY);
        rotate(this.rotation);
        scale(this.scale.x, this.scale.y);
        image(this.img, -size / 2, -size / 2, size, size);
        pop();

    }
}


class PlayerDeath extends Entity {
    constructor(x, y) {
        super(x, y);
        this.sizeModStart = globalSizeMod;
        this.sizeMod = this.sizeModStart;
        this.sizeModGoal = globalSizeMod * 12;
        this.animTimer = 0;
        this.gravity = objSize * 0.035;
        this.velocityY = -objSize * 0.9;
        this.img = imgPlayer;
        this.rotSpeed = 0.1;

        this.hasHitScreen = false;
    }

    update() {

       
    
        this.velocityY += this.gravity;

        this.pos.y += this.velocityY;

        this.pos.x = Smooth(this.pos.x, width / 2, 12);

        if (this.animTimer < 1) {
            this.animTimer += 1 / frameRate() * 0.15;

            this.sizeMod = Ease(EasingFunctions.easeOutCubic, this.animTimer, this.sizeModStart, this.sizeModGoal - this.sizeModStart);
        }

        this.rotation += this.rotSpeed;
    }
}

export class Obstacle extends Entity {
    constructor(x, y) {
        super(x, y);

        this.img = imgObstacle[floor(random() * imgObstacle.length)];
        this.sizeMod = globalSizeMod;

        this.isAir = false;

        this.handleCollectibleSpawn();

        this.isDestroyed = false;
    }

    handleCollectibleSpawn() {
        if (random() * 100 < Koji.config.settings.collectibleRate) {
            this.spawnCollectible();
        }
    }

    spawnCollectible() {
        const x = this.pos.x;
        // const x = width + objSize * 10;
        // let y = this.pos.y;
        let y = this.pos.y - globalSizeMod * objSize* random(1, 1.5);

        if (this.isAir) {
            if (random() < 0.5) {
                y = this.pos.y + globalSizeMod * objSize;
            }
        }

        if (random() * 100 < Koji.config.settings.powerupRate && !player.isPowerupEnabled) {
            collectibles.push(new Powerup(x, y));
        } else {
            collectibles.push(new Collectible(x, y));
        }
    }

    update() {
        this.pos.x -= globalSpeed;

        if (this.isOffscreen() || this.isDestroyed) {
            this.removable = true;
        }

    }

    handleDestroy() {
        if (!this.isDestroyed) {
            spawnParticles(this.pos.x, this.pos.y, 5);


            if (player.isPowerupEnabled) {
                spawnScoreText(this.pos.x, this.pos.y - this.sizeMod * objSize);
                addScore(scoreGain);
                // spawnCollectibleParticles(this.pos.x, this.pos.y, 6);
            }


            this.isDestroyed = true;
        }
    }

    isOffscreen() {
        if (this.pos.x < -objSize * this.sizeMod) {
            return true;
        } else {
            return false;
        }
    }
}

export class Collectible extends Entity {
    constructor(x, y) {
        super(x, y);

        this.img = imgCollectible[floor(random() * imgCollectible.length)];
        this.sizeMod = globalSizeMod * 0.75;

        this.rotSpeed = 0.02;

        this.animationType = Koji.config.settings.collectibleAnimation;

        if (this.animationType == 'rotateClockwise' || this.animationType == 'rotateCounterClockwise') {
            this.rotation = random(0, Math.PI);
        }

        this.animTimer = random(0, 1);
        this.isCollected = false;
    }

    update() {
        this.pos.x -= globalSpeed;

        this.handleAnimation();

        if (this.isCollected) {
            this.removable = true;
        }
    }

    handleAnimation() {
        if (this.animationType == 'rotateClockwise') {
            this.rotation += this.rotSpeed;
        }
        if (this.animationType == 'rotateCounterClockwise') {
            this.rotation -= this.rotSpeed;
        }
        if (this.animationType == 'pulse') {
            this.animTimer += 1 / frameRate();

            this.sizeMod += SineWave(0.0125, 0.3, this.animTimer);
        }
    }

    handleCollect() {
        if (!this.isCollected && !hasGameEnded) {

            this.isCollected = true;

            addScore(scoreGain);

            spawnScoreText(this.pos.x, this.pos.y - objSize * this.sizeMod);

            spawnCollectibleParticles(this.pos.x, this.pos.y, 10);

            if (sndCollect) {
                sndCollect.play();
            }
        }
    }
}

class Powerup extends Collectible {
    constructor(x, y) {
        super(x, y);

        this.img = imgPowerup;
    }


    handleCollect() {
        if (!this.isCollected && !hasGameEnded) {

            this.isCollected = true;

            spawnPowerupParticles(this.pos.x, this.pos.y, 10);

            addScore(scoreGain);

            spawnPowerupText();

            player.activatePowerup();
            player1.activatePowerup();

            if (sndPowerup) {
                sndPowerup.play();
            }
        }
    }
}

export class Ground {
    constructor() {
        this.posY = groundLevel;
        this.posY2 = midLevel;
        this.sizeMod = groundSizeMod;
        this.img = imgGroundTile;

        this.posX = [];
        this.generateGround();
    }

    generateGround() {
        const tileSize = this.sizeMod * objSize;
        const tileCount = ceil(width / tileSize) + 2;

        for (let i = 0; i < tileCount; i++) {
            this.posX.push(i * tileSize);
        }
    }

    update() {

        for (let i = 0; i < this.posX.length; i++) {
            if (this.posX[i] < -this.sizeMod * objSize / 2) {
                this.posX[i] = this.getRightMostTile() + this.sizeMod * objSize;

            }
            this.posX[i] -= globalSpeed*0.02;
        }
    }

    getRightMostTile() {
        let rightmost = this.posX[0];

        for (let i = 1; i < this.posX.length; i++) {
            if (this.posX[i] > rightmost) {
                rightmost = this.posX[i];
            }
        }

        return rightmost;
    }

    render() {
        const size = objSize * this.sizeMod;

        for (let i = 0; i < this.posX.length; i++) {
            push();
            translate(this.posX[i], this.posY);
            image(this.img, -size / 2, -size / 2, size, size);
            pop();

            push();
            translate(this.posX[i], this.posY2);
            image(this.img, -size / 2, -size / 2, size, size);
            pop();
        }
    }
}


export class Particle extends Entity {
    constructor(x, y) {
        super(x, y);

        let maxVelocity = 9;
        this.velocity = createVector(random(-maxVelocity, maxVelocity), random(-maxVelocity, maxVelocity));
        this.defaultVelocity = createVector(this.velocity.x, this.velocity.y);
        this.defaultSizeMod = random(1, 2);
        this.sizeMod = this.defaultSizeMod;
        this.defaultRotSpeed = random(-0.4, 0.4);
        this.rotSpeed = this.defaultRotSpeed;
        this.decayFactor = 12;
        this.rotation = random() * Math.PI * 2;
        this.img = imgParticle;
        this.animTimer = 0;
        this.lifetime = 0.75;
    }

    update() {
        if (this.animTimer < 1) {
            this.animTimer += 1 / frameRate() / this.lifetime;

            this.velocity.x = Ease(EasingFunctions.easeOutQuad, this.animTimer, this.defaultVelocity.x, -this.defaultVelocity.x);
            this.velocity.y = Ease(EasingFunctions.easeOutQuad, this.animTimer, this.defaultVelocity.y, -this.defaultVelocity.y);
            this.sizeMod = Ease(EasingFunctions.easeOutQuint, this.animTimer, this.defaultSizeMod, -this.defaultSizeMod * 0.99);
            this.rotSpeed = Ease(EasingFunctions.easeOutQuint, this.animTimer, this.defaultRotSpeed, -this.defaultRotSpeed);
            this.rotation += this.rotSpeed;

            this.pos.add(this.velocity);
        } else {
            this.removable = true;
        }
    }
}

export class FloatingText {
    constructor(x, y, txt) {
        this.pos = createVector(x, y);
        this.size = 1;
        this.maxSize = objSize * 0.75;
        this.timer = 0.65;
        this.txt = txt;
        this.color = textColor;
        this.maxVelocityY = -objSize * 0.075;
        this.velocityY = objSize * 0.3;
        this.alpha = 1;
        this.animTimer = 0;
        this.easeFunction = EasingFunctions.easeOutElastic;
        this.shouldPulse = false;

    }

    update() {

        if (this.animTimer < 1) {
            this.animTimer += 1 / frameRate() * 1 / 0.65;
            this.size = Ease(this.easeFunction, this.animTimer, 1, this.maxSize);
        } else {
            if (this.shouldPulse) {
                this.size += CosineWave(objSize * 0.015, 0.2, this.timer);
            }
        }

        if (this.timer < 0.3) {
            this.alpha = Smooth(this.alpha, 0, 4);
        }

        this.velocityY = Smooth(this.velocityY, this.maxVelocityY, 4);
        this.pos.y += this.velocityY;

        this.timer -= 1 / frameRate();
    }

    render() {
        push();
        textSize(this.size);
        fill('rgba(' + red(this.color) + ',' + green(this.color) + ',' + blue(this.color) + ',' + this.alpha + ')');
        textAlign(CENTER, BOTTOM);
        text(this.txt, this.pos.x, this.pos.y);
        pop();
    }
}

export function spawnParticles(x, y, amount) {
    for (let i = 0; i < amount; i++) {
        particles.push(new Particle(x, y));
    }
}

function spawnJumpParticles(x, y, amount) {
    for (let i = 0; i < amount; i++) {
        const particle = new Particle(x, y);
        particle.lifetime = 0.5;
        const maxVelocity = 6;
        particle.velocity = createVector(random(-maxVelocity, maxVelocity), random(0, maxVelocity));
        particle.defaultVelocity = createVector(particle.velocity.x, particle.velocity.y);

        particles.push(particle);
    }

}

function spawnLandingParticles(x, y, amount) {
    for (let i = 0; i < amount; i++) {
        const particle = new Particle(x, y);
        particle.lifetime = 0.5;
        const maxVelocity = 6;
        particle.velocity = createVector(random(-maxVelocity, maxVelocity), random(-maxVelocity, 0));
        particle.defaultVelocity = createVector(particle.velocity.x, particle.velocity.y);

        particles.push(particle);
    }

}

function spawnCollectibleParticles(x, y, amount) {
    for (let i = 0; i < amount; i++) {
        const particle = new Particle(x, y);
        particle.img = imgCollectible[floor(random() * imgCollectible.length)];

        particles.push(particle);
    }

}

function spawnPowerupParticles(x, y, amount) {
    for (let i = 0; i < amount; i++) {
        const particle = new Particle(x, y);
        particle.img = imgPowerup;

        particles.push(particle);
    }

}

export class Guide extends Entity {
    constructor(x, y) {
        super(x, y);

        this.img = imgGuide;

        this.timer = 3;
        this.animTimer = 0;
        this.startY = this.pos.y;
        this.moveAmount = objSize;
        this.sizeMod = 2;

        this.playerDummy = new PlayerDummy(width /2 , height * 0.85, 0);

        this.playerDummy1 = new PlayerDummy(width /2 , height * 0.55, 1);

    }

    update() {

        if (this.animTimer < 1) {
            this.animTimer += 1 / frameRate() * 1;
        } else {
            this.animTimer = 0;

            this.playerDummy.handleTap();
            this.playerDummy1.handleTap();
        }

        this.pos.y = this.startY + SineWave(objSize * 0.5, 0.25, this.animTimer)


        this.timer -= 1 / frameRate();

        this.playerDummy.update();
        
        this.playerDummy1.update();



        if (this.timer <= 0) {
            this.removable = true;
        }
    }

    render() {


        this.playerDummy.render();

        this.playerDummy1.render();

        super.render();

    }
}

export class BackgroundLayer {
    constructor(index) {
        this.x1 = 0
        this.x2 = width;

        this.img = imgBackground[index];

        this.speedModifier = backgroundSpeedFactorMax * (index / imgBackground.length);
        if(imgBackground.length == 1){
          this.speedModifier = backgroundSpeedFactorMax;
        }

    }

    update() {
        if (player) {
            if (this.x1 < -width) {
                this.x1 = width;
            }
            if (this.x2 < -width) {
                this.x2 = width;
            }

            this.x1 -= this.speedModifier * globalSpeed;
            this.x2 -= this.speedModifier * globalSpeed;
        }
    }

    render() {
        image(this.img, this.x1, 0, width + 4, height);

        image(this.img, this.x2, 0, width + 4, height);
    }
}

function spawnScoreText(x, y) {
    const floatingText = new FloatingText(x, y, "+" + scoreGain);
    floatingText.maxSize = objSize * 0.75;

    floatingTexts.push(floatingText);
}

function spawnPowerupText() {
    const floatingText = new FloatingText(width / 2, height / 2, Koji.config.settings.powerupText);
    floatingText.maxSize = objSize * 1.5;

    floatingTexts.push(floatingText);
}

class PlayerDummy extends Entity {
    constructor(x, y, type) {
        super(x, y);

        this.img = imgPlayer;
        this.gravity = objSize * 0.02;
        this.velocityY = 0;
        this.jumpStrength = objSize * 0.42;
        this.sizeMod = globalSizeMod * 0.65;
        this.animTimer = 0;
        this.wasGrounded = false;

        this.bottom = height * 0.85;
    
        if(type == 1){
            this.img = imgPlayer1;
            this.bottom = height * 0.65;
        }

        this.jumpAnimTimer = 0;
        this.landAnimTimer = 0;

        this.modifierY = 0;

    }

    update() {

        const isNowGrounded = this.isGrounded();

        if (isNowGrounded) {
            this.velocityY = 0;
        } else {
            this.velocityY += this.gravity;
        }

        this.handleLanding();

        this.pos.y += this.velocityY;
        this.pos.y = constrain(this.pos.y, 0, this.bottom);

        this.wasGrounded = isNowGrounded;

        this.handleLandingAnimation();
        this.handleJumpingAnimation();

    }

    handleTap() {
        this.jump();
    }

    jump() {
        
        this.pos.y = this.bottom - 8;
        this.velocityY = -this.jumpStrength;

        spawnJumpParticles(this.pos.x, this.pos.y + objSize * this.sizeMod / 2, 5);

        this.jumpAnimTimer = 0;
    }

    isGrounded() {
        if (this.pos.y >= this.bottom) {
            return true;
        }

        return false;

    }

    handleLanding() {
        if (this.isGrounded() && !this.wasGrounded) {
            this.landAnimTimer = 0;
            spawnLandingParticles(this.pos.x, this.pos.y + objSize * this.sizeMod / 2, 10);
            this.jumpCount = 0;
        }
    }

    handleLandingAnimation() {
        if (this.landAnimTimer < 1) {
            this.landAnimTimer += 1 / frameRate() * 3;

            this.scale.y = Ease(EasingFunctions.easeOutCubic, this.landAnimTimer, 0.5, 0.5);
            this.modifierY = Ease(EasingFunctions.easeOutCubic, this.landAnimTimer, this.sizeMod * objSize / 4, -this.sizeMod * objSize / 4);
           

        }
    }

    handleJumpingAnimation() {
        if (this.jumpAnimTimer < 1) {
            this.jumpAnimTimer += 1 / frameRate() * 1.75;

            const animationType = Koji.config.settings.playerJumpAnimation;

            if (animationType == 'frontflip') {
                this.rotation = Ease(EasingFunctions.easeOutCubic, this.jumpAnimTimer, 0, Math.PI * 2);
            }

            if (animationType == 'backflip') {
                this.rotation = Ease(EasingFunctions.easeOutCubic, this.jumpAnimTimer, 0, -Math.PI * 2);
            }

            if (animationType == 'elongate') {
                this.scale.y = Ease(EasingFunctions.easeOutCubic, this.jumpAnimTimer, 1.5, -0.5);
            }
        } else {
            this.rotation = 0;
        }
    }

    render() {
        const size = objSize * this.sizeMod;

        push();
        translate(this.pos.x, this.pos.y + this.modifierY);
        rotate(this.rotation);
        scale(this.scale.x, this.scale.y);
        image(this.img, -size / 2, -size / 2, size, size);
        pop();

    }
}