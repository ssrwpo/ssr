import React, { PropTypes as pt } from 'react';
import Helmet from 'react-helmet';
import { Match, Miss, Link } from 'react-router';

const Home = () => (
  <div>
    <Helmet title="Home" />
    <h2>Home</h2>
  </div>
);

const About = () => (
  <div>
    <Helmet title="About" />
    <h2>About</h2>
  </div>
);

const NoMatch = ({ location }) => (
  <div>
    <Helmet title="Not found" />
    <h2>Whoops</h2>
    <p>Sorry but {location.pathname} didn’t match any pages</p>
  </div>
);
NoMatch.propTypes = {
  location: pt.object.isRequired,
};

const Topic = ({ params }) => (
  <div>
    <Helmet title={`Topics - ${params.topicId}`} />
    <h3>{params.topicId}</h3>
  </div>
);
Topic.propTypes = {
  params: pt.object.isRequired,
};

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
      pattern={pathname}
      exactly
      render={() => (<h3>Please select a topic</h3>)}
    />
  </div>
);
Topics.propTypes = {
  pathname: pt.string.isRequired,
};

const MainApp = ({ context }) => (
  <div>
    <ul>
      <li><Link to="/">Home</Link></li>
      <li><Link to="/about">About</Link></li>
      <li><Link to="/topics">Topics</Link></li>
    </ul>
    <hr />
    <Match exactly pattern="/" component={Home} />
    <Match pattern="/about" component={About} />
    <Match pattern="/topics" component={Topics} />
    <Miss component={NoMatch} />
    <hr />
    {context.someItems.map(item => <p key={item}>{item}</p>)}
  </div>
);
MainApp.propTypes = {
  context: pt.object.isRequired,
};
export default MainApp;
