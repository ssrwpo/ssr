import React, { PropTypes } from 'react';
import { Match, Redirect } from 'react-router';
import { connect } from 'react-redux';

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
  component: PropTypes.element.isRequired,
  location: PropTypes.string.isRequired,
};
const mapStateToProps = state => ({ isLoggedIn: state.auth });
export default connect(mapStateToProps)(MatchWhenAuthorized);
