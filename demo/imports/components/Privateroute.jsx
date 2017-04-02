import React, { PropTypes as pt } from 'react';
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
  user: pt.oneOfType([pt.object, pt.bool]).isRequired,
  component: pt.func.isRequired,
  location: pt.string,
};
Privateroute.defaultProps = {
  location: '/',
};
export default connect(state => ({ user: state.user }))(Privateroute);
