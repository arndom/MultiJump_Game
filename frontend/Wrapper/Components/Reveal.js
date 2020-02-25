import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Bounce from 'react-reveal/Bounce';
import Fade from 'react-reveal/Fade';
import RubberBand from 'react-reveal/RubberBand';
import Zoom from 'react-reveal/Zoom';

class Reveal extends PureComponent {
  static propTypes = {
    children: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.node),
      PropTypes.node,
    ]),
    onReveal: PropTypes.func,
    revealType: PropTypes.string,
  };

  static defaultProps = {
    onReveal() {},
    revealType: 'fadeTop',
  };

  render() {
    if (this.props.revealType === 'rubberBand') return <RubberBand onReveal={this.props.onReveal}>{this.props.children}</RubberBand>;
    if (this.props.revealType === 'bounceTop') return <Bounce onReveal={this.props.onReveal} top>{this.props.children}</Bounce>;
    if (this.props.revealType === 'bounceBottom') return <Bounce onReveal={this.props.onReveal} bottom>{this.props.children}</Bounce>;
    if (this.props.revealType === 'fadeTop') return <Fade onReveal={this.props.onReveal} top>{this.props.children}</Fade>;
    if (this.props.revealType === 'fadeBottom') return <Fade onReveal={this.props.onReveal} bottom>{this.props.children}</Fade>;
    if (this.props.revealType === 'zoomTop') return <Zoom onReveal={this.props.onReveal} top>{this.props.children}</Zoom>;
    if (this.props.revealType === 'zoomBottom') return <Zoom onReveal={this.props.onReveal} bottom>{this.props.children}</Zoom>;

    return null;
  }
}

export default Reveal;
