/*
 * Easing Functions - inspired from http://gizma.com/easing/
 * only considering the t value for the range [0, 1] => [0, 1]
 */
window.EasingFunctions = {
    // no easing, no acceleration
    linear: function (t) { return t },
    // accelerating from zero velocity
    easeInQuad: function (t) { return t * t },
    // decelerating to zero velocity
    easeOutQuad: function (t) { return t * (2 - t) },
    // acceleration until halfway, then deceleration
    easeInOutQuad: function (t) { return t < .5 ? 2 * t * t : -1 + (4 - 2 * t) * t },
    // accelerating from zero velocity 
    easeInCubic: function (t) { return t * t * t },
    // decelerating to zero velocity 
    easeOutCubic: function (t) { return (--t) * t * t + 1 },
    // acceleration until halfway, then deceleration 
    easeInOutCubic: function (t) { return t < .5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1 },
    // accelerating from zero velocity 
    easeInQuart: function (t) { return t * t * t * t },
    // decelerating to zero velocity 
    easeOutQuart: function (t) { return 1 - (--t) * t * t * t },
    // acceleration until halfway, then deceleration
    easeInOutQuart: function (t) { return t < .5 ? 8 * t * t * t * t : 1 - 8 * (--t) * t * t * t },
    // accelerating from zero velocity
    easeInQuint: function (t) { return t * t * t * t * t },
    // decelerating to zero velocity
    easeOutQuint: function (t) { return 1 + (--t) * t * t * t * t },
    // acceleration until halfway, then deceleration 
    easeInOutQuint: function (t) { return t < .5 ? 16 * t * t * t * t * t : 1 + 16 * (--t) * t * t * t * t },

    //Bouncing effect
    easeOutElastic: function (t) {
        var p = 0.3;
        return Math.pow(2, -10 * t) * Math.sin((t - p / 4) * (2 * Math.PI) / p) + 1;
    },

    inBack: function (t) {
        var s = 1.70158;
        return t * t * ((s + 1) * t - s);
    },

    outBack: function (t) {
        var s = 1.70158;
        return --t * t * ((s + 1) * t + s) + 1;
    },

    outBounce: function (t) {
        if (t < (1 / 2.75)) {
            return 7.5625 * t * t;
        } else if (t < (2 / 2.75)) {
            return 7.5625 * (t -= (1.5 / 2.75)) * t + 0.75;
        } else if (t < (2.5 / 2.75)) {
            return 7.5625 * (t -= (2.25 / 2.75)) * t + 0.9375;
        } else {
            return 7.5625 * (t -= (2.625 / 2.75)) * t + 0.984375;
        }
    },

    inOutElastic: function (t) {
        var s, a = 0.1, p = 0.4;
        if (t === 0) return 0;
        if (t === 1) return 1;
        if (!a || a < 1) { a = 1; s = p / 4; }
        else s = p * Math.asin(1 / a) / (2 * Math.PI);
        if ((t *= 2) < 1) return - 0.5 * (a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t - s) * (2 * Math.PI) / p));
        return a * Math.pow(2, -10 * (t -= 1)) * Math.sin((t - s) * (2 * Math.PI) / p) * 0.5 + 1;
    }


}


//A simple function used to call any other easing function from this file
/*
Example usage:
this.pos.x = Ease(EasingFunctions.easeOutQuad, this.animTimer, this.pos.x, this.goalPos.x - this.pos.x);
this.pos.y = Ease(EasingFunctions.easeOutQuad, this.animTimer, this.pos.y, this.goalPos.y - this.pos.y);

//Goes from 1 to 4
this.sizeMod = Ease(EasingFunctions.outBack, this.animTimer, 1, 3);
*/

export function Ease(func, time, start, finish) {
    let t = time;
    if (time > 1) {
        t = 1;
    }
    return finish * func(t) + start;
}

//====


/* 
Example usage:

timer += 1/frameRate();
currentValue += SineWave(2, 0.2, timer);
*/
export function SineWave(amplitude, frequency, timer) {
    return amplitude * Math.sin(timer / frequency);
}

export function CosineWave(amplitude, frequency, timer) {
    return amplitude * Math.cos(timer / frequency);
}


/*
    Formula:
    V = ((V * (N - 1)) + W) / N; 

    V - Current value
    W - Goal value
    N - Factor
    The higher the factor (N), the slower V approaches W.
    
    Example usage, called in draw():
    currentValue = Smooth(currentValue, goalValue, 4);
*/
export function Smooth(current, goal, factor) {
    return ((current * (factor - 1)) + goal) / factor;
}
