import React, { PropTypes as pt } from 'react';
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
  isLoggedIn: pt.bool.isRequired,
  component: pt.func.isRequired,
  location: pt.string,
};
Privateroute.defaultProps = {
  location: '/',
};
export default connect(state => ({ isLoggedIn: state.auth }))(Privateroute);
