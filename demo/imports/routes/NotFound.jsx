import { Meteor } from 'meteor/meteor';
import React from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import { pure } from 'meteor/ssrwpo:ssr';

const NotFound = ({ location }, { router }) => {
  if (Meteor.isServer) {
    // eslint-disable-next-line no-param-reassign
    router.staticContext.has404 = true;
  }
  return (
    <div>
      <Helmet><title>Not found</title></Helmet>
      <h2>Whoops</h2>
      <p>Sorry but {location.pathname} didn’t match any pages</p>
    </div>
  );
};
NotFound.propTypes = {
  location: PropTypes.object.isRequired,
};
NotFound.contextTypes = {
  router: PropTypes.object.isRequired,
};
export default pure(NotFound);
