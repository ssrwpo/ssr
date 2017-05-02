/* eslint-disable import/extensions, import/no-extraneous-dependencies */
import React from 'react';
import PropTypes from 'prop-types';
import { pure } from 'meteor/ssrwpo:ssr';
import LoginComponent from '../components/Login';

const Login = ({ location }) => <LoginComponent location={location} />;
Login.propTypes = {
  location: PropTypes.object.isRequired,
};
export default pure(Login);
