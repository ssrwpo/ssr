/* eslint-disable import/first, no-undef, import/no-extraneous-dependencies, import/no-unresolved, import/extensions, max-len */
import express from 'express';
import helmet from 'helmet';
import Fiber from 'fibers';
import i18nMiddleware from 'i18next-express-middleware';
/* eslint-enable */
import { Meteor } from 'meteor/meteor';
import { WebApp } from 'meteor/webapp';
import logger from '../shared/utils/logger';
import { perfStart, perfStop } from './utils/perfMeasure';
import createAppAndPackageStore from './utils/createAppAndPackageStore';
import defaultPlatformTransformers from './utils/platformTransformers';
// Serving steps
import learnForeignLanguages from './steps/learnForeignLanguages';
import userAgentAnalysis from './steps/userAgentAnalysis';
import queryParamsAnalysis from './steps/queryParamsAnalysis';
import cacheAnalysis from './steps/cacheAnalysis';
import urlAnalysis from './steps/urlAnalysis';
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

/* eslint-disable no-param-reassign */
const createRouter = ({
  MainApp,
  storeSubscription,
  appReducers = {},
  appCursors = {},
  robotsTxt,
  sitemapXml,
  humansTxt,
  urlQueryParameters,
  webhooks,
  ServerRouter,
  i18n,
  platformTransformers = defaultPlatformTransformers,
}) => {
  // Create a redux store
  const store = createAppAndPackageStore(appReducers, appCursors, platformTransformers);
  // Set store subscription
  if (storeSubscription) store.subscribe(() => storeSubscription(store));
  // Create an Express server
  const app = express();
  // Secure Express
  app.use(helmet());
  // express middleware to handle i18n
  if (i18n) app.use(i18nMiddleware.handle(i18n));
  app
  // Routes for HTML payload
  .route(EXPRESS_COVERED_URL)
  .get((req, res, next) => {
    const callback = () => {
      const url = req.path;
      // Start performance cheking
      perfStart();
      debugLastRequest = req;
      debugLastResponse = res;
      // Inpure structure for storing results throughout steps
      const stepResults = {
        req,
        res,
        next,
        url,
        urlQueryParameters,
        hasUnwantedQueryParameters: false,
        statusCode: 200,
        hash: null,
        html: null,
        Location: null,
        isFromCache: false,
        is404fromCache: false,
        store,
        contextMarkup: null,
        MainApp,
        // Used for localization
        i18n,
        i18nOptions: null,
        platformTransformers,
        humansTxt,
        // Used for circumventing issues on checkNpmDependencies
        ServerRouter,
      };

      // STEP1 Do we want speak to world?
      learnForeignLanguages(stepResults);
      // STEP2 User agent analysis
      userAgentAnalysis(stepResults);
      // STEP3 Analyse query params
      queryParamsAnalysis(stepResults);
      // STEP4 Create location
      urlAnalysis(stepResults);
      // SETP5 Cache analysis
      cacheAnalysis(stepResults);
      // STEP6 Create data context
      createDataContext(stepResults);
      // STEP7 Application rendering if required
      applicationRendering(stepResults);
      // STEP8 Transport
      transport(stepResults);
      // STEP9 Cache filling if required
      cacheFilling(stepResults);
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
    app.get('/robots.txt', (req, res) => {
      perfStart();
      res.end(robotsTxt(store));
      perfStop('/robots.txt');
    });
  }
  // Routes for sitemap.xml payload
  if (sitemapXml) {
    app.get('/sitemap.xml', (req, res) => {
      perfStart();
      res.set('Content-Type', 'text/xml').end(sitemapXml(store));
      perfStop('/sitemap.xml');
    });
  }
  // Routes for humans.txt payload
  if (humansTxt) {
    app.get('/humans.txt', (req, res) => {
      perfStart();
      res.end(humansTxt(store));
      perfStop('/humans.txt');
    });
  }
  // Server side routes
  if (webhooks) webhooks(app);
  // Add Express to Meteor's connect
  WebApp.connectHandlers.use(Meteor.bindEnvironment(app));
};

// Server side exports
export {
  createRouter,
  logger,
  // For easing debug in `meteor shell`
  debugLastRequest, debugLastResponse,
};
