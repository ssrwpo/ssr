import React, { PropTypes } from 'react';
import Helmet from 'react-helmet';
import { Match, Link } from 'react-router';
// Subroutes
import Topic from './routes/Topic';

const Topics = ({ pathname }) => (
  <div>
    <Helmet title="Topics" />
    <h2>Topics</h2>
    <ul>
      <li><Link to={`${pathname}/rendering`}>Rendering with React</Link></li>
      <li><Link to={`${pathname}/components`}>Components</Link></li>
      <li><Link to={`${pathname}/props-v-state`}>Props v. State</Link></li>
    </ul>
    <Match pattern={`${pathname}/:topicId`} component={Topic} />
    <Match
      exactly
      pattern={pathname}
      render={() => (<h3>Please select a topic</h3>)}
    />
  </div>
);
Topics.propTypes = {
  pathname: PropTypes.string.isRequired,
};
export default Topics;
