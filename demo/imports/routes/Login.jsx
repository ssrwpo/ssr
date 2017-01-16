import React, { PropTypes } from 'react';
import Helmet from 'react-helmet';
import { connect } from 'react-redux';
import { Redirect } from 'react-router';
import { auth } from '/imports/actions';
import { selectIsLoggedIn } from '/imports/reducers/auth';

const Login = ({ isLoggedIn, login, location }) => (
  isLoggedIn
  ? <Redirect to={location.state ? location.state.from : '/'} />
  : <div>
    <Helmet title="Login" />
    <p>Not logged in: <button onClick={login}>Log in</button></p>
  </div>
);
Login.propTypes = {
  isLoggedIn: PropTypes.bool.isRequired,
  login: PropTypes.func.isRequired,
  location: PropTypes.object.isRequired,
};
const mapDispatchToProps = dispatch => ({
  login(e) {
    e.preventDefault();
    dispatch(auth.login());
  },
});
export default connect(selectIsLoggedIn, mapDispatchToProps)(Login);
