import { Meteor } from 'meteor/meteor';
import React, { PropTypes } from 'react';
import { Route, Switch, Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { pure, logger, BrowserStats } from 'meteor/ssrwpo:ssr';
// Components
// import Privateroute from '/imports/components/Privateroute';
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
      {/* {
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
      } */}
      <BrowserStats />
      <ul style={styles.ul}>
        <li style={styles.li}><Link to="/">Home</Link></li>
        {isLoggedIn || <li style={styles.li} ><Link to="/login">Login</Link></li>}
        <li style={styles.li}><Link to="/protected">Protected</Link></li>
        <li style={styles.li}><Link to="/folks">Folks</Link></li>
        <li style={styles.li}><Link to="/places">Places</Link></li>
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
      <Switch>
        <Route exact path="/" component={Home} />
        {/* <Privateroute path="/protected" component={Protected} /> */}
        <Route path="/login" component={Login} />
        <Route path="/folks" component={Folks} />
        <Route exact path="/places" component={Places} />
        <Route exact path="/translations" component={Translations} />
        <Route exact path="/performance" component={Performance} />
        <Route exact path="/pubsub" component={PubSub} />
        <Route path="/topics" component={Topics} />
        <Route exact path="/about" component={About} />
        <Route component={NotFound} />
      </Switch>
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
