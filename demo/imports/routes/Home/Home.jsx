import React, { PropTypes } from 'react';
import Helmet from 'react-helmet';
import { connect } from 'react-redux';

const Home = ({ auth }) => (
  <div>
    <Helmet title="Home" />
    <h2>Home</h2>
    <p>{auth ? 'Logged in' : 'Logged out'}</p>
  </div>
);
Home.propTypes = {
  auth: PropTypes.bool.isRequired,
};
const mapStateToProps = (state => ({ auth: state.auth }));
export default connect(mapStateToProps)(Home);
