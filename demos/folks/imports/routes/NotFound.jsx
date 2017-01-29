import React, { PropTypes as pt } from 'react';
import Helmet from 'react-helmet';

const NotFound = ({ location }) => (
  <div>
    <Helmet title="Not found" />
    <h2>Whoops</h2>
    <p>Sorry but {location.pathname} didn’t match any pages</p>
  </div>
);
NotFound.propTypes = {
  location: pt.object.isRequired,
};
export default NotFound;
