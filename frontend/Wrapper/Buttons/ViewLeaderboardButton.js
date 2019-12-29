import React, { PureComponent } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import Koji from '@withkoji/vcc';
import isDarkColor from 'is-dark-color';

const Button = styled.button`
  border: 0;
  outline: 0;
  font-size: ${({ playButtonTextFontSize }) => `${playButtonTextFontSize}px`};
  background: ${({ secondaryColor }) => secondaryColor};
  color: ${({ secondaryColor }) => isDarkColor(secondaryColor) ? '#f1f1f1' : '#111111' };
  cursor: pointer;
  padding: 16px;
  border-radius: 4px;
  transition: transform 0.1s;
  margin-bottom: 16px;

  &:hover {
    transform: scale(1.2);
  }

  &:active {
    transform: scale(0.9);
  }
`;

class ViewLeaderboardButton extends PureComponent {
  static propTypes = {
    onClick: PropTypes.func,
  };

  static defaultProps = {
    onClick() {},
  };

  render() {
    return (
      <Button
        onClick={this.props.onClick}
        playButtonTextFontSize={parseInt(Koji.config.template.config.playButtonTextFontSize, 10)}
        secondaryColor={Koji.config.template.config.secondaryColor}
      >
        {Koji.config.template.config.viewLeaderboardButtonText}
      </Button>
    );
  }
}

export default ViewLeaderboardButton;
