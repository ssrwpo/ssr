/* eslint-disable import/first, no-undef, import/no-extraneous-dependencies, import/no-unresolved, import/extensions, max-len */
import { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

/* eslint-enable */
import { valueSet } from '../actions/utils';

class UserStats extends PureComponent {
  componentWillMount() {
    const { login } = this.props;
    if (Meteor.isClient) {
      Tracker.autorun(() => {
        if (Meteor.user()) {
          login(Meteor.user());
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
  login: PropTypes.func.isRequired,
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
  }),
)(UserStats);
