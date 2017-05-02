import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { pure } from 'meteor/ssrwpo:ssr';
import Button from '/imports/ui/atom/Button';

const TransitionButton = ({ href, history, children }) =>
  <Button onClick={() => history.push(href)}>{children}</Button>;
TransitionButton.propTypes = {
  href: PropTypes.string.isRequired,
  history: PropTypes.object.isRequired,
  children: PropTypes.oneOfType([PropTypes.string, PropTypes.element]).isRequired,
};
export default withRouter(pure(TransitionButton));
