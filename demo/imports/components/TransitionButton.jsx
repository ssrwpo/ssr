import React, { PropTypes as pt } from 'react';
import { withRouter } from 'react-router-dom';
import { pure } from 'meteor/ssrwpo:ssr';
import Button from '/imports/ui/atom/Button';

const TransitionButton = ({ href, history, children }) =>
  <Button onClick={() => history.push(href)}>{children}</Button>;
TransitionButton.propTypes = {
  href: pt.string.isRequired,
  history: pt.object.isRequired,
  children: pt.oneOfType([pt.string, pt.element]).isRequired,
};
export default withRouter(pure(TransitionButton));
