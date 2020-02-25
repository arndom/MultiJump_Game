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
  }

  render() {
    return (
      <div>
        <button
          onClick={() => {
            this.props.setScore(10000);
            this.props.setAppView('postGame');
          }}
        >
          {'End the game with a score of 10,000'}
        </button>
        <button
          onClick={() => {
            this.props.setScore(10);
            this.props.setAppView('postGame');
          }}
        >
          {'End the game with a score of 10'}
        </button>
      </div>
    );
  }
}

export default Game;