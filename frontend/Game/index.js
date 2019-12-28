import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

class Game extends PureComponent {
  static propTypes = {
    setAppView: PropTypes.func,
    setOutcome: PropTypes.func,
    setScore: PropTypes.func,
  };

  static defaultProps = {
    setAppView() { },
    setOutcome() { },
    setScore() { },
  };

  initGame = () => {
    window.setAppView = this.props.setAppView;
    window.setScore = this.props.setScore;
    window.setOutcome = this.props.setOutcome;

    // Require the functions
    window.preload = require('../Game/preload').default;
    window.setup = require('../Game/setup').default;
    window.draw = require('../Game/draw').default;
    window.init = require('../Game/setup').init;
    window.touchStarted = require('../Game/draw').touchStarted;
    window.touchEnded = require('../Game/draw').touchEnded;
    window.detectMobile = require('../Game/utilities.js').detectMobile;
    window.submitScore = require('../Game/utilities.js').submitScore;
    window.playMusic = require('../Game/utilities.js').playMusic;
    window.Entity = require('../Game/entities.js').Entity;
    window.Ball = require('../Game/entities.js').Ball;
    window.addScore = require('../Game/entities.js').addScore;
    window.loseLife = require('../Game/draw.js').loseLife;
    window.Hoop = require('../Game/entities.js').Hoop;
    window.HoopSide = require('../Game/entities.js').HoopSide;
    window.FloatingText = require('../Game/entities.js').FloatingText;
    window.init = require('../Game/draw.js').init;
    window.Smooth = require('../Game/functions.js').Smooth;
    window.Ease = require('../Game/functions.js').Ease;
    window.SineWave = require('../Game/functions.js').SineWave;
    window.CosineWave = require('../Game/functions.js').CosineWave;
    window.Guide = require('../Game/entities.js').Guide;

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