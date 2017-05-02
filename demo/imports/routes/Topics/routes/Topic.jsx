import React from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import { pure } from 'meteor/ssrwpo:ssr';

const Topic = ({ match }) => (
  <div>
    <Helmet><title>{`Topics - ${match.params.topicId}`}</title></Helmet>
    <h3>{match.params.topicId}</h3>
  </div>
);
Topic.propTypes = {
  match: PropTypes.object.isRequired,
};
export default pure(Topic);
