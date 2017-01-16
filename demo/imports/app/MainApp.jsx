import React, { PropTypes } from 'react';
import { Match, Miss, Link } from 'react-router';
import { connect } from 'react-redux';
// Shared selectors
import { selectIsLoggedIn } from '/imports/reducers/auth';
// Components
import MatchWhenAuthorized from '/imports/components/MatchWhenAuthorized';
// Pages import
import Home from '/imports/routes/Home';
import Protected from '/imports/routes/Protected';
import Login from '/imports/routes/Login';
import About from '/imports/routes/About';
import NotFound from '/imports/routes/NotFound';
import Topics from '/imports/routes/Topics';

const MainApp = ({ isLoggedIn, context }) => (
  <div>
    <ul>
      <li><Link to="/">Home</Link></li>
      {isLoggedIn || <li><Link to="/login">Login</Link></li>}
      <li><Link to="/protected">Protected</Link></li>
      <li><Link to="/about">About</Link></li>
      <li><Link to="/topics">Topics</Link></li>
    </ul>
    <hr />
    <Match exactly pattern="/" component={Home} />
    <MatchWhenAuthorized pattern="/protected" component={Protected} />
    <Match exactly pattern="/login" component={Login} />
    <Match exactly pattern="/about" component={About} />
    <Match exactly pattern="/topics" component={Topics} />
    <Miss component={NotFound} />
    <hr />
    {context.someItems.map(item => <p key={item}>{item}</p>)}
  </div>
);
MainApp.propTypes = {
  context: PropTypes.object.isRequired,
  isLoggedIn: PropTypes.bool.isRequired,
};
export default connect(selectIsLoggedIn)(MainApp);
