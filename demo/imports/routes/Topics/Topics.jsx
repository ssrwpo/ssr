import React, { PropTypes } from 'react';
import Helmet from 'react-helmet';
import { Route, Link } from 'react-router-dom';
import { pure } from 'meteor/ssrwpo:ssr';
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
    <Route path={`${pathname}/:topicId`} component={Topic} />
    <Route
      exact
      path={pathname}
      render={() => (<h3>Please select a topic</h3>)}
    />
  </div>
);
Topics.propTypes = {
  pathname: PropTypes.string.isRequired,
};
export default pure(Topics);
