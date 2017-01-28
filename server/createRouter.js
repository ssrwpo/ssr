/* eslint-disable import/first, no-undef, import/no-extraneous-dependencies, import/no-unresolved, import/extensions, max-len */
import express from 'express';
import helmet from 'helmet';
import pull from 'lodash/pull';
import { Meteor } from 'meteor/meteor';
import { WebApp } from 'meteor/webapp';
/* eslint-enable */
import './utils/peerDependencies';
import logger from './utils/logger';
import { perfStart, perfStop } from './utils/perfMeasure';
// Serving steps
import userAgentAnalysis from './steps/userAgentAnalysis';
import routePatternAnalysis from './steps/routePatternAnalysis';
import queryParamsAnalysis from './steps/queryParamsAnalysis';
import cacheAnalysis from './steps/cacheAnalysis';
import urlAnalysis from './steps/urlAnalysis';
import createStore from './steps/createStore';
import initStoreValues from './steps/initStoreValues';
import createDataContext from './steps/createDataContext';
import applyRouteMiddlewares from './steps/applyRouteMiddlewares';
import applicationRendering from './steps/applicationRendering';
import transport from './steps/transport';
import cacheFilling from './steps/cacheFilling';

/* eslint-disable import/no-mutable-exports */
// For debug purposes
let debugLastRequest = null;
let debugLastResponse = null;
/* eslint-enable */

// URL pattern covered by Express
// @NOTE URLs that:
// * doesn't start with "/api/"
// * contains no dot
const EXPRESS_COVERED_URL = /^\/(?!api\/)[^.]*$/;

/**
 * @param {Object} routes
 * @param {Object} routes.<string> - Route path
 * @param {function(Object)} routes.<string>.urlQueryParameters - function(query)
 * @param {function(Object, Object)} routes.<string>.middleware - function(stepResults, store)
 * @param {Object} routes.<string>.options - options like enableCahing, routeComposition etc...
 * @param {function(Object)} routes.urlQueryParameters - Global urlQueryParameters
 * @param {function(Object, Object)} routes.middlewares - Global middlewares
 */

/* eslint-disable no-param-reassign */
const createRouter = ({
  MainApp,
  storeSubscription,
  appReducers = {},
  appCursors = {},
  robotsTxt,
  sitemapXml,
  routes = {},
  webhooks,
  ServerRouter,
  createServerRenderContext,
}) => {
  // Create an Express server
  const app = express();

  // Add Express to Meteor's connect
  WebApp.connectHandlers.use(Meteor.bindEnvironment(app));

  // Define app route patterns
  const routePatterns = Object.keys(routes);
  pull(routePatterns, 'middlewares', 'urlQueryParameters');

  // Secure Express
  app.use(helmet());
  app
  // Routes for HTML payload
  .route(EXPRESS_COVERED_URL)
  .get((req, res, next) => {
    const url = req.path;

    // Start performance cheking
    perfStart();
    debugLastRequest = req;
    debugLastResponse = res;

    // Inpure structure for storing results throughout steps
    const stepResults = {
      MainApp,
      // Used for circumventing issues on checkNpmDependencies
      ServerRouter,
      body: null,
      contextMarkup: null,
      createServerRenderContext,
      hasUnwantedQueryParameters: false,
      hash: null,
      head: null,
      isFromCache: false,
      is404fromCache: false,
      Location: null,
      next,
      req,
      res,
      routePattern: null,
      routes,
      sortedQuery: {},
      statusCode: 200,
      store: null,
      url,
      userAgent: 'default',
    };

    // STEP1 User agent analysis
    userAgentAnalysis(stepResults);

    // STEP2 Find current route pattern and set req.params
    routePatternAnalysis(stepResults, routePatterns);

    // STEP3 Analyse query params
    queryParamsAnalysis(stepResults);

    // STEP4 Create location
    urlAnalysis(stepResults);

    // SETP5 Cache analysis
    cacheAnalysis(stepResults);

    if (!stepResults.isFromCache) {
      // STEP7 Create store
      createStore(stepResults, storeSubscription, appReducers, appCursors);

      // STEP8 Init store values like platform
      initStoreValues(stepResults);

      // STEP8 apply route middlewares
      applyRouteMiddlewares(stepResults);

      // STEP9 Create data context
      createDataContext(stepResults);

      // STEP10 Application rendering if required
      applicationRendering(stepResults);

      // STEP11 Cache filling if required
      cacheFilling(stepResults);
    }

    // STEP12 Transport
    transport(stepResults);

    // End performance cheking
    perfStop(`${stepResults.statusCode} - ${stepResults.url}`);
  });

  // Routes for robots.txt payload
  if (robotsTxt) {
    app
    .route('/robots.txt')
    .get((req, res) => {
      perfStart();
      res.end(robotsTxt());
      perfStop('/robots.txt');
    });
  }

  // Routes for sitemap.xml payload
  if (sitemapXml) {
    app.get('/sitemap.xml', (req, res) => {
      const stepResults = { store: null };
      perfStart();

      createStore(stepResults, storeSubscription, appReducers, appCursors);

      res.set('Content-Type', 'text/xml');
      res.end(sitemapXml(stepResults.store));
      perfStop('/sitemap.xml');
    });
  }

  // Server side routes
  if (webhooks) {
    Object.keys(webhooks).forEach(webhookRoute =>
      app.all(webhookRoute, webhooks[webhookRoute]),
    );
  }
};

// Server side exports
export {
  createRouter,
  logger,
  // For easing debug in `meteor shell`
  debugLastRequest, debugLastResponse,
};
