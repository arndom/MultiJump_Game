import { PureComponent } from 'react';
import PropTypes from 'prop-types';

class Game extends PureComponent {
  static propTypes = {
    getAppView: PropTypes.func,
    setAppView: PropTypes.func,
    setOutcome: PropTypes.func,
    setScore: PropTypes.func,
    view: PropTypes.bool,
  };

  static defaultProps = {
    getAppView() {},
    setAppView() {},
    setOutcome() {},
    setScore() {},
  };

  componentDidMount() {
    // Add commands to the global scope
    window.getAppView = this.props.getAppView;
    window.setAppView = this.props.setAppView;
    window.setScore = this.props.setScore;
    window.setOutcome = this.props.setOutcome;

    window.preload = require('../Game/preload').default;
    window.setup = require('../Game/setup').default;
    window.draw = require('../Game/draw').default;

    this.initGame();
  }

  initGame = () => {
    if (this.p5Game) this.p5Game.remove();
    this.p5Game = new window.p5(null, document.getElementById('game-container'));
  }

  render() {
    return null;
  }
}

export default Game;
