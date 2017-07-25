/* eslint-disable import/first, no-undef, import/no-extraneous-dependencies, import/no-unresolved, import/extensions, max-len */
import express from 'express';
import helmet from 'helmet';
import pull from 'lodash/pull';
import Fiber from 'fibers';
import { applyMiddleware } from 'redux';
import {
  ServerRouter as DefaultServerRouter,
  createServerRenderContext as defaultCreateServerRenderContext,
} from 'react-router';
/* eslint-enable */
import { Meteor } from 'meteor/meteor';
import { WebApp } from 'meteor/webapp';
import logger from '../shared/utils/logger';
import { checkTypes } from './utils/error';
import { perfStart, perfStop } from './utils/perfMeasure';
import defaultPlatformTransformers from './utils/platformTransformers';
// Serving steps
import speakForeignLanguages from './steps/speakForeignLanguages';
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
// * doesn't start with `/api/`
// * doesn't start with `/__cordova/`
// * contains no `.`
const EXPRESS_COVERED_URL = /^\/(?!api\/)(?!__cordova\/)[^.]*$/;

/* eslint-disable max-len */
/**
 * Create SSR router
 * @function createRouter
 * @param {Object} MainApp - app start point
 * @param {Object=} routerConfig
 * @param {Object=} routerConfig.ServerRouter
 * @param {Function=} routerConfig.createServerRenderContext
 * @param {Object=} routerConfig.localization - Localization
 * @param {Function=} routerConfig.robotsTxt - dynamically generate robots.txt
 * @param {Function=} routerConfig.humansTxt - dynamically generate humans.txt
 * @param {Object=} routerConfig.routes
 * @param {Object=} routerConfig.routes.<string> - Route path
 * @param {function(Object)=} routerConfig.routes.<string>.urlQueryParameters - function(query), callback validates params
 * @param {Object=} routerConfig.routes.<string>.options - options like enableCaching
 * @param {boolean=} routerConfig.routes.<string>.options.enableCaching - if true route is cached
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
  localization = null,
  humansTxt = null,
  robotsTxt = null,
  routes = {},
  sitemapXml = null,
  webhooks = {},
} = {}, {
  appReducers = {},
  storeEnhancers = applyMiddleware(),
  platformTransformers = defaultPlatformTransformers,
  storeSubscription = null,
} = {}) => {
  // Create an Express server
  const app = express();

  // Webhooks support
  const match = checkTypes(
    webhooks,
    ['function', 'object'],
    'webhooks must be an object with routes as keys and callbacks as values for these keys or a function taking the express app as its arguments',
  );

  if (match === 'function') {
    webhooks(app);
  } else if (match === 'object') {
    Object.keys(webhooks).forEach((webhookRoute) => {
      app.use(webhookRoute, webhooks[webhookRoute]);
    });
  }

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
        contextMarkup: null,
        createServerRenderContext,
        hasUnwantedQueryParameters: false,
        hash: null,
        html: null,
        localization,
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
        userLocale: '',
        componentCacheConfig: null,
      };

      // STEP 1: User agent analysis
      speakForeignLanguages(stepResults);

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

      // If we have a cached page, return that now
      if (stepResults.isFromCache) {
        logger.debug('cache fill: avoided');
        transport(stepResults);
        perfStop(`${stepResults.statusCode} - ${stepResults.url}`);
        return;
      }

      // STEP 7: Create store
      createStore(
        stepResults,
        storeSubscription,
        appReducers,
        platformTransformers,
        storeEnhancers,
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

        // STEP 13: Transport
        transport(stepResults);

        // End performance cheking
        perfStop(`${stepResults.statusCode} - ${stepResults.url}`);
      }).catch((e) => {
        stepResults.statusCode = 500;
        stepResults.serverError = e;
        logger.error(e.message);
        transport(stepResults);
      });
    };

    if (Fiber.current) {
      callback();
    } else {
      new Fiber(() => callback.call()).run();
    }
  });

  // Routes for robots.txt payload
  if (robotsTxt) {
    app.get('/robots.txt', (req, res) => {
      const stepResults = { store: null };
      perfStart();
      createStore(stepResults, storeSubscription, appReducers);
      res.end(robotsTxt(stepResults.store));
      perfStop('/robots.txt');
    });
  }
  // Routes for sitemap.xml payload
  if (sitemapXml) {
    app.get('/sitemap.xml', (req, res) => {
      const callback = () => {
        const stepResults = { store: null };
        perfStart();
        createStore(stepResults, storeSubscription, appReducers);
        res.set('Content-Type', 'text/xml');
        res.end(sitemapXml(stepResults.store));
        perfStop('/sitemap.xml');
      };

      if (Fiber.current) {
        callback();
      } else {
        new Fiber(() => callback.call()).run();
      }
    });
  }
  // Routes for humans.txt payload
  if (humansTxt) {
    app.get('/humans.txt', (req, res) => {
      const stepResults = { store: null };
      perfStart();
      createStore(stepResults, storeSubscription, appReducers);
      res.end(humansTxt(stepResults.store));
      perfStop('/humans.txt');
    });
  }
  // Route for localization
  if (localization && localization.async) {
    const messageStr = JSON.stringify(localization.messages);
    app.get('/api/translations', (req, res) => {
      perfStart();
      res.set('Content-Type', 'application/json');
      res.end(messageStr);
      perfStop('/translations');
    });
  }
};

// Server side exports
export {
  createRouter,
  logger,
  // For easing debug in `meteor shell`
  debugLastRequest, debugLastResponse,
};
