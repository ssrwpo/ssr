import { Meteor } from 'meteor/meteor';
import React, { PropTypes } from 'react';
import { Match, Miss, Link } from 'react-router';
import { LocationSubscriber } from 'react-router/Broadcasts';
import { connect } from 'react-redux';
import { pure, logger, BrowserStats } from 'meteor/ssrwpo:ssr';
// Components
import MatchWhenAuthorized from '/imports/components/MatchWhenAuthorized';
// Pages import
import Home from '/imports/routes/Home';
import Protected from '/imports/routes/Protected';
import Login from '/imports/routes/Login';
import Folks from '/imports/routes/Folks';
import Places from '/imports/routes/Places';
import Translations from '/imports/routes/Translations';
import Performance from '/imports/routes/Performance';
import PubSub from '/imports/routes/PubSub';
import About from '/imports/routes/About';
import NotFound from '/imports/routes/NotFound';
import Topics from '/imports/routes/Topics';

const MainApp = ({ isLoggedIn }, { router }) => {
  const { transitionTo } = router;
  const styles = {
    ul: { listStyleType: 'none', padding: 0, textAlign: 'center' },
    li: { display: 'inline', margin: 5 },
  };
  return (
    <div>
      {
        <LocationSubscriber>
          {
            (location) => {
              if (Meteor.isClient) {
                logger.info('location', location);
              }
              return null;
            }
          }
        </LocationSubscriber>
      }
      <BrowserStats />
      <ul style={styles.ul}>
        <li style={styles.li}><Link to="/">Home</Link></li>
        {isLoggedIn || <li style={styles.li} ><Link to="/login">Login</Link></li>}
        <li style={styles.li}><Link to="/protected">Protected</Link></li>
        <li style={styles.li}><Link to="/folks">Folks</Link></li>
        <li style={styles.li}><Link to="/places">Places</Link></li>
        {/* TODO only show if localization enabled */}
        <li style={styles.li}><Link to="/translations">Translations</Link></li>
        <li style={styles.li}><Link to="/performance">Performance</Link></li>
        <li style={styles.li}><Link to="/pubsub">Reactive cases</Link></li>
        <li style={styles.li}><Link to="/topics">Topics</Link></li>
        <li style={styles.li}><Link to="/about">About</Link></li>
      </ul>
      <hr />
      {/* Programmatic transitions */}
      <button onClick={() => transitionTo('/topics')}>Got to topics</button>
      <hr />
      <Match exactly pattern="/" component={Home} />
      <MatchWhenAuthorized pattern="/protected" component={Protected} />
      <Match exactly pattern="/login" component={Login} />
      <Match pattern="/folks" component={Folks} />
      <Match exactly pattern="/places" component={Places} />
      <Match exactly pattern="/translations" component={Translations} />
      <Match exactly pattern="/performance" component={Performance} />
      <Match exactly pattern="/pubsub" component={PubSub} />
      <Match pattern="/topics" component={Topics} />
      <Match exactly pattern="/about" component={About} />
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
export default connect((state => ({ isLoggedIn: state.auth })))(pure(MainApp));
