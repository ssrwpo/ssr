import React, { PropTypes } from 'react';
import Helmet from 'react-helmet';
import { connect } from 'react-redux';
import { selectIsLoggedIn } from '/imports/reducers/auth';
import { auth } from '/imports/actions';

const Home = ({ isLoggedIn, logout }) => (
  <div>
    <Helmet title="Home" />
    <h2>Home</h2>
    <p>{isLoggedIn ? 'Logged in' : 'Logged out'}</p>
    { isLoggedIn && <p><button onClick={logout}>Log out</button></p>}
  </div>
);
Home.propTypes = {
  isLoggedIn: PropTypes.bool.isRequired,
  logout: PropTypes.func.isRequired,
};
const mapDispatchToProps = dispatch => ({
  logout(e) {
    e.preventDefault();
    dispatch(auth.logout());
  },
});
export default connect(selectIsLoggedIn, mapDispatchToProps)(Home);
