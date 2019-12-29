import styled from 'styled-components';
import isDarkColor from 'is-dark-color';

const CTAButton = styled.button`
  border: 0;
  outline: 0;
  font-size: 16px;
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

export default CTAButton;