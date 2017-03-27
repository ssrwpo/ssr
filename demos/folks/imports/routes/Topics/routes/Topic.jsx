import React, { PropTypes as pt } from 'react';
import Helmet from 'react-helmet';
import { pure } from 'meteor/ssrwpo:ssr';

const Topic = ({ match }) => (
  <div>
    <Helmet><title>{`Topics - ${match.params.topicId}`}</title></Helmet>
    <h3>{match.params.topicId}</h3>
  </div>
);
Topic.propTypes = {
  match: pt.object.isRequired,
};
export default pure(Topic);
