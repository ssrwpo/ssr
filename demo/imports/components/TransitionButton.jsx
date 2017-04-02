import React, { PropTypes as pt } from 'react';
import { withRouter } from 'react-router-dom';
import { pure } from 'meteor/ssrwpo:ssr';

const TransitionButton = ({ href, history, children }) => (
  <button onClick={() => history.push(href)}>{children}</button>
);
TransitionButton.propTypes = {
  href: pt.string.isRequired,
  history: pt.object.isRequired,
  children: pt.oneOfType([pt.string, pt.element]).isRequired,
};
export default withRouter(pure(TransitionButton));
