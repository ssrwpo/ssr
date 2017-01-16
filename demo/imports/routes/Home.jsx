import React, { PropTypes } from 'react';
import Helmet from 'react-helmet';
import { connect } from 'react-redux';
import { selectIsLoggedIn } from '/imports/reducers/auth';

const Home = ({ isLoggedIn }) => (
  <div>
    <Helmet title="Home" />
    <h2>Home</h2>
    <p>{isLoggedIn ? 'Logged in' : 'Logged out'}</p>
  </div>
);
Home.propTypes = {
  isLoggedIn: PropTypes.bool.isRequired,
};
export default connect(selectIsLoggedIn)(Home);
