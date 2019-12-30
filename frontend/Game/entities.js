
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
        if(!this.img){
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

export function spawnParticles(x, y, amount) {
    for (let i = 0; i < amount; i++) {
        particles.push(new Particle(x, y));
    }
}

export class Explosion extends Entity {
    constructor(x, y, sizeMod) {
        super(x, y);

        this.defaultSizeMod = sizeMod;
        this.sizeMod = 0.1;
        this.rotation = random() * Math.PI * 2;
        this.img = imgExplosion;
        this.animTimer = 0;
    }

    update() {

        if (this.animTimer < 1) {
            this.animTimer += 1 / frameRate() * 4;
        } else {
            this.removable = true;
        }

        this.sizeMod = Ease(EasingFunctions.outBounce, this.animTimer, 0, this.defaultSizeMod);
    }
}

export function spawnExplosion(x, y, sizeMod) {
    explosions.push(new Explosion(x, y, sizeMod));
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
    }

    update() {

        this.animTimer += 1 / frameRate() * 1 / 0.65;

        //Get dat size bounce effect
        this.size = Ease(EasingFunctions.easeOutElastic, this.animTimer, 1, this.maxSize);

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

//===EXAMPLE
export class Node {
    constructor(x, y) {
        this.pos = createVector(x, y);
        this.sizeMod = random(0.06, 0.1);
        this.velocity = createVector(0, 0);
        this.maxSpeed = 0.0002 * objSize;
        this.velocityChangeTimer = random(3, 5);
        this.drawLine = false;
        this.mouseDist = 0;
        this.maxDist = objSize * 8;
    }

    update() {
        this.velocityChangeTimer -= 1 / frameRate();
        this.maxDist = objSize * 7;
        if (this.velocityChangeTimer <= 0) {
            this.velocityChangeTimer = random(3, 5);
            this.changeVelocity();
        }

        this.pos.add(this.velocity);
        this.mouseDist = dist(this.pos.x, this.pos.y, mouseX, mouseY);
    }

    changeVelocity() {
        this.velocity = createVector(random(-this.maxSpeed, this.maxSpeed) * objSize, random(-this.maxSpeed, this.maxSpeed) * objSize);
    }

    render() {
        let distanceFactor = (1 - (this.mouseDist / this.maxDist));

        //Draw line towards cursor with opacity depending on distance to cursor
        if (this.mouseDist <= this.maxDist) {
            push();
            strokeWeight(objSize * 0.05);
            strokeCap(ROUND);
            let lineColor = color(10, 113, 174, distanceFactor * 200);
            stroke(lineColor);
            line(this.pos.x, this.pos.y, mouseX, mouseY);
            pop();
        }

        //Draw circle with size and opacity depending on distance to cursor
        push();
        let size = objSize * this.sizeMod * (distanceFactor + 1);
        let ballColor = color(10, 113, 174, distanceFactor * 155 + 255);
        fill(ballColor);
        circle(this.pos.x, this.pos.y, size);
        pop();
    }
}
//===
