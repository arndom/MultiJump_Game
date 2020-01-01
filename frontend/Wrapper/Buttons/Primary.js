import React, { PureComponent } from 'react';
import styled from 'styled-components';
import isDarkColor from 'is-dark-color';
import Koji from '@withkoji/vcc';
import PropTypes from 'prop-types';

const StyledButton = styled.button`
  border: 0;
  outline: 0;
  font-size: ${({ fontSize }) => fontSize};
  background: ${({ primaryColor }) => primaryColor};
  color: ${({ primaryColor }) => isDarkColor(primaryColor) ? '#f1f1f1' : '#111111' };
  cursor: pointer;
  padding: 16px;
  border-radius: 4px;
  transition: transform 0.1s;

  &:hover {
    transform: scale(1.1);
  }

  &:active {
    transform: scale(0.95);
  }
`;

class PrimaryButton extends PureComponent {
    static propTypes = {
        fontSize: PropTypes.string,
        onClick: PropTypes.func,
        text: PropTypes.string.isRequired,
        type: PropTypes.string,
    };

    static defaultProps = {
        fontSize: '16px',
        onClick() {},
        type: 'button',
    };

    render() {
        return (
            <StyledButton
                fontSize={this.props.fontSize}
                onClick={this.props.onClick}
                primaryColor={Koji.config.template.config.primaryColor}
                type={this.props.type}
            >
                {this.props.text}
            </StyledButton>
        )
    }
}

export default PrimaryButton;