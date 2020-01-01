import React, { Fragment, PureComponent } from 'react';
import styled, { keyframes } from 'styled-components';
import Koji from '@withkoji/vcc';
import Bounce from 'react-reveal/Bounce';
import Fade from 'react-reveal/Fade';
import RubberBand from 'react-reveal/RubberBand';
import Zoom from 'react-reveal/Zoom';
import PropTypes from 'prop-types';
import isDarkColor from 'is-dark-color';
import LeaderboardSubmitForm from '../Forms/LeaderboardSubmit';
import PrimaryButton from '../Buttons/Primary';
import SecondaryButton from '../Buttons/Secondary';

let Reveal = ({ children }) => (
  <div>{children}</div>
);

if (Koji.config.template.config.postGameScreenReveal === 'rubberBand') Reveal = ({ children }) => (<RubberBand>{children}</RubberBand>);
if (Koji.config.template.config.postGameScreenReveal === 'bounceTop') Reveal = ({ children }) => (<Bounce top>{children}</Bounce>);
if (Koji.config.template.config.postGameScreenReveal === 'bounceBottom') Reveal = ({ children }) => (<Bounce bottom>{children}</Bounce>);
if (Koji.config.template.config.postGameScreenReveal === 'fadeTop') Reveal = ({ children }) => (<Fade top>{children}</Fade>);
if (Koji.config.template.config.postGameScreenReveal === 'fadeBottom') Reveal = ({ children }) => (<Fade bottom>{children}</Fade>);
if (Koji.config.template.config.postGameScreenReveal === 'zoomTop') Reveal = ({ children }) => (<Zoom top>{children}</Zoom>);
if (Koji.config.template.config.postGameScreenReveal === 'zoomBottom') Reveal = ({ children }) => (<Zoom bottom>{children}</Zoom>);

const ButtonLinkWrapper = styled.a`
  margin: 24px 0 0 0;
  border: 0;
  padding: 0;
  outline: 0;
  display: flex;
  justify-content: center;
  text-decoration: none;
`;

const FlexWrapper = styled.div`
  display: flex;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  justify-content: center;
  align-items: center;
`;

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
`;

const CardWrapper = styled.div`
  width: 80vw;
  min-width: 280px;
  max-width: 480px;
  background: rgba(255, 255, 255, 0.9);
  padding: 24px;
  margin-bottom: 16px;

  h1 {
    font-size: 24px;
    margin-bottom: 8px;
  }

  p {
      margin-bottom: 24px;
  }
`;

const Spacer = styled.div`
  margin: 24px 0;
