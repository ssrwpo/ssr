import React, { PureComponent, PropTypes as pt } from 'react';
import { valueSet } from 'meteor/ssrwpo:ssr';
import Helmet from 'react-helmet';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';

class Login extends PureComponent {
  static propTypes = {
    isLoggedIn: pt.bool.isRequired,
    login: pt.func.isRequired,
    location: pt.object.isRequired,
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
    dispatch(valueSet('auth', true));
  },
});
export default connect(state => ({ isLoggedIn: state.auth }), mapDispatchToProps)(Login);
