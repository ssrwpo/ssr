import React, { PropTypes } from 'react';
import Helmet from 'react-helmet';
import { connect } from 'react-redux';
import { Link, Match } from 'react-router';
// Sub routes
import Login from './routes/Login';

const Home = ({ auth }) => (
  <div>
    <Helmet title="Home" />
    <h2>Home</h2>
    <p>{auth ? 'Logged in' : 'Logged out'}</p>
    <ul>
      <li><Link to="/login">Login</Link></li>
    </ul>
    <Match pattern="/login" component={Login} />
  </div>
);
Home.propTypes = {
  auth: PropTypes.bool.isRequired,
};
const mapStateToProps = (state => ({ auth: state.auth }));
export default connect(mapStateToProps)(Home);
