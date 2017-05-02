import React from 'react';
import PropTypes from 'prop-types';
import { Route, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

const Privateroute = ({ user, component: Component, ...rest }) => (
  <Route
    {...rest}
    render={props => (user
      ? <Component {...props} />
      : <Redirect to={{ pathname: '/login', state: { from: props.location } }} />
    )}
  />
);
Privateroute.propTypes = {
  user: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]).isRequired,
  component: PropTypes.func.isRequired,
  location: PropTypes.string,
};
Privateroute.defaultProps = {
  location: '/',
};
export default connect(state => ({ user: state.user }))(Privateroute);
