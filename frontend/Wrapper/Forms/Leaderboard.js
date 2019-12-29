import React, { PureComponent } from 'react';
import Koji from '@withkoji/vcc';
import styled from 'styled-components';
import isDarkColor from 'is-dark-color';

const LeaderboardContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 90%;
  max-width: 480px;
  margin: 0 auto;
  background: ${({ primaryColor }) => primaryColor};
  margin-top: 16px;
  color: ${({ primaryColor }) => isDarkColor(primaryColor) ? '#f1f1f1' : '#111111' };

  h1 {
    font-size: 24px !important;
    margin-bottom: 24px !important;
  }
`;

const ScoreContainer = styled.div`
  height: calc(100vh - 212px);
  overflow: auto;
  margin-top: 80px;
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
  margin-bottom: 4px;
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
    console.log('K', Koji.config);
    if (this.state.error) {
      return (
        <div>{'Error!'}</div>
      );
    }

    if (!this.state.dataIsLoaded) {
      return (
        <div />
      );
    }

    return (
      <LeaderboardContainer
        primaryColor={Koji.config.template.config.primaryColor}
        secondaryColor={Koji.config.template.config.secondaryColor}
      >
        <ScoreContainer>
          {
            this.state.scores.slice(0, 100).map((score, index) => (
              <Score
                primaryColor={Koji.config.template.config.primaryColor}
                secondaryColor={Koji.config.template.config.secondaryColor}
              >
                <ScoreIndex>{`${index + 1}`}</ScoreIndex>
                <ScoreName>{score.name}</ScoreName>
                <ScorePoints>{`${score.score.toLocaleString()}`}</ScorePoints>
              </Score>
            ))
          }
        </ScoreContainer>
      </LeaderboardContainer>
    );
  }
}

export default Leaderboard;
