import React from 'react';
import PropTypes from 'prop-types';
import { Route, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

const Privateroute = ({ isLoggedIn, component: Component, ...rest }) => (
  <Route
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
Privateroute.propTypes = {
  isLoggedIn: PropTypes.bool.isRequired,
  component: PropTypes.func.isRequired,
  location: PropTypes.string,
};
Privateroute.defaultProps = {
  location: '/',
};
export default connect(state => ({ isLoggedIn: state.auth }))(Privateroute);
