import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Koji from '@withkoji/vcc';
import Modal from 'react-modal';
import styled from 'styled-components';
import isDarkColor from 'is-dark-color';
import LeaderboardForm from '../Forms/Leaderboard';

const CloseModalButton = styled.button`
  position: absolute;
  top: 8px;
  right: 8px;
  border: 0;
  background: 0;
  padding: 16px;
  font-size: 24px;
  cursor: pointer;
  color: ${({ primaryColor }) => isDarkColor(primaryColor) ? '#f1f1f1' : '#111111' };
`;

class Leaderboard extends PureComponent {
  static propTypes = {
    onCloseClick: PropTypes.func,
  };

  static defaultProps = {
    onCloseClick() {},
  };

  render() {
    return (
      <Modal
        isOpen={this.props.isOpen}
        contentLabel={'Leaderboard'}
        style={{
          content: {
            background: Koji.config.template.config.primaryColor,
            color: isDarkColor(Koji.config.template.config.primaryColor) ? '#f1f1f1' : '#111111',
            padding: 0,
            width: '90vw',
            minWidth: '280px',
            maxWidth: '480px',
            margin: '0 auto',
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            marginRight: '-50%',
            transform: 'translate(-50%, -50%)',
          },
          overlay: {
            padding: 0,
          }
        }}
      >
        <div>
          <CloseModalButton
            onClick={this.props.onCloseClick}
            primaryColor={Koji.config.template.config.primaryColor}
          >
            {'Close'}
          </CloseModalButton>
          <LeaderboardForm />
        </div>
      </Modal>
    );
  }
}

export default Leaderboard;