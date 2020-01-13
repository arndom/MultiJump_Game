import React, { PureComponent } from 'react';
import styled from 'styled-components';
import isDarkColor from 'is-dark-color';
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
        loading: PropTypes.bool,
        onClick: PropTypes.func,
        primaryColor: PropTypes.string,
        text: PropTypes.string.isRequired,
        type: PropTypes.string,
    };

    static defaultProps = {
        fontSize: '16px',
        loading: false,
        onClick() {},
        primaryColor: '#000000',
        type: 'button',
    };

    render() {
        if (this.props.loading) {
            return (
                <StyledButton
                    fontSize={this.props.fontSize}
                    onClick={this.props.onClick}
                    primaryColor={this.props.primaryColor}
                    type={this.props.type}
                >
                    <div className={'lds-ring'}><div></div><div></div><div></div><div></div></div>
                </StyledButton>
            );
        }

        return (
            <StyledButton
                fontSize={this.props.fontSize}
                onClick={this.props.onClick}
                primaryColor={this.props.primaryColor}
                type={this.props.type}
            >
                {this.props.text}
            </StyledButton>
        )
    }
}

export default PrimaryButton;