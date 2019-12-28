import React, { Fragment, PureComponent } from 'react';
import styled, { keyframes } from 'styled-components';
import Koji from '@withkoji/vcc';
import Bounce from 'react-reveal/Bounce';
import Fade from 'react-reveal/Fade';
import RubberBand from 'react-reveal/RubberBand';
import Zoom from 'react-reveal/Zoom';
import PropTypes from 'prop-types';
import isDarkColor from 'is-dark-color';

let Reveal = ({ children }) => (
    <div>{children}</div>
);

if (Koji.config.template.config.homeScreenReveal === 'rubberBand') Reveal = ({ children }) => (<RubberBand>{children}</RubberBand>);
if (Koji.config.template.config.homeScreenReveal === 'bounceTop') Reveal = ({ children }) => (<Bounce top>{children}</Bounce>);
if (Koji.config.template.config.homeScreenReveal === 'bounceBottom') Reveal = ({ children }) => (<Bounce bottom>{children}</Bounce>);
if (Koji.config.template.config.homeScreenReveal === 'fadeTop') Reveal = ({ children }) => (<Fade top>{children}</Fade>);
if (Koji.config.template.config.homeScreenReveal === 'fadeBottom') Reveal = ({ children }) => (<Fade bottom>{children}</Fade>);
if (Koji.config.template.config.homeScreenReveal === 'zoomTop') Reveal = ({ children }) => (<Zoom top>{children}</Zoom>);
if (Koji.config.template.config.homeScreenReveal === 'zoomBottom') Reveal = ({ children }) => (<Zoom bottom>{children}</Zoom>);

const PlayButton = styled.button`
  border: 0;
  outline: 0;
  font-size: ${({ homeScreenPlayButtonFontSize }) => `${homeScreenPlayButtonFontSize}px`};
  background: ${({ primaryColor }) => primaryColor};
  color: ${({ primaryColor }) => isDarkColor(primaryColor) ? '#f1f1f1' : '#111111' };
  cursor: pointer;
  padding: 16px;
  border-radius: 4px;
  transition: transform 0.1s;

  &:hover {
    transform: scale(1.2);
  }

  &:active {
    transform: scale(0.9);
  }
`;

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
  border: ${({ homeScreenDisplayType, primaryColor }) => homeScreenDisplayType === 'borderedCard' ? `4px solid ${primaryColor}` : 'none'};
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
  color: #111111;
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
    let CI = () => (
      <Image
        imageHeight={parseInt(Koji.config.template.config.homeScreenLogoHeight, 10)}
        src={Koji.config.template.config.logoImage}
      />
    );

    if (Koji.config.template.config.homeScreenImageLink && Koji.config.template.config.homeScreenImageLink !== '') {
      CI = () => (
        <ImageLinkWrapper
          href={Koji.config.template.config.homeScreenImageLink}
          rel={'nofollow noreferrer'}
          target={'_blank'}
        >
          <Image
            imageHeight={parseInt(Koji.config.template.config.homeScreenLogoHeight, 10)}
            src={Koji.config.template.config.logoImage}
          />
        </ImageLinkWrapper>
      );
    }

    return (
      <Fragment>
        <FlexWrapper>
          <Reveal>
            <ContentWrapper
              id={'content-wrapper'}
              primaryColor={Koji.config.template.config.primaryColor}
              secondaryColor={Koji.config.template.config.secondaryColor}
              homeScreenDisplayType={Koji.config.template.config.homeScreenDisplayType} 
              homeScreenCardBackgroundImage={Koji.config.template.config.homeScreenCardBackgroundImage}
            >
              {
                Koji.config.template.config.logoImage && Koji.config.template.config.logoImage !== '' &&
                <CI />
              }
              {
                Koji.config.template.config.homeScreenTitle && Koji.config.template.config.homeScreenTitle !== '' &&
                  <TextWrapper
                    textColor={Koji.config.template.config.textColor}
                    textFontSize={parseInt(Koji.config.template.config.homeScreenTitleFontSize, 10)}
                  >
                    {Koji.config.template.config.homeScreenTitle}
                  </TextWrapper>
              }
              <PlayButton
                onClick={() => this.props.setAppView('game')}
                homeScreenPlayButtonFontSize={parseInt(Koji.config.template.config.homeScreenPlayButtonFontSize, 10)}
                primaryColor={Koji.config.template.config.primaryColor}
                >
                    {Koji.config.template.config.homeScreenPlayButtonText}
                </PlayButton>
            </ContentWrapper>
          </Reveal>
        </FlexWrapper>
        <SoundIcon
          src={
            this.props.templateConfig.soundEnabled ?
            Koji.config.template.config.soundOnIcon :
            Koji.config.template.config.soundOffIcon
          }
          onClick={this.handleSoundIconClick}
        />
      </Fragment>
    );
  }
}

export default HomeScreen;