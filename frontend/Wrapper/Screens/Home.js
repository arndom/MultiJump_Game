import React, { Fragment, PureComponent } from 'react';
import styled, { keyframes } from 'styled-components';
import Koji from '@withkoji/vcc';
import Bounce from 'react-reveal/Bounce';
import Fade from 'react-reveal/Fade';
import RubberBand from 'react-reveal/RubberBand';
import Zoom from 'react-reveal/Zoom';
import PropTypes from 'prop-types';
import isDarkColor from 'is-dark-color';
import PrimaryButton from '../Buttons/Primary';

let Reveal = ({ children }) => (
    <div>{children}</div>
);

if (Koji.config.preGameScreen.reveal === 'rubberBand') Reveal = ({ children }) => (<RubberBand>{children}</RubberBand>);
if (Koji.config.preGameScreen.reveal === 'bounceTop') Reveal = ({ children }) => (<Bounce top>{children}</Bounce>);
if (Koji.config.preGameScreen.reveal === 'bounceBottom') Reveal = ({ children }) => (<Bounce bottom>{children}</Bounce>);
if (Koji.config.preGameScreen.reveal === 'fadeTop') Reveal = ({ children }) => (<Fade top>{children}</Fade>);
if (Koji.config.preGameScreen.reveal === 'fadeBottom') Reveal = ({ children }) => (<Fade bottom>{children}</Fade>);
if (Koji.config.preGameScreen.reveal === 'zoomTop') Reveal = ({ children }) => (<Zoom top>{children}</Zoom>);
if (Koji.config.preGameScreen.reveal === 'zoomBottom') Reveal = ({ children }) => (<Zoom bottom>{children}</Zoom>);

const FlexWrapper = styled.div`
  display: flex;
  width: 100vw;
  height: 100vh;
  justify-content: center;
  align-items: center;
  overflow: hidden;
`;

const Image = styled.img`
  height: ${({ imageHeight }) => `${imageHeight}vh`};
`;

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 32px;
  max-width: 90vw;

  background: ${({ homeScreenDisplayType, homeScreenCardBackgroundImage, secondaryColor }) => {
      if (homeScreenDisplayType === 'borderedCard') {
          if (homeScreenCardBackgroundImage) {
              return `url("${homeScreenCardBackgroundImage}") no-repeat center center / cover`;
          }
          return secondaryColor;
      } return 'none';
    }};
  border: none;
  border-radius: ${({ homeScreenDisplayType }) => homeScreenDisplayType === 'borderedCard' ? '4px' : '0'};
`;

const ImageLinkWrapper = styled.a`
  transition: transform 0.1s;

  &:hover {
    transform: scale(1.1);
  }

  &:active {
    transform: scale(0.9);
  }
`;

const TextWrapper = styled.div`
  font-size: ${({ textFontSize }) => `${textFontSize}px`};
  color: ${({ textColor }) => `${textColor}`};
  margin: ${({ textFontSize }) => `${textFontSize/ 1.2}px auto`};
`;

const SoundIcon = styled.img`
  position: absolute;
  bottom: 8px;
  right: 8px;
`;

class HomeScreen extends PureComponent {
  static propTypes = {
    setAppView: PropTypes.func,
    setTemplateConfig: PropTypes.func,
    templateConfig: PropTypes.object,
  };

  static defaultProps = {
    setAppView() {},
    setTemplateConfig() {},
    templateConfig: {},
  };

  componentDidMount() {
    const elem = document.getElementById('content-wrapper');
    if (elem && elem.offsetHeight > window.innerHeight * 0.8) {
      elem.style.transform = `scale(${(window.innerHeight / elem.offsetHeight) * 0.8 })`;
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
          <Reveal>
            <ContentWrapper
              id={'content-wrapper'}
              secondaryColor={Koji.config.preGameScreen.cardBackgroundColor}
              homeScreenDisplayType={Koji.config.preGameScreen.displayType} 
              homeScreenCardBackgroundImage={Koji.config.preGameScreen.cardBackgroundImage}
            >
              {
                Koji.config.preGameScreen.featuredImage && Koji.config.preGameScreen.featuredImage !== '' &&
                <Image
                  imageHeight={parseInt(Koji.config.preGameScreen.featuredImageSize, 10)}
                  src={Koji.config.preGameScreen.featuredImage}
                />
              }
              {
                Koji.config.preGameScreen.titleText && Koji.config.preGameScreen.titleText !== '' &&
                  <TextWrapper
                    textColor={Koji.config.preGameScreen.titleColor}
                    textFontSize={parseInt(Koji.config.preGameScreen.titleFontSize, 10)}
                  >
                    {Koji.config.preGameScreen.titleText}
                  </TextWrapper>
              }
              <PrimaryButton
                fontSize={`${parseInt(Koji.config.preGameScreen.playButtonFontSize, 10)}px`}
                onClick={() => this.props.setAppView('game')}
                primaryColor={Koji.config.preGameScreen.playButtonColor}
                text={Koji.config.preGameScreen.playButtonText}
              />
            </ContentWrapper>
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