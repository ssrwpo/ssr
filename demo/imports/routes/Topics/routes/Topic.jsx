import React, { PropTypes as pt } from 'react';
import Helmet from 'react-helmet';
import { pure } from 'meteor/ssrwpo:ssr';

const Topic = ({ params }) => (
  <div>
    <Helmet title={`Topics - ${params.topicId}`} />
    <h3>{params.topicId}</h3>
  </div>
);
Topic.propTypes = {
  params: pt.object.isRequired,
};
export default pure(Topic);
