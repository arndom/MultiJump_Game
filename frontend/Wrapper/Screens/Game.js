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
    getTemplateConfig: PropTypes.func,
    setOutcome: PropTypes.func,
    setScore: PropTypes.func,
    view: PropTypes.bool,
  };

  static defaultProps = {
    getAppView() {},
    setAppView() {},
    getTemplateConfig() {},
    setOutcome() {},
    setScore() {},
  };

  render() {
    return (
      <GameContainer
        gameBackgroundImage={Koji.config.general.backgroundImage}
        gameBackgroundImageMode={Koji.config.general.backgroundImageMode}
        id={'game-container'}
      >
        <Game
          getAppView={this.props.getAppView}
          setAppView={this.props.setAppView}
          getTemplateConfig={this.props.getTemplateConfig}
          setScore={this.props.setScore}
          setOutcome={this.props.setOutcome}
          view={this.props.view}
        />
      </GameContainer>
    );
  }
}

export default GameScreen;