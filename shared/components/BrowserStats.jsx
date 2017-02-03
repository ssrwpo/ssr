/* eslint-disable import/first, no-undef, import/no-extraneous-dependencies, import/no-unresolved, import/extensions, max-len */
import React, { PropTypes as pt } from 'react';
import { connect } from 'react-redux';
import actual from 'actual';
import debounce from 'lodash/debounce';
/* eslint-enable */
import { valueSet } from '../actions/utils';

class BrowserStats extends React.PureComponent {
  constructor(props) {
    super(props);
    this.debounce = null;
    this.handleResizeEvent = this.handleResizeEvent.bind(this);
  }
  componentDidMount() {
    const { fixInitialValue, retinaMinDpi, mobileBreakpoint, debounceTimer } = this.props;
    fixInitialValue(retinaMinDpi, mobileBreakpoint);
    this.debounce = debounce(this.handleResizeEvent, debounceTimer);
    window.addEventListener('resize', this.handleResizeEvent);
  }
  componentWillUnmount() {
    this.debounce.cancel();
    window.removeEventListener('resize', this.debounce);
  }
  handleResizeEvent() {
    const { handleResizeEvent, mobileBreakpoint } = this.props;
    requestAnimationFrame(() => handleResizeEvent(mobileBreakpoint));
  }
  render() {
    return null;
  }
}
BrowserStats.propTypes = {
  fixInitialValue: pt.func.isRequired,
  handleResizeEvent: pt.func.isRequired,
  retinaMinDpi: pt.number,
  mobileBreakpoint: pt.number,
  debounceTimer: pt.number,
};
BrowserStats.defaultProps = {
  retinaMinDpi: 144,
  mobileBreakpoint: 992,
  debounceTimer: 16 * 4,
};

// Analysis shared while initilizing the component and resizing window
const sharedAnalysis = (mobileBreakpoint) => {
  const viewportWidth = actual('width', 'px');
  return {
    mobile: viewportWidth <= mobileBreakpoint,
    viewportWidth,
    viewportHeight: actual('height', 'px'),
  };
};

export default connect(
  null,
  dispatch => ({
    fixInitialValue(retinaMinDpi, mobileBreakpoint) {
      const conf = {
        ...sharedAnalysis(mobileBreakpoint),
        retina: actual('resolution', 'dpi') >= retinaMinDpi,
      };
      Object.keys(conf).forEach(key => dispatch(valueSet(key, conf[key])));
    },
    handleResizeEvent(mobileBreakpoint) {
      const conf = sharedAnalysis(mobileBreakpoint);
      Object.keys(conf).forEach(key => dispatch(valueSet(key, conf[key])));
    },
  }),
)(BrowserStats);
