import React, { PropTypes as pt } from 'react';
import Helmet from 'react-helmet';
import { Route, Link } from 'react-router-dom';
import { pure } from 'meteor/ssrwpo:ssr';
// Subroutes
import Topic from './routes/Topic';

const Topics = ({ match }) => (
  <div>
    <Helmet title="Topics" />
    <h2>Topics</h2>
    <ul>
      <li><Link to={`${match.url}/rendering`}>Rendering with React</Link></li>
      <li><Link to={`${match.url}/components`}>Components</Link></li>
      <li><Link to={`${match.url}/props-v-state`}>Props v. State</Link></li>
    </ul>
    <Route path={`${match.url}/:topicId`} component={Topic} />
    <Route exact path={match.url} render={() => (<h3>Please select a topic</h3>)} />
  </div>
);
Topics.propTypes = {
  match: pt.object.isRequired,
};
export default pure(Topics);