`;

class PostGameScreen extends PureComponent {
  static propTypes = {
    outcome: PropTypes.string,
    setAppView: PropTypes.func,
    showLeaderboard: PropTypes.func,
    score: PropTypes.number,
  };

  static defaultProps = {
    outcome: 'lose',
    setAppView() {},
    showLeaderboard() {},
    score: 0,
  };

  state = {
    formSubmitted: false,
    name: '',
    email: '',
    phone: '',
    optIn: true,
  };

  componentDidMount() {
    const elem = document.getElementById('content-wrapper');
    if (elem && elem.offsetHeight > window.innerHeight) {
      elem.style.transform = `scale(${(window.innerHeight / elem.offsetHeight) * 0.9 })`;
    }
  }

  handleScoreSubmit = e => {
    e.preventDefault();

    const body = {
        name: this.state.name,
        score: this.props.score,
        email: this.state.email,
        optIn: this.state.optIn,
        phone: this.state.phone,
    };
    
    const hash = md5(JSON.stringify(body));

    fetch(`${Koji.config.serviceMap.backend}/leaderboard/save`, {
        method: 'post',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': hash,
        },
        body: JSON.stringify(body),
    })
        .then((response) => response.json())
        .then((jsonResponse) => {
            this.setState({ formSubmitted: true })
        })
        .catch(err => {
            console.log(err);
        });
  };

  render() {
    const { postGameAction } = Koji.config.template.config;

    if (postGameAction === 'traffic') {
        return (
            <FlexWrapper>
                <Reveal>
                    <ContentWrapper id={'content-wrapper'}>
                        <CardWrapper>
                            <h1>{Koji.config.template.config.postGameScreenTitle}</h1>
                            <p>{Koji.config.template.config.postGameScreenText}</p>
                            <ButtonLinkWrapper
                              href={Koji.config.template.config.postGameScreenButtonLink}
                              rel={'nofollow noreferrer'}
                              target={'_blank'}
                            >
                              <PrimaryButton
                                text={Koji.config.template.config.postGameScreenButtonText}
                              />
                            </ButtonLinkWrapper>
                        </CardWrapper>
                        {
                          Koji.config.template.config.postGameScreenShowPlayAgainButton &&
                          <SecondaryButton
                            onClick={() => this.props.setAppView('game')}
                            text={Koji.config.template.config.postGameScreenPlayAgainButtonText}
                          />
                        }
                    </ContentWrapper>
                </Reveal>
            </FlexWrapper>
        );
    }

    if (postGameAction === 'reveal') {
        return (
            <FlexWrapper>
                <Reveal>
                    <ContentWrapper id={'content-wrapper'}>
                        <CardWrapper>
                            <h1>{Koji.config.template.config.postGameScreenTitle}</h1>
                            {
                              this.props.outcome === 'win' &&
                              <div dangerouslySetInnerHTML={{ __html: Koji.config.template.config.postGameWinText }} />
                            }
                            {
                              this.props.outcome === 'lose' &&
                              <div dangerouslySetInnerHTML={{ __html: Koji.config.template.config.postGameLoseText }} />
                            }
                        </CardWrapper>
                        {
                          Koji.config.template.config.postGameScreenShowPlayAgainButton &&
                          <SecondaryButton
                            onClick={() => this.props.setAppView('game')}
                            text={Koji.config.template.config.postGameScreenPlayAgainButtonText}
                          />
                        }
                    </ContentWrapper>
                </Reveal>
            </FlexWrapper>
        );
    }

    if (postGameAction === 'leads') {
        return (
            <FlexWrapper>
                <Reveal>
                    <ContentWrapper id={'content-wrapper'}>
                        <CardWrapper>
                            <h1>{Koji.config.template.config.postGameScreenTitle}</h1>
                            {
                                !this.state.formSubmitted &&
                                <LeaderboardSubmitForm
                                    onSubmitSuccess={() => this.setState({ formSubmitted: true })}
                                    score={this.props.score}
                                />
                            }
                            {
                                this.state.formSubmitted &&
                                <div>
                                    <PrimaryButton
                                        onClick={() => this.props.showLeaderboard()}
                                        text={Koji.config.template.config.viewLeaderboardButtonText}
                                    />
                                </div>
                            }
                        </CardWrapper>
                        {
                          Koji.config.template.config.postGameScreenShowPlayAgainButton &&
                          <SecondaryButton
                            onClick={() => this.props.setAppView('game')}
                            text={Koji.config.template.config.postGameScreenPlayAgainButtonText}
                          />
                        }
                    </ContentWrapper>
                </Reveal>
            </FlexWrapper>
        );
    }

    return (
         <FlexWrapper>
            <Reveal>
                <ContentWrapper id={'content-wrapper'}>
                    <CardWrapper>
                        <h1>{Koji.config.template.config.postGameScreenTitle}</h1>
                    </CardWrapper>
                    {
                      Koji.config.template.config.postGameScreenShowPlayAgainButton &&
                      <SecondaryButton
                        onClick={() => this.props.setAppView('game')}
                        text={Koji.config.template.config.postGameScreenPlayAgainButtonText}
                      />
                    }
                </ContentWrapper>
            </Reveal>
        </FlexWrapper>
    );
  }
}

export default PostGameScreen;
