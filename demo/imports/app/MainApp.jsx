import React, { PropTypes } from 'react';
import Helmet from 'react-helmet';
import { Route, Switch, Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { pure, BrowserStats } from 'meteor/ssrwpo:ssr';
// Components
import TransitionLogger from '/imports/components/TransitionLogger';
import TransitionButton from '/imports/components/TransitionButton';
import Privateroute from '/imports/components/Privateroute';
// Pages import
import Home from '/imports/routes/Home';
import Protected from '/imports/routes/Protected';
import Login from '/imports/routes/Login';
import Folks from '/imports/routes/Folks';
import Places from '/imports/routes/Places';
import Translations from '/imports/routes/Translations';
import Performance from '/imports/routes/Performance';
import PubSub from '/imports/routes/PubSub';
import AsymetricSsr from '/imports/routes/AsymetricSsr';
import Topics from '/imports/routes/Topics';
import About from '/imports/routes/About';
import NotFound from '/imports/routes/NotFound';

const MainApp = ({ isLoggedIn }) => {
  const styles = {
    ul: { listStyleType: 'none', padding: 0, textAlign: 'center' },
    li: { display: 'inline', margin: 5 },
  };
  return (
    <div>
      <Helmet>
        <meta charSet="utf-8" />
        <meta httpEquiv="x-ua-compatible" content="ie=edge" />
        <title>SSR</title>
        <meta name="description" content="Router with SSR for Node & Meteor" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png?v=2" />
        <link rel="icon" type="image/png" href="/favicon-32x32.png?v=2" sizes="32x32" />
        <link rel="icon" type="image/png" href="/favicon-16x16.png?v=2" sizes="16x16" />
        <link rel="manifest" href="/_manifest.json?v=2" />
        <link rel="mask-icon" href="/safari-pinned-tab.svg?v=2" color="#00a2d4" />
        <link rel="shortcut icon" href="/favicon.ico?v=2" />
        <meta name="apple-mobile-web-app-title" content="SSR" />
        <meta name="application-name" content="SSR" />
        <meta name="theme-color" content="#ffffff" />
      </Helmet>
      <TransitionLogger />
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
        <li style={styles.li}><Link to="/asymetric-ssr">Asymetric SSR</Link></li>
        <li style={styles.li}><Link to="/topics">Topics</Link></li>
        <li style={styles.li}><Link to="/about">About</Link></li>
      </ul>
      <hr />
      {/* Programmatic transitions */}
      <TransitionButton href="/topics">Go to topics</TransitionButton>
      <hr />
      <Switch>
        <Route exact path="/" component={Home} />
        <Privateroute path="/protected" component={Protected} />
        <Route path="/login" component={Login} />
        <Route path="/folks" component={Folks} />
        <Route exact path="/places" component={Places} />
        <Route exact path="/translations" component={Translations} />
        <Route exact path="/performance" component={Performance} />
        <Route exact path="/pubsub" component={PubSub} />
        <Route exact path="/asymetric-ssr" component={AsymetricSsr} />
        <Route path="/topics" component={Topics} />
        <Route path="/about" component={About} />
        <Route component={NotFound} />
      </Switch>
    </div>
  );
};
MainApp.propTypes = {
  isLoggedIn: PropTypes.bool.isRequired,
};
export default withRouter(connect((state => ({ isLoggedIn: state.auth })))(pure(MainApp)));
