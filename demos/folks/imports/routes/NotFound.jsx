import { Meteor } from 'meteor/meteor';
import React, { PropTypes as pt } from 'react';
import Helmet from 'react-helmet';
import { pure } from 'meteor/ssrwpo:ssr';

const NotFound = ({ location }, { router }) => {
  if (Meteor.isServer) {
    // eslint-disable-next-line no-param-reassign
    router.staticContext.has404 = true;
  }
  return (
    <div>
      <Helmet title="Not found" />
      <h2>Whoops</h2>
      <p>Sorry but {location.pathname} didn’t match any pages</p>
    </div>
  );
};
NotFound.propTypes = {
  location: pt.object.isRequired,
};
NotFound.contextTypes = {
  router: pt.object.isRequired,
};
export default pure(NotFound);
