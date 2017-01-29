import { createRouter, logger } from 'meteor/ssrwpo:ssr';
import { ServerRouter, createServerRenderContext } from 'react-router';
import MainApp from '/imports/app/MainApp';
import * as appReducers from '/imports/reducers';
// Fixtures
import '/imports/api/Folks/server';
import '/imports/api/Places/server';
// Collections
import Folks from '/imports/api/Folks';
import Places from '/imports/api/Places';
// Store subscription
import storeSubscription from '/imports/store';
// i18n
// eslint-disable-next-line no-unused-vars
import i18n from '/imports/i18n/i18nServer';
// Sitemaps & Robots
import robotsTxt from './robotsTxt';
import sitemapXml from './sitemapXml';
// URL query parameters
import urlQueryParameters from './urlQueryParameters';
// Webhooks
import webhooks from './webhooks';

const appCursors = {
  Folks: Folks.find({}, { sort: { order: -1 } }),
  Places: Places.find({}, { sort: { order: -1 } }),
};

logger.info('Starting router');
createRouter({
  // Your MainApp as the top component rendered and injected in the HTML payload
  MainApp,
  // Optional: Store subscription
  storeSubscription,
  // Optional: An object containing your application reducers
  appReducers,
  // Optional: An object containing the cursors required as data context
  appCursors,
  // Optional: A function that returns the content of your robots.txt
  robotsTxt,
  // Optional: A function that returns the content of your sitemaps.xml
  sitemapXml,
  // Optional: An object with keys on URL with query parameters
  urlQueryParameters,
  // Optional: An object with keys on route solver
  webhooks,
  // Optional: An i18n config for server side
  i18n,
  // The server side router from react-router-4
  ServerRouter,
  createServerRenderContext,
});
logger.info('Router started');
