import React, { Fragment, PureComponent } from 'react';
import styled, { keyframes } from 'styled-components';
import GameScreen from './Screens/Game';
import PostGameScreen from './Screens/PostGame';
import HomeScreen from './Screens/Home';
import LeaderboardModal from './Modals/Leaderboard';
import Koji from '@withkoji/vcc';
import Modal from 'react-modal';
import WebFont from 'webfontloader';
import Fade from 'react-reveal/Fade';

const Container = styled.div`
  width: 100vw;
  height: 100vh;
  background: ${({ backgroundColor, backgroundImage, backgroundImageMode }) => {
    if (backgroundImage && backgroundImage !== '') {
      return `url("${backgroundImage}") no-repeat center center / ${backgroundImageMode}`;
    }
    return backgroundColor;
  }}
`;

const GameScreenWrapper = styled.div`
    display: ${({ show }) => show ? 'block' : 'none'}
`;

// Set the root element for our modal
Modal.setAppElement('#root');

// Template level config is stored on the window
window.__template_config = {};

class App extends PureComponent {
  state = {
    initView: Koji.config.template.config.startScreen,
    leaderBoardModalIsOpen: false,
    outcome: undefined,
    score: 0,
    templateConfig: {
      soundEnabled: true,
    },
    view: Koji.config.template.config.startScreen || 'home',
  };

  componentDidMount() {
    // Expose the setScore function
    window.setScore = score => this.setState({ score });
    
    // Set the font; fallback to Roboto
    this.loadFont();
  }

  componentDidUpdate(prevState, prevProps) {
    if (this.state.initView !== Koji.config.template.config.startScreen) {
      this.setState({ initView: Koji.config.template.config.startScreen, view: Koji.config.template.config.startScreen });
    }

    if (Koji.config.template.config.fontFamily !== document.body.style.fontFamily) {
      this.loadFont();
    }
    
    window.__template_config = this.state.templateConfig;
  }

  loadFont = () => {
    WebFont.load({ google: { families: [Koji.config.template.config.fontFamily] } });
    document.body.style.fontFamily = Koji.config.template.config.fontFamily;
  };

  setTemplateConfig = (newConfig) => {
    this.setState({
      templateConfig: {
        ...this.state.templateConfig,
        ...newConfig,
      }
    });
  }

  render() {
    return (
      <Container
        backgroundImage={Koji.config.template.config.backgroundImage}
        backgroundImageMode={Koji.config.template.config.backgroundImageMode}
      >
        {
          this.state.view === 'home' &&
          <HomeScreen
            setAppView={view => this.setState({ view })}
            setTemplateConfig={this.setTemplateConfig}
            templateConfig={this.state.templateConfig}
          />
        }

        <GameScreenWrapper show={this.state.view === 'game'}>
            <GameScreen
                getAppView={() => this.state.view}
                setAppView={view => this.setState({ view })}
                setOutcome={outcome => this.setState({ outcome })}
                setScore={score => this.setState({ score })}
                view={this.state.view === 'game'}
            />
        </GameScreenWrapper>

        {
          this.state.view === 'postGame' &&
          <PostGameScreen
            outcome={this.state.outcome}
            showLeaderboard={() => this.setState({ leaderBoardModalIsOpen: true })}
            score={this.state.score}
            setAppView={view => this.setState({ view })}
          />
        }
        <LeaderboardModal
          isOpen={this.state.leaderBoardModalIsOpen}
          onCloseClick={() => this.setState({ leaderBoardModalIsOpen: false })}
        />
      </Container>
    );
  }
}

export default App;
