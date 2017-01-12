import React, { PropTypes as pt } from 'react';
import Helmet from 'react-helmet';

const Topic = ({ params }) => (
  <div>
    <Helmet title={`Topics - ${params.topicId}`} />
    <h3>{params.topicId}</h3>
  </div>
);
Topic.propTypes = {
  params: pt.object.isRequired,
};
export default Topic;
