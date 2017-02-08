/* eslint-disable import/extensions, import/no-extraneous-dependencies */
import React, { PureComponent, PropTypes as pt } from 'react';
import { Accounts } from 'meteor/accounts-base';
import Helmet from 'react-helmet';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';

class Login extends PureComponent {
  static propTypes = {
    user: pt.oneOfType([
      pt.object,
      pt.bool,
    ]).isRequired,
    location: pt.object.isRequired,
  }
  state = { redirectToReferrer: false }
  onLogin = () => {
    Meteor.loginWithPassword(this.email.value, this.password.value, (error) => {
      if (!error) {
        this.setState({ redirectToReferrer: true });
      }
    });
  }
  onLogout = () => {
    Meteor.logout((error) => {
      if (!error) {
        // do whatever you want after logout
      }
    });
  }
  onRegister = () => {
    Accounts.createUser({
      email: this.email.value,
      password: this.password.value,
    }, (error) => {
      if (!error) {
        this.setState({ redirectToReferrer: true });
      }
    });
  }
  render() {
    const { redirectToReferrer } = this.state;
    const { user, location } = this.props;
    if (!user && redirectToReferrer) {
      return <Redirect to={location.state ? location.state.from : '/'} />;
    }
    return (
      <div>
        <Helmet title="Login" />
        {!user ?
          <div>
            <p>Not logged in:</p>
            <form onSubmit={this.onLogin}>
              <input ref={(c) => { this.email = c; }} type="text" placeholder="email" />
              <input ref={(c) => { this.password = c; }} type="password" placeholder="password" />
            </form>
            <button onClick={this.onLogin}>Log in</button>
            <button onClick={this.onRegister}>Register</button>
          </div> :
          <div>
            <p>logged in as:</p>
            <p>{user.emails[0].address}</p>
            <button onClick={this.onLogout}>Log out</button>
          </div>
        }
      </div>
    );
  }
}

Login.defaultProps = {
  user: false,
};

export default connect(state => ({ user: state.user }), null)(Login);
