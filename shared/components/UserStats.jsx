/* eslint-disable import/first, no-undef, import/no-extraneous-dependencies, import/no-unresolved, import/extensions, max-len */
import React, { PropTypes as pt } from 'react';
import { connect } from 'react-redux';

/* eslint-enable */
import { valueSet } from '../actions/utils';

class UserStats extends React.PureComponent {

  componentWillMount() {
    const { login, logout } = this.props;
    if (Meteor.isClient) {
      Tracker.autorun(() => {
        if (Meteor.user()) {
          login(Meteor.user());
        } else {
          logout();
        }
      });
    }
  }
  componentWillUnmount() {
    Tracker.flush();
  }
  render() {
    return null;
  }
}

UserStats.propTypes = {
  login: pt.func.isRequired,
  logout: pt.func.isRequired,
};

UserStats.defaultProps = {
  user: false,
};

export default connect(
  null,
  dispatch => ({
    login(user) {
      dispatch(valueSet('user', user));
    },
    logout() {
      dispatch(valueSet('user', false));
    },
  }),
)(UserStats);
