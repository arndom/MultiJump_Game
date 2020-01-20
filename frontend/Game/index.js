import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

class Game extends PureComponent {
    static propTypes = {
        getAppView: PropTypes.func,
        setAppView: PropTypes.func,
        setOutcome: PropTypes.func,
        setScore: PropTypes.func,
    };

    static defaultProps = {

        getAppView() { },
        setAppView() { },
        setOutcome() { },
        setScore() { },
    };

    initGame = () => {
        window.getAppView = this.props.getAppView;
        window.setAppView = this.props.setAppView;
        window.setScore = this.props.setScore;
        window.setOutcome = this.props.setOutcome;

        // Require the functions
        window.preload = require('../Game/preload').default;
        window.setup = require('../Game/setup').default;
        window.draw = require('../Game/draw').default;
        window.touchStarted = require('../Game/draw').touchStarted;
        window.touchEnded = require('../Game/draw').touchEnded;
        window.keyPressed = require('../Game/draw').keyPressed;
        window.keyReleased = require('../Game/draw').keyReleased;
        window.windowResized = require('../Game/draw').windowResized;
        window.detectMobile = require('../Game/utilities.js').detectMobile;
        window.submitScore = require('../Game/utilities.js').submitScore;
        window.playMusic = require('../Game/utilities.js').playMusic;
        window.Entity = require('../Game/entities.js').Entity;
        window.Particle = require('../Game/entities.js').Particle;
        window.BackgroundLayer = require('../Game/entities.js').BackgroundLayer;
        window.addScore = require('../Game/draw.js').addScore;
        window.winGame = require('../Game/utilities.js').winGame;
        window.loseGame = require('../Game/utilities.js').loseGame;
        window.endGame = require('../Game/draw.js').endGame;
        window.calculateObjSize = require('../Game/utilities.js').calculateObjSize;

        window.handleWinAnimation = require('../Game/winAnimations.js').handleWinAnimation;


        window.FloatingText = require('../Game/entities.js').FloatingText;
        window.Player = require('../Game/entities.js').Player;
        window.Obstacle = require('../Game/entities.js').Obstacle;
        window.Ground = require('../Game/entities.js').Ground;
        window.Collectible = require('../Game/entities.js').Collectible;
        window.Powerup = require('../Game/entities.js').Powerup;

        window.init = require('../Game/draw.js').init;
        window.Smooth = require('../Game/helpers/functions.js').Smooth;
        window.Ease = require('../Game/helpers/functions.js').Ease;
        window.SineWave = require('../Game/helpers/functions.js').SineWave;
        window.CosineWave = require('../Game/helpers/functions.js').CosineWave;
        window.Guide = require('../Game/entities.js').Guide;
        window.spawnParticles = require('../Game/entities.js').spawnParticles;
        window.spawnExplosion = require('../Game/entities.js').spawnExplosion;

        // Create the game
        this.p5Game = new window.p5(null, document.getElementById('game-container'));
    }
    componentDidMount() {
        try {
            this.initGame();
        } catch (err) {
            console.log('Error starting game: ', err);
        }
    }

    componentDidUpdate() {
        try {
            // Allow refresh of game when the app changes
            this.p5Game.remove();
            this.initGame();
        } catch (err) {
            console.log('Error hot reloading game: ', err);
        }
    }

    componentWillUnmount() {
        try {
            this.p5Game.remove();
        } catch (err) {
            console.log('Error removing game: ', err)
        }
    }

    render() {
        return null;
    }
}

export default Game;