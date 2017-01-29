import React, { PropTypes } from 'react';
import { Match, Redirect } from 'react-router';
import { connect } from 'react-redux';
import { selectIsLoggedIn } from '/imports/reducers/auth';

const MatchWhenAuthorized = ({ isLoggedIn, component: Component, ...rest }) => (
  <Match
    {...rest}
    render={
      props => (
        isLoggedIn
        ? <Component {...props} />
        : <Redirect
          to={{
            pathname: '/login',
            state: { from: props.location },
          }}
        />
      )
    }
  />
);
MatchWhenAuthorized.propTypes = {
  isLoggedIn: PropTypes.bool.isRequired,
  component: PropTypes.func.isRequired,
  location: PropTypes.string,
};
MatchWhenAuthorized.defaultProps = {
  location: '/',
};
export default connect(selectIsLoggedIn)(MatchWhenAuthorized);
