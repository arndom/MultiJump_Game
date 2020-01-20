
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
        const distCheck = (objSize * this.sizeMod + objSize * other.sizeMod) / 2;

        if (dist(this.pos.x, this.pos.y, other.pos.x, other.pos.y) < distCheck) {
            return true;
        } else {
            return false;
        }
    }
}

export class Player extends Entity {
    constructor(x, y) {
        super(x, y);

        this.img = imgPlayer;
        this.gravity = objSize * 0.02;
        this.velocityY = 0;
        this.jumpStrength = objSize * 0.4;
        this.sizeMod = 3;
        this.animTimer = 0;
    }

    update() {
        this.velocityY += this.gravity;
        this.pos.y += this.velocityY;

        if (this.isInCollision()) {
            if (!hasGameEnded) {
                spawnParticles(this.pos.x, this.pos.y, 20);
                endGame();
            }

        }

        if (this.animTimer < 1) {
            this.animTimer += 1 / frameRate() * 3;

            this.scale.y = Ease(EasingFunctions.outBack, this.animTimer, 1.5, -0.5);
        }
    }

    isInCollision() {
        for (let i = 0; i < obstacles.length; i++) {
            if (this.collisionWith(obstacles[i])) {
                return true;
            }
        }

        return false;
    }

    handleTap() {
        this.velocityY = -this.jumpStrength;
        this.animTimer = 0;

        spawnJumpParticles(this.pos.x, this.pos.y + objSize * this.sizeMod / 2, 5);
    }

    isOffscreen() {
        if (this.pos.y < -objSize * this.sizeMod / 2 || this.pos.y > height + objSize * this.sizeMod / 2) {
            return true;
        } else {
            return false;
        }
    }

    render() {
        if (hasGameEnded) {
            return;
        }

        super.render();
    }
}

export class Obstacle extends Entity {
    constructor(x, y) {
        super(x, y);

        this.img = imgObstacle[floor(random() * imgObstacle.length)];
        this.sizeMod = random(2, 2.5);
        this.timer = 0;
        this.sizeMod = 6;
        this.doesGiveScore = false;

    }

    update() {
        this.pos.x -= globalSpeed;

        this.timer += 1 / frameRate();

        if (this.isOffscreen() && this.timer > 1) {
            if (this.doesGiveScore) {
                addScore(scoreGain);
            }

            this.removable = true;
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

export class Guide extends Entity {
    constructor(x, y) {
        super(x, y);

        this.img = imgGuide;

        this.timer = 3;
        this.animTimer = 0;
        this.startY = this.pos.y;
        this.moveAmount = objSize;
        this.sizeMod = 2;
    }

    update() {

        if (this.animTimer < 1) {
            this.animTimer += 1 / frameRate() * 3;
        } else {
            this.animTimer = 0;
        }

        this.pos.y = this.startY + CosineWave(objSize * 0.5, 0.25, this.animTimer)


        this.timer -= 1 / frameRate();

        if (this.timer <= 0) {
            this.removable = true;
        }
    }
}

export class BackgroundLayer {
  constructor(index) {
    this.x1 = 0
    this.x2 = width;

    this.img = imgBackground[index];

    this.speedModifier = backgroundSpeedFactorMax * (index / imgBackground.length);

  }

  update() {
    if (player) {
      this.x1 -= this.speedModifier * objSize;
      this.x2 -= this.speedModifier * objSize;

      if (this.x1 < -width) {
        this.x1 = width;
      }
      if (this.x2 < -width) {
        this.x2 = width;
      }
    }


  }

  render() {
    image(this.img, this.x1, 0, width, height);

    image(this.img, this.x2, 0, width, height);
  }
}