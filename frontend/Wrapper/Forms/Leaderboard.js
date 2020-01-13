import React, { PureComponent } from 'react';
import Koji from '@withkoji/vcc';
import styled from 'styled-components';
import isDarkColor from 'is-dark-color';

const LeaderboardContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  margin: 0 auto;
  background: ${({ primaryColor }) => primaryColor};
  color: ${({ primaryColor }) => isDarkColor(primaryColor) ? '#f1f1f1' : '#111111' };

  h1 {
    font-size: 24px !important;
    margin-bottom: 24px !important;
  }
`;

const RingContainer = styled.div`
  height: calc(100vh - 128px);
  overflow: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const ScoreContainer = styled.div`
  height: calc(100vh - 128px);
  overflow: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 8px;
`;

const Score = styled.div`
  font-size: 18px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  background: ${({ secondaryColor }) => secondaryColor};
  color: ${({ secondaryColor }) => isDarkColor(secondaryColor) ? '#f1f1f1' : '#111111' };
  padding: 8px;
  width: calc(100% - 16px);
  margin-bottom: 8px;
`;

const ScoreIndex = styled.span`

`;

const ScoreName = styled.span`
  flex: 1;
  text-align: center;
`;

const ScorePoints = styled.span`

`;

class Leaderboard extends PureComponent {
  state = {
    scores: [],
    dataIsLoaded: false,
    error: false,
  };

  componentWillMount() {
    fetch(`${Koji.config.serviceMap.backend}/leaderboard`)
      .then((response) => response.json())
      .then(({ scores }) => {
        this.setState({ dataIsLoaded: true, scores });
      })
      .catch(err => {
        console.log('Fetch Error: ', err);
        this.setState({ error: true });
      });
  }

  render() {
    if (this.state.error) {
      return (
        <div>{'Error!'}</div>
      );
    }

    return (
      <LeaderboardContainer
        primaryColor={Koji.config.postGameScreen.actions.leaderboardColor}
        secondaryColor={Koji.config.postGameScreen.actions.leaderboardBackgroundColor}
      >
        
          {
            !this.state.dataIsLoaded &&
            <RingContainer>
              <div className={'lds-ring'}><div></div><div></div><div></div><div></div></div>
            </RingContainer>
          }
          {
            this.state.dataIsLoaded && 
            <ScoreContainer>
              { 
                this.state.scores.slice(0, 100).map((score, index) => (
                  <Score
                    key={index}
                    primaryColor={Koji.config.postGameScreen.actions.leaderboardColor}
                    secondaryColor={Koji.config.postGameScreen.actions.leaderboardBackgroundColor}
                  >
                    <ScoreIndex>{`${index + 1}`}</ScoreIndex>
                    <ScoreName>{score.name}</ScoreName>
                    <ScorePoints>{`${score.score.toLocaleString()}`}</ScorePoints>
                  </Score>
                ))
              }
            </ScoreContainer>
          }
      </LeaderboardContainer>
    );
  }
}

export default Leaderboard;
