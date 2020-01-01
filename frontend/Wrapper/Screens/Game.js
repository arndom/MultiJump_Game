import React, { PureComponent } from 'react';
import styled from 'styled-components';
import Koji from '@withkoji/vcc';
import PropTypes from 'prop-types';
import Game from '../../Game';

const GameContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100vw;
  height: 100vh;
`;

class GameScreen extends PureComponent {
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

  render() {
    return (
      <GameContainer
        gameBackgroundImage={Koji.config.template.config.backgroundImage}
        gameBackgroundImageMode={Koji.config.template.config.backgroundImageMode}
        id={'game-container'}
      >
        <Game
          getAppView={this.props.getAppView}
          setAppView={this.props.setAppView}
          setScore={this.props.setScore}
          setOutcome={this.props.setOutcome}
          view={this.props.view}
        />
      </GameContainer>
    );
  }
}

export default GameScreen;