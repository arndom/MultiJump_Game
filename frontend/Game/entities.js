
/*
    Base entity class, can be used as a base for other drawable objects, used for drawing and checking basic collisions

    IMPORTANT: Make sure to assign it an img variable after instantiating

    Common way to use it:

    let myObject;
    ...
    myObject = new Entity(x, y);
    myObject.img = myImage;

    ...

    draw(){
        ...

        myObject.render();
    }

    If you want to check for collisions with another Entity:

    if(myObject.collisionWith(anotherObject)){
        //do stuff
    }
    
*/
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

    let size = objSize * this.sizeMod;

    push();
    translate(this.pos.x, this.pos.y);
    rotate(this.rotation);
    scale(this.scale.x, this.scale.y);
    image(this.img, -size / 2, -size / 2, size, size);
    pop();
  }

  //Basic circle collision
  collisionWith(other) {
    let distCheck = (objSize * this.sizeMod + objSize * other.sizeMod) / 2;

    if (dist(this.pos.x, this.pos.y, other.pos.x, other.pos.y) < distCheck) {
      return true;
    } else {
      return false;
    }
  }
}

export class TapObject extends Entity {
  constructor(x, y) {
    super(x, y);

    if (random() * 100 < goodBadRatio) {
      this.type = TYPE_GOOD;
    } else {
      this.type = TYPE_BAD;
    }

    if (this.type == TYPE_GOOD) {
      this.img = imgGood[floor(random() * imgGood.length)]
    }

    if (this.type == TYPE_BAD) {
      this.img = imgBad[floor(random() * imgBad.length)]
    }

    this.sizeMod = random(2, 2.5);

    this.moveDir = Math.sign(width / 2 - this.pos.x);
    this.moveSpeed = random(Koji.config.settings.speedMin * objSize, Koji.config.settings.speedMax * objSize);

    this.timer = 0;

    this.isDestroyed = false;

  }

  update() {
    this.pos.x += this.moveSpeed * this.moveDir;

    this.timer += 1 / frameRate();

    if ((this.pos.x < -objSize * this.sizeMod
      || this.pos.x > width + objSize * this.sizeMod)
      && this.timer > 1) {
      this.removable = true;
    }

    if (this.isDestroyed) {
      this.removable = true;
    }
  }

  handleTap() {
    if (this.isMouseOver()) {
      if (!this.isDestroyed) {
        this.isDestroyed = true;

        if (this.type == TYPE_GOOD) {
          spawnParticlesGood(this.pos.x, this.pos.y, 6);
          addScore(scoreGain);
          floatingTexts.push(new FloatingText(this.pos.x, this.pos.y - objSize * this.sizeMod / 2, "+" + scoreGain, textColor, objSize * 1.25));
          if (sndTapGood) {
            sndTapGood.play();
          }
        } else {
          gameTimer -= Koji.config.settings.timePenalty;
          spawnParticlesBad(this.pos.x, this.pos.y, 4);

          floatingTexts.push(new FloatingText(this.pos.x, this.pos.y - objSize * this.sizeMod / 2, "-" + Koji.config.settings.timePenalty + "s", textColor, objSize));

          if (sndTapBad) {
            sndTapBad.play();
          }
        }
      }
    }
  }

