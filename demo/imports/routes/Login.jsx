import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { auth } from '/imports/actions';

const Login = ({ login }) => (
  <div>
    <p>Not logged in: <button onClick={login}>Log in</button></p>
  </div>
);
Login.propTypes = {
  login: PropTypes.func.isRequired,
};
const mapDispatchToProps = dispatch => ({
  login(e) {
    e.preventDefault();
    dispatch(auth.login());
  },
});
export default connect(null, mapDispatchToProps)(Login);
