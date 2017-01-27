import React, { PropTypes } from 'react';
import { Match, Miss, Link } from 'react-router';
import { LocationSubscriber } from 'react-router/Broadcasts';
import { connect } from 'react-redux';
import { pure, logger } from 'meteor/ssrwpo:ssr';
// Shared selectors
import { selectIsLoggedIn } from '/imports/reducers/auth';
// Components
import MatchWhenAuthorized from '/imports/components/MatchWhenAuthorized';
// Pages import
import Home from '/imports/routes/Home';
import Protected from '/imports/routes/Protected';
import Login from '/imports/routes/Login';
import Folks from '/imports/routes/Folks';
import Places from '/imports/routes/Places';
import Performance from '/imports/routes/Performance';
import About from '/imports/routes/About';
import NotFound from '/imports/routes/NotFound';
import Topics from '/imports/routes/Topics';


const MainApp = ({ isLoggedIn }, { router }) => {
  const { transitionTo } = router;
  return (
    <div>
      <LocationSubscriber>
        {
          (location) => {
            logger.info('location', location);
            return null;
          }
        }
      </LocationSubscriber>
      <ul>
        <li><Link to="/">Home</Link></li>
        {isLoggedIn || <li><Link to="/login">Login</Link></li>}
        <li><Link to="/protected">Protected</Link></li>
        <li><Link to="/folks">Folks</Link></li>
        <li><Link to="/places">Places</Link></li>
        <li><Link to="/performance">Performance</Link></li>
        <li><Link to="/about">About</Link></li>
        <li><Link to="/topics">Topics</Link></li>
      </ul>
      <hr />
      {/* Programmatic transitions */}
      <button onClick={() => transitionTo('/titi')}>Got to topics</button>
      <hr />
      <Match exactly pattern="/" component={Home} />
      <MatchWhenAuthorized pattern="/protected" component={Protected} />
      <Match exactly pattern="/login" component={Login} />
      <Match pattern="/folks" component={Folks} />
      <Match exactly pattern="/places" component={Places} />
      <Match exactly pattern="/performance" component={Performance} />
      <Match exactly pattern="/about" component={About} />
      <Match pattern="/topics" component={Topics} />
      <Miss component={NotFound} />
    </div>
  );
};
MainApp.propTypes = {
  isLoggedIn: PropTypes.bool.isRequired,
};
MainApp.contextTypes = {
  router: PropTypes.object.isRequired,
};
export default connect(selectIsLoggedIn)(pure(MainApp));