  isMouseOver() {
    const distanceRequired = this.sizeMod * objSize * 0.75;
    const mouseVec = createVector(mouseX, mouseY);

    if (this.pos.dist(mouseVec) <= distanceRequired) {
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
    this.lifetime = 0.5;
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

class ParticleHit extends Particle {
  constructor(x, y) {
    super(x, y);

    this.gravity = objSize * 0.02;

    this.defaultSizeMod = random(0.5, 1);
    this.sizeMod = this.defaultSizeMod;

    this.velocity.x = random(-objSize * 0.2, objSize * 0.2);
    this.velocity.y = random(-objSize * 0.2, objSize * 0.05);
  }

  update() {
    if (this.animTimer < 1) {
      this.animTimer += 1 / frameRate() * 0.3;
    }

    this.velocity.y += this.gravity;
    this.sizeMod = Ease(EasingFunctions.easeOutQuint, this.animTimer, this.defaultSizeMod, -this.defaultSizeMod * 0.75);
    this.rotSpeed = Ease(EasingFunctions.easeOutQuint, this.animTimer, this.defaultRotSpeed, -this.defaultRotSpeed);
    this.rotation += this.rotSpeed;

    this.pos.add(this.velocity);


    if (this.pos.y > height + this.sizeMod * objSize) {
      this.removable = true;
    }
  }




}


function spawnParticlesGood(x, y, amount) {
  for (let i = 0; i < amount; i++) {
    const particle = new ParticleHit(x, y);
    particle.img = imgParticleGood;

    particles.push(particle);
  }
}

function spawnParticlesBad(x, y, amount) {
  for (let i = 0; i < amount; i++) {
    const particle = new ParticleHit(x, y);
    particle.img = imgParticleBad;

    particles.push(particle);
  }
}



export function spawnParticles(x, y, amount) {
  for (let i = 0; i < amount; i++) {
    particles.push(new Particle(x, y));
  }
}



export class FireworkParticle extends Particle {
    constructor(x, y) {
        super(x, y);

        let maxVelocity = objSize * 0.5;
        this.velocity = createVector(random(-maxVelocity, maxVelocity), random(-maxVelocity, maxVelocity));
        this.defaultVelocity = createVector(this.velocity.x, this.velocity.y);
        this.lifetime = 0.75;


        this.img = imgWinParticle[floor(random() * imgWinParticle.length)];
    }
}

export class Confetti extends Entity {
    constructor(x, y) {
        super(x, y);
        this.speed = random(objSize * 0.05, objSize * 0.085);
        this.time = random(0, 100);
        this.amp = random(2, 30);
        this.phase = random(0.5, 2);
        this.size = random(objSize * 0.5, objSize);

        this.img = imgWinParticle[floor(random() * imgWinParticle.length)];

    }

    update() {
        this.time = this.time + 1 / frameRate() * 5;

        this.pos.y += this.speed;

        if (this.pos.y > height + this.size * 2) {
            this.removable = true;
        }
    }

    render() {
        push();
        translate(this.pos.x, this.pos.y);
        translate(this.amp * sin(this.time * this.phase), this.speed * cos(2 * this.time * this.phase));
        rotate(this.time);
        scale(cos(this.time / 4), sin(this.time / 4));

        image(this.img, -this.size / 2, -this.size / 2, this.size, this.size);
        pop();


    }
}


export class RisingParticle extends Entity {
    constructor(x, y) {
        super(x, y);
        this.speed = random(objSize * 0.2, objSize * 0.3);
        this.sizeMod = random(0.5, 1);

        this.img = imgWinParticle[floor(random() * imgWinParticle.length)];

        this.animTimer = random(0, 1);
    }

    update() {

        this.animTimer += 1 / frameRate();

        this.pos.y -= this.speed;
        this.pos.x += CosineWave(objSize * 0.2, 0.5, this.animTimer);

        if (this.pos.y < - this.sizeMod * objSize) {
            this.removable = true;
        }
    }
}

export function spawnRisingParticle() {
    const x = random(0, width);
    const y = height + objSize * 2;
    particles.push(new RisingParticle(x, y));
}

export function spawnConfetti() {
    const x = random(0, width);
    const y = -objSize * 2;
    particles.push(new Confetti(x, y));
}

export function spawnFireworks(x, y, amount) {
    for (let i = 0; i < amount; i++) {
        particles.push(new FireworkParticle(x, y));
    }
}

//===The way to use Floating Text:
//floatingTexts.push(new FloatingText(...));
//Everything else like drawing, removing it after it's done etc, will be done automatically
export class FloatingText {
    constructor(x, y, txt, color, size) {
        this.pos = createVector(x, y);
        this.size = 1;
        this.maxSize = size;
        this.timer = 0.65;
        this.txt = txt;
        this.color = color;
        this.maxVelocityY = -objSize * 0.075;
        this.velocityY = objSize * 0.3;
        this.alpha = 1;
        this.animTimer = 0;
        this.easeFunction = EasingFunctions.easeOutElastic;

    }

    update() {

        this.animTimer += 1 / frameRate() * 1 / 0.65;

        //Get dat size bounce effect
        this.size = Ease(this.easeFunction, this.animTimer, 1, this.maxSize);

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