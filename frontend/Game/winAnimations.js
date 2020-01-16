class FireworkParticle extends Particle {
    constructor(x, y) {
        super(x, y);

        let maxVelocity = objSize * 0.5;
        this.velocity = createVector(random(-maxVelocity, maxVelocity), random(-maxVelocity, maxVelocity));
        this.defaultVelocity = createVector(this.velocity.x, this.velocity.y);
        this.lifetime = 0.75;


        this.img = imgWinParticle[floor(random() * imgWinParticle.length)];
    }
}

class Confetti extends Entity {
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


class RisingParticle extends Entity {
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

class FallingParticle extends Entity {
    constructor(x, y) {
        super(x, y);
        this.speed = random(objSize * 0.2, objSize * 0.3);
        this.sizeMod = random(0.5, 1);

        this.img = imgWinParticle[floor(random() * imgWinParticle.length)];

        this.animTimer = random(0, 1);
    }

    update() {

        this.animTimer += 1 / frameRate();

        this.pos.y += this.speed;
        this.pos.x += CosineWave(objSize * 0.2, 0.5, this.animTimer);

        if (this.pos.y > height + this.sizeMod * objSize) {
            this.removable = true;
        }
    }
}

function spawnRisingParticle() {
    const x = random(0, width);
    const y = height + objSize * 2;
    particles.push(new RisingParticle(x, y));
}

function spawnFallingParticle() {
    const x = random(0, width);
    const y = - objSize * 2;
    particles.push(new FallingParticle(x, y));
}

function spawnConfetti() {
    const x = random(0, width);
    const y = -objSize * 2;
    particles.push(new Confetti(x, y));
}

function spawnFireworks(x, y, amount) {
    for (let i = 0; i < amount; i++) {
        particles.push(new FireworkParticle(x, y));
    }
}


function manageFireworks() {
    fireworkTimer -= 1 / frameRate();

    if (fireworkTimer <= 0) {
        fireworkTimer = fireworkInterval * random(0.8, 1.2);
        spawnFireworks(random(0, width), random(0, height), random(20, 30));
    }
}



export function handleWinAnimation() {
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

        if (animationSetting == 'falling') {
            spawnFallingParticle();
        }
    }
}