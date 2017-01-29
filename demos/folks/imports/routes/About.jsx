import React, { PropTypes } from 'react';
import Helmet from 'react-helmet';
import { connect } from 'react-redux';

const About = ({ platform }) => (
  <div>
    <Helmet title="About" />
    <h2>About</h2>
    <p>Running on <strong>{platform}</strong> platform</p>
  </div>
);
About.propTypes = {
  platform: PropTypes.string.isRequired,
};
export default connect(state => ({ platform: state.platform }))(About);
