import { createRouter, logger } from 'meteor/ssrwpo:ssr';
import MainApp from '/imports/app/MainApp';
import appReducers from '/imports/reducers';
// Fixtures
import '/imports/api/Folks/server';
import '/imports/api/Places/server';
// Collections
import Folks from '/imports/api/Folks';
import Places from '/imports/api/Places';
import PubSub from '/imports/api/PubSub';
import '/imports/api/PubSub/server';
// Store subscription
import storeSubscription from '/imports/store';
// i18n
// eslint-disable-next-line no-unused-vars
import i18n from '/imports/i18n/i18nServer';
// Sitemaps & Robots
import robotsTxt from './robotsTxt';
import sitemapXml from './sitemapXml';
// URL query parameters
import routes from './routes';
// Webhooks
import webhooks from './webhooks';

const observedCursors = [
  Folks.find({}, { sort: { order: -1 } }),
  Places.find({}, { sort: { order: -1 } }),
  PubSub.find({}, { sort: { lastMod: -1 } }),
];

logger.info('Starting router');

// Your MainApp as the top component rendered and injected in the HTML payload
createRouter(MainApp, {
  // Optional: An i18n config for server side
  i18n,
  // Optional: An object containing the observed cursors to clear cache on change
  observedCursors,
  // Optional: A function that returns the content of your robots.txt
  robotsTxt,
  // Optional: An object describe route action and validator for url parameters
  routes,
  // Optional: A function that returns the content of your sitemaps.xml
  sitemapXml,
  // Optional: An object with keys on route solver
  webhooks,
}, {
  // Optional: An object containing your application reducers
  appReducers,
  // Optional: Store subscription
  storeSubscription,
});

logger.info('Router started');
