/* eslint-disable react/jsx-no-target-blank */
import React, { Fragment, PureComponent } from 'react';
import styled from 'styled-components';
import Koji from '@withkoji/vcc';
import PropTypes from 'prop-types';
import md5 from 'md5';
import isDarkColor from 'is-dark-color';
import Reveal from '../Components/Reveal';

const FlexWrapper = styled.div`
  display: flex;
  width: 100vw;
  height: 100vh;
  justify-content: center;
  align-items: center;
  overflow-x: hidden;
  overflow-y: hidden;
`;

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  margin: 4vh auto;
`;

const CardWrapper = styled.div`
  border-radius: 0.5vh;
  width: 90vw;
  min-width: 280px;
  max-width: 480px;
  background: rgba(255, 255, 255, 0.9);
  padding: 4vh;
  margin-bottom: 4vh;

  display: flex;
  flex-direction: column;
  align-items: center;

  .cta-headline, .social-headline, .leaderboard-title {
    font-size: 4vh;
    margin-bottom: 4vh;
  }

  .label-wrapper {
    text-align: left;
    margin-bottom: 0.5vh;
    width: 100%;
    max-width: 320px;
    display: flex;
    align-items: center;
  }

  .label-wrapper {
    font-size: 2vh;
  }

  .input-wrapper {
    margin-bottom: 2vh;
    width: 100%;
    max-width: 320px;
  }

  .input-wrapper > input {
    width: 100%;
    font-size: 16px;
    font-size: 4vh;
    padding: 1vh;
    border-radius: 0.5vh;
    border: 1px solid #dedede;
  }

  input[type="checkbox"] {
    font-size: 2vh;
    margin-left: 0;
  }

  .score-text {
    font-size: 4vh;
    margin-bottom: 2vh;
  }

  .score {
    font-size: 6vh;
    margin-bottom: 2vh;
  }
`;

const SocialWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;

  a {
      width: 16vw;
      height: 16vw;
      max-width: 72px;
      max-height: 72px;
      margin: 4%;
  }

  img {
      max-height: 100%;
  }
`;

const LeaderboardWrapper = styled.div`
  max-height: 30vh;
  width: 100%;

  overflow-y: scroll;

  ::-webkit-scrollbar {
    -webkit-appearance: none;
    width: 7px;
    height: 7px;
    -webkit-overflow-scrolling: auto;
  }
  ::-webkit-scrollbar-thumb {
    border-radius: 4px;
    background-color: rgba(0,0,0,.5);
    -webkit-box-shadow: 0 0 1px rgba(255,255,255,.5);
  }
`;

const LeaderboardContent = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0 2vh;

  > div {
    display: flex;
  }

  .leaderboard-entry {
    position: relative;
    font-size: 3vh;
    line-height: 4.5vh;
  }

  .leaderboard-score {
    flex: 1;
    text-align: right;
  }

  .leaderboard-name {
    position: absolute;
    left: 6vh;
  }
`;

const FormWrapper = styled.form`
  .submit-button-wrapper {
    margin-top: 4vh;
  }
`;

const PlayAgainLink = styled.a`
  font-size: 4vh;
  color: ${({ color }) => color};
  text-decoration: underline;
  cursor: pointer;
`;

const SubmitButton = styled.button`
  font-size: 3vh;
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

