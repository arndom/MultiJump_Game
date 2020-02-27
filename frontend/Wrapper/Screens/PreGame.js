import React, { Fragment, PureComponent } from 'react';
import styled from 'styled-components';
import Koji from '@withkoji/vcc';
import PropTypes from 'prop-types';
import isDarkColor from 'is-dark-color';
import Reveal from '../Components/Reveal';

const FlexWrapper = styled.div`
  display: flex;
  width: 100vw;
  height: 100vh;
  justify-content: center;
  align-items: center;
  overflow: hidden;
`;

const Image = styled.img`
  max-height: 100%;
  max-width: 100%;
`;

const TextWrapper = styled.div`
  font-size: ${({ textFontSize }) => `${textFontSize}`};
  color: ${({ textColor }) => `${textColor}`};
  margin: ${({ textFontSize }) => `calc(${textFontSize} / 2) auto`};
`;

const SoundIcon = styled.img`
  position: absolute;
  bottom: 2vh;
  right: 2vh;
`;

const Content = styled.div`
  text-align: center;
  > div {
    height: 25vh;
    width: 90vw;
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

const PlayButton = styled.button`
  font-size: 5vh;
  padding: 1.5vh 10vh;
  border: 0;
  border-radius: 2vh;
  background: ${({ backgroundColor }) => backgroundColor};
  color: ${({ backgroundColor }) => isDarkColor(backgroundColor) ? '#f1f1f1' : '#111111'};
  cursor: pointer;

  transition: transform 0.1s;

  &:hover {
    transform: scale(1.1);
  }

  &:active {
    transform: scale(0.95);
  }
`;

class HomeScreen extends PureComponent {
  static propTypes = {
    setAppView: PropTypes.func,
    setTemplateConfig: PropTypes.func,
    templateConfig: PropTypes.object,
  };

  static defaultProps = {
    setAppView() { },
    setTemplateConfig() { },
    templateConfig: {},
  };

  componentDidMount() {
    const elem = document.getElementById('content-wrapper');
    if (elem && elem.offsetHeight > window.innerHeight * 0.8) {
      elem.style.transform = `scale(${(window.innerHeight / elem.offsetHeight) * 0.8})`;
    }
  }

  handleSoundIconClick = () => {
    this.props.setTemplateConfig({
      soundEnabled: !this.props.templateConfig.soundEnabled,
    });
  };

  render() {
    return (
      <Fragment>
        <FlexWrapper>
          <Reveal revealType={Koji.config.preGameScreen.reveal}>
            <Content>
              <div>
              <Image
                  imageHeight={parseInt(Koji.config.preGameScreen.featuredImageSize, 10)}
                  src={Koji.config.preGameScreen.featuredImage}
                />
              </div>
              <div>
              {
                Koji.config.preGameScreen.titleText && Koji.config.preGameScreen.titleText !== '' &&
                <TextWrapper
                  textColor={Koji.config.preGameScreen.titleColor}
                  textFontSize={'7.5vh'}
                >
                  {Koji.config.preGameScreen.titleText}
                </TextWrapper>
              }
              </div>
              <div>
                <PlayButton
                  backgroundColor={Koji.config.preGameScreen.playButtonColor}
                  onClick={() => this.props.setAppView('game')}
                >
                  {'Play'}
                </PlayButton>
              </div>
            </Content>
          </Reveal>
        </FlexWrapper>
        <SoundIcon
          src={
            this.props.templateConfig.soundEnabled ?
              Koji.config.general.soundOnIcon :
              Koji.config.general.soundOffIcon
          }
          onClick={this.handleSoundIconClick}
        />
      </Fragment>
    );
  }
}

export default HomeScreen;