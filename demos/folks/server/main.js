import { createRouter, resetSSRCache, logger } from 'meteor/ssrwpo:ssr';
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
// localization resources
import { en, fr, tr } from '/imports/messages';
// Store subscription
import storeSubscription from '/imports/store';
// Sitemaps & Robots
import robotsTxt from './robotsTxt';
import sitemapXml from './sitemapXml';
// URL query parameters
import routes from './routes';
// Webhooks
import webhooks from './webhooks';

const localization = {
  languages: ['en', 'tr', 'fr'], // required
  fallback: 'en', // required
  async: Meteor.settings.public.localization.async, // for async translations
  messages: { en, fr, tr }, // language resources required if not async
};

logger.info('Starting router');

// Your MainApp as the top component rendered and injected in the HTML payload
createRouter(MainApp, {
  // Optional: A function that returns the content of your robots.txt
  robotsTxt,
  // Optional: An object describe route action and validator for url parameters
  routes,
  // Optional: A function that returns the content of your sitemaps.xml
  sitemapXml,
  // Optional: An object with keys on route solver
  webhooks,
  // Optional: initial localization
  localization,
}, {
  // Optional: An object containing your application reducers
  appReducers,
  // Optional: Store subscription
  storeSubscription,
});

// The application needs to instigate it's own SSR cache refreshing policy. This allows
// you to choose your own frequency for cache resets, and to handl your own policy
// for rendering external data souces.
//
// In this example we simply reset the entire cache if any of the collections change.

const globalCollections = [Folks, Places, PubSub];
globalCollections.forEach((collection) => {
  let initializing = true;
  collection.find().observeChanges({
    added: () => { if (!initializing) resetSSRCache(); },
    changed: () => resetSSRCache(),
    removed: () => resetSSRCache(),
  });
  initializing = false;
});
resetSSRCache();

logger.info('Router started');
