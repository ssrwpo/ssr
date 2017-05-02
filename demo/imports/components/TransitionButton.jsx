import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { pure } from 'meteor/ssrwpo:ssr';

const TransitionButton = ({ href, history, children }) => (
  <button onClick={() => history.push(href)}>{children}</button>
);
TransitionButton.propTypes = {
  href: PropTypes.string.isRequired,
  history: PropTypes.object.isRequired,
  children: PropTypes.oneOfType([PropTypes.string, PropTypes.element]).isRequired,
};
export default withRouter(pure(TransitionButton));
