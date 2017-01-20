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
// Sitemaps & Robots
import robotsTxt from './robotsTxt';
import sitemapXml from './sitemapXml';

const appCursors = {
  Folks: Folks.find({}, { sort: { order: -1 } }),
  Places: Places.find({}, { sort: { order: -1 } }),
};

logger.info('Starting router');
createRouter({
  // Your MainApp as the top component rendered and injected in the HTML payload
  MainApp,
  // Optionnal: An object containing your application reducers
  appReducers,
  // Optionnal: An object containing the cursors required as data context
  appCursors,
  // Optionnal: A function that returns the content of your robots.txt
  robotsTxt,
  // Optionnal: A function that returns the content of your sitemaps.xml
  sitemapXml,
  // The server side router from react-router-4
  ServerRouter,
  createServerRenderContext,
});
logger.info('Router started');