const CTALink = styled.a`
  display: block;
  font-size: 3vh;
  padding: 1.5vh 10vh;
  border: 0;
  border-radius: 2vh;
  background: ${({ backgroundColor }) => backgroundColor};
  color: ${({ backgroundColor }) => isDarkColor(backgroundColor) ? '#f1f1f1' : '#111111'};
  cursor: pointer;
  text-decoration: none;

  transition: transform 0.1s;

  &:hover {
    transform: scale(1.1);
  }

  &:active {
    transform: scale(0.95);
  }
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
    setAppView() { },
    showLeaderboard() { },
    score: 0,
  };

  state = {
    formSubmitting: false,
    formSubmitted: false,
    name: '',
    email: '',
    phone: '',
    optIn: true,
  };

  handleScoreSubmit = e => {
    e.preventDefault();

    this.setState({ formSubmitting: true });

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
      .then(() => {
        fetch(`${Koji.config.serviceMap.backend}/leaderboard`)
          .then((response) => response.json())
          .then(({ scores }) => {
            this.setState({ formSubmitting: false, formSubmitted: true, scores });
          })
          .catch(err => {
            console.log('Fetch Error: ', err);
            this.setState({ error: true });
          });
      })
      .catch(err => {
        console.log(err);
      });
  };

  handleReveal = () => {
    // On reveal, calculate the height of the element and see if
    // we need to adjust some flex properties so that overflowing
    // content renders using flex-start

    const flexWrapperElem = document.getElementById('flex-wrapper');
    if (flexWrapperElem) {
      window.setTimeout(() => {
        flexWrapperElem.style.overflowY = 'auto';
      }, 1000);
    }
    const elem = document.getElementsByClassName('react-reveal')[0];
    if (elem.offsetHeight > window.innerHeight) {
      if (flexWrapperElem) {
        flexWrapperElem.style.alignItems = 'flex-start';
      }
    }
  };

  render() {
    const collectEmail = ['yes', 'require'].includes(Koji.config.postGameScreen.collectEmail);
    const collectPhone = ['yes', 'require'].includes(Koji.config.postGameScreen.collectPhone);

    return (
      <FlexWrapper id={'flex-wrapper'}>
        <Reveal
          id={'test'}
          onReveal={() => this.handleReveal()}
          revealType={Koji.config.postGameScreen.reveal}
        >
          <ContentWrapper id={'content-wrapper'}>
            {
              Koji.config.postGameScreen.leaderboardEnabled &&
              <Fragment>
                {
                  !this.state.formSubmitted &&
                  <CardWrapper>
                    <FormWrapper onSubmit={this.handleScoreSubmit}>
                      <div className={'score-text'}>{'Your Score'}</div>
                      <div className={'score'}>{this.props.score}</div>

                      <div className={'field-wrapper'}>
                        <div className={'label-wrapper'}>
                          <label>{'Name'}</label>
                        </div>
                        <div className={'input-wrapper'}>
                          <input
                            onChange={e => this.setState({ name: e.currentTarget.value })}
                            required
                            type={'text'}
                            value={this.state.name}
                          />
                        </div>
                      </div>

                      {
                        collectEmail &&
                        <div className={'field-wrapper'}>
                          <div className={'label-wrapper'}>
                            <label>{'Email'}</label>
                          </div>
                          <div className={'input-wrapper'}>
                            <input
                              onChange={e => this.setState({ email: e.currentTarget.value })}
                              required={Koji.config.postGameScreen.collectEmail === 'require'}
                              type={'email'}
                              value={this.state.email}
                            />
                          </div>
                        </div>
                      }

                      {
                        collectPhone &&
                        <div className={'field-wrapper'}>
                          <div className={'label-wrapper'}>
                            <label>{'Phone'}</label>
                          </div>
                          <div className={'input-wrapper'}>
                            <input
                              onChange={e => this.setState({ phone: e.currentTarget.value })}
                              required={Koji.config.postGameScreen.collectPhone === 'require'}
                              type={'tel'}
                              value={this.state.phone}
                            />
                          </div>
                        </div>
                      }

                      {
                        (collectEmail || collectPhone) &&
                        <div className={'field-wrapper'}>
                          <div className={'label-wrapper'}>
                            <input
                              checked={this.state.optIn}
                              onChange={e => this.setState({ optIn: e.currentTarget.checked })}
                              type={'checkbox'}
                            />
                            {'Opt In'}
                          </div>
                        </div>
                      }

                      <div className={'submit-button-wrapper'}>
                        {
                            !this.state.formSubmitting &&
                            <SubmitButton
                                backgroundColor={'#dedede'}
                                type={'submit'}
                            >
                                {'Submit Score'}
                            </SubmitButton>
                        }
                        {
                            this.state.formSubmitting &&
                            <div className={'lds-ring'}><div></div><div></div><div></div><div></div></div>
                        }
                      </div>
                    </FormWrapper>
                  </CardWrapper>
                }
                {
                  this.state.formSubmitted &&
                  <CardWrapper>
                    <div className={'leaderboard-title'}>{'Leaderboard'}</div>
                    <LeaderboardWrapper>
                      <LeaderboardContent>
                        {
                          (this.state.scores || []).map((entry, idx) => (
                            <div
                              className={'leaderboard-entry'}
                              key={idx}
                            >
                              <div>
                                {`${idx + 1}.`}
                              </div>
                              <div className={'leaderboard-name'}>{entry.name}</div>
                              <div className={'leaderboard-score'}>{entry.score}</div>
                            </div>
                          ))
                        }
                      </LeaderboardContent>
                    </LeaderboardWrapper>
                  </CardWrapper>
                }
              </Fragment>
            }
            {
              Koji.config.postGameScreen.ctaEnabled &&
              <CardWrapper>
                <div className={'cta-headline'}>{Koji.config.postGameScreen.ctaHeadline}</div>
                <div className={'button-wrapper'}>
                  <CTALink
                    backgroundColor={Koji.config.postGameScreen.ctaButtonColor}
                    href={Koji.config.postGameScreen.ctaButtonLink}
                    target={'_top'}
                  >
                    {Koji.config.postGameScreen.ctaButtonText}
                  </CTALink>
                </div>
              </CardWrapper>
            }
            {
              Koji.config.postGameScreen.socialShareEnabled &&
              <CardWrapper>
                <div className={'social-headline'}>{Koji.config.postGameScreen.socialShareHeadline}</div>
                <SocialWrapper>
                  <a
                    href={`https://twitter.com/intent/tweet?text=${window.encodeURIComponent(document.title)}: ${window.encodeURIComponent(window.location.href)}`}
                    target={'_top'}
                  >
                    <img src={Koji.config.postGameScreen.twitterIcon} />
                  </a>
                  <a
                    href={`https://www.facebook.com/sharer/sharer.php?u=${window.encodeURIComponent(window.location.href)}`}
                    target={'_top'}
                  >
                    <img src={Koji.config.postGameScreen.facebookIcon} />
                  </a>
                  <a
                    href={`https://www.linkedin.com/shareArticle?mini=true&url=${window.encodeURIComponent(window.location.href)}&title=${window.encodeURIComponent(document.title)}&source=LinkedIn`}
                    target={'_top'}
                  >
                    <img src={Koji.config.postGameScreen.linkedInIcon} />
                  </a>
                  <a
                    href={`http://www.reddit.com/submit?url=${window.encodeURIComponent(window.location.href)}`}
                    target={'_top'}
                  >
                    <img src={Koji.config.postGameScreen.redditIcon} />
                  </a>
                </SocialWrapper>
              </CardWrapper>
            }
            {
              Koji.config.postGameScreen.playAgainLinkEnabled &&
              <PlayAgainLink
                color={Koji.config.postGameScreen.playAgainLinkColor}
                onClick={() => this.props.setAppView('game')}
              >
                {Koji.config.postGameScreen.playAgainLinkText}
              </PlayAgainLink>
            }
          </ContentWrapper>
        </Reveal>
      </FlexWrapper>
    );
  }
}

export default PostGameScreen;
