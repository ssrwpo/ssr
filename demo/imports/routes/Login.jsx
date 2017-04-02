/* eslint-disable import/extensions, import/no-extraneous-dependencies */
import React, { PropTypes as pt } from 'react';
import { pure } from 'meteor/ssrwpo:ssr';
import LoginComponent from '../components/Login';

const Login = ({ location }) =>
  <LoginComponent location={location} />;

Login.propTypes = {
  location: pt.object.isRequired,
};

export default pure(Login);
