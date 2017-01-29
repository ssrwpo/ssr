import React, { PureComponent, PropTypes } from 'react';
import Helmet from 'react-helmet';
import { connect } from 'react-redux';
import { Redirect } from 'react-router';
import { auth } from '/imports/actions';
import { selectIsLoggedIn } from '/imports/reducers/auth';

class Login extends PureComponent {
  static propTypes = {
    isLoggedIn: PropTypes.bool.isRequired,
    login: PropTypes.func.isRequired,
    location: PropTypes.object.isRequired,
  }
  state = { redirectToReferrer: false }
  onLogin = (e) => {
    this.props.login(e);
    this.setState({ redirectToReferrer: true });
  }
  render() {
    const { redirectToReferrer } = this.state;
    const { isLoggedIn, location } = this.props;
    if (isLoggedIn && redirectToReferrer) {
      return <Redirect to={location.state ? location.state.from : '/'} />;
    }
    return (
      <div>
        <Helmet title="Login" />
        <p>Not logged in: <button onClick={this.onLogin}>Log in</button></p>
      </div>
    );
  }
}
const mapDispatchToProps = dispatch => ({
  login(e) {
    e.preventDefault();
    dispatch(auth.login());
  },
});
export default connect(selectIsLoggedIn, mapDispatchToProps)(Login);
