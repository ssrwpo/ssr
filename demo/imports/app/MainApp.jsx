import React, { PropTypes } from 'react';
import { Match, Miss, Link } from 'react-router';
// Pages import
import Home from '../routes/Home';
import About from '../routes/About';
import NotFound from '../routes/NotFound';
import Topics from '../routes/Topics';

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
    <Miss component={NotFound} />
    <hr />
    {context.someItems.map(item => <p key={item}>{item}</p>)}
  </div>
);
MainApp.propTypes = {
  context: PropTypes.object.isRequired,
};
export default MainApp;
