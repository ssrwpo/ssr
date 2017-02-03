/* eslint-disable import/first, no-undef, import/no-extraneous-dependencies, import/no-unresolved, import/extensions, max-len */
import express from 'express';
import helmet from 'helmet';
import pull from 'lodash/pull';
import Fiber from 'fibers';
import {
  ServerRouter as DefaultServerRouter,
  createServerRenderContext as defaultCreateServerRenderContext,
} from 'react-router';
import i18nMiddleware from 'i18next-express-middleware';
/* eslint-enable */
import { Meteor } from 'meteor/meteor';
import { WebApp } from 'meteor/webapp';
import './utils/peerDependencies';
import cache from './utils/cache';
import logger from './utils/logger';
import { perfStart, perfStop } from './utils/perfMeasure';
import defaultPlatformTransformers from './utils/platformTransformers';
// Serving steps
import learnForeignLanguages from './steps/learnForeignLanguages';
import userAgentAnalysis from './steps/userAgentAnalysis';
import routePatternAnalysis from './steps/routePatternAnalysis';
import queryParamsAnalysis from './steps/queryParamsAnalysis';
import cacheAnalysis from './steps/cacheAnalysis';
import urlAnalysis from './steps/urlAnalysis';
import createStore from './steps/createStore';
import initStoreValues from './steps/initStoreValues';
import processSSRRequirements from './steps/processSSRRequirements';
import createDataContext from './steps/createDataContext';
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

/* eslint-disable max-len */
/**
 * Create SSR router
 * @function createRouter
 * @param {Object} MainApp - app start point
 * @param {Object=} routerConfig
 * @param {Object=} routerConfig.ServerRouter
 * @param {Function=} routerConfig.createServerRenderContext
 * @param {Object=} routerConfig.observedCursors - Observe change on cursors to clear cache
 * @param {Function=} routerConfig.robotsTxt - dynamically generate robots.txt
 * @param {Object=} routerConfig.routes
 * @param {Object=} routerConfig.routes.<string> - Route path
 * @param {function(Object)=} routerConfig.routes.<string>.urlQueryParameters - function(query), callback validates params
 * @param {function(Object, Object)=} routerConfig.routes.<string>.middleware - function(stepResults, store), callback for apply custom user action
 * @param {Object=} routerConfig.routes.<string>.options - options like enableCahing
 * @param {boolean=} routerConfig.routes.<string>.options.enableCahing - if true route is cached
 * @param {function(Object)=} routerConfig.routes.urlQueryParameters - Global urlQueryParameters
 * @param {function(Object, Object)=} routerConfig.routes.middlewares - Global middlewares
 * @param {Function=} routerConfig.sitemapXml - dynamically generate sitemap.xml
 * @param {Object=} routerConfig.webhooks
 * @param {Object=} storeConfig
 * @param {Object=} storeConfig.appReducers
 * @param {Object=} storeConfig.storeSubscription
 */
/* eslint-enable */

/* eslint-disable no-param-reassign */
const createRouter = (MainApp, {
  ServerRouter = DefaultServerRouter,
  createServerRenderContext = defaultCreateServerRenderContext,
  i18n,
  observedCursors = {},
  robotsTxt = null,
  routes = {},
  sitemapXml = null,
  webhooks = {},
} = {}, {
  appReducers = {},
  platformTransformers = defaultPlatformTransformers,
  storeSubscription = null,
} = {}) => {
  // Create an Express server
  const app = express();

  // Add Express to Meteor's connect
  WebApp.connectHandlers.use(Meteor.bindEnvironment(app));

  // Define app route patterns
  const routePatterns = Object.keys(routes);
  pull(routePatterns, 'middlewares', 'urlQueryParameters');

  // Observe cursors change
  observedCursors.forEach((cursor) => {
    cursor.observeChanges({
      added: () => cache.reset(),
      changed: () => cache.reset(),
      removed: () => cache.reset(),
    });
  });

  // Secure Express
  app.use(helmet());

  // Express middleware to handle i18n
  if (i18n) {
    app.use(i18nMiddleware.handle(i18n));
  }
  app
  // Routes for HTML payload
  .route(EXPRESS_COVERED_URL)
  .get((req, res, next) => {
    const callback = () => {
      const url = req.path;

      // Start performance checking
      perfStart();
      debugLastRequest = req;
      debugLastResponse = res;

      // Impure structure for storing results throughout steps
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
        i18n,
        i18nOptions: null,
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

      // STEP 1: Do we want speak to world?
      learnForeignLanguages(stepResults);

      // STEP 2: User agent analysis
      userAgentAnalysis(stepResults);

      // STEP 3: Find current route pattern and set req.params
      routePatternAnalysis(stepResults, routePatterns);

      // STEP 4: Analyse query params
      queryParamsAnalysis(stepResults);

      // STEP 5: Create location
      urlAnalysis(stepResults);

      // STEP 6: Cache analysis
      cacheAnalysis(stepResults);

      if (!stepResults.isFromCache) {
        // STEP 7: Create store
        createStore(
          stepResults,
          storeSubscription,
          appReducers,
          platformTransformers,
        );

        // STEP 8: Init store values such as platform
        initStoreValues(stepResults);

        // STEP 9: process per-component SSR Requirements
        processSSRRequirements(stepResults).then(() => {
          // STEP 10: Create data context
          createDataContext(stepResults);

          // STEP 11: Application rendering if required
          applicationRendering(stepResults);

          // STEP 12: Cache filling if required
          cacheFilling(stepResults);
        });
      } else {
        logger.debug('cache fill: avoided');
      }

      // STEP 13: Transport
      transport(stepResults);

      // End performance cheking
      perfStop(`${stepResults.statusCode} - ${stepResults.url}`);
    };

    if (Fiber.current) {
      callback();
    } else {
      new Fiber(() => callback.call()).run();
    }
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

      createStore(stepResults, storeSubscription, appReducers);

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
