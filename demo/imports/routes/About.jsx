import React from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import { connect } from 'react-redux';
import { pure } from 'meteor/ssrwpo:ssr';

const About = ({ platform }) => (
  <div>
    <Helmet><title>About</title></Helmet>
    <h2>About</h2>
    <p>Running on <strong>{platform}</strong> platform</p>
  </div>
);
About.propTypes = {
  platform: PropTypes.string.isRequired,
};
export default connect(state => ({ platform: state.platform }))(pure(About));
