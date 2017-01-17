import { Meteor } from 'meteor/meteor';
import { WebApp } from 'meteor/webapp';
import crypto from 'crypto';
import {
  React,
  renderToString,
  renderToStaticMarkup,
  express,
  helmet,
  rewind,
  Provider,
} from './peerDependencies';
import logger from './logger';
import { perfStart, perfStop } from './perfMeasure';
import createDataContext from './dataContext';
import cache from './cache';
import nextTick from './nextTick';

/* eslint-disable import/no-mutable-exports */
// For debug purposes
let debugLastRequest = null;
let debugLastResponse = null;
/* eslint-enable */

const NOT_FOUND_URL = '/not-found';
// URL pattern covered by Express
// @NOTE Avoid parsing "/api" URLs
const EXPRESS_COVERED_URL = /^(?!\/api)/;

/* eslint-disable no-param-reassign */
const createRouter = (MainApp, store, ServerRouter, createServerRenderContext) => {
  // Create an Express server
  const app = express();
  // Secure Express
  app.use(helmet());
  // Create data context
  const { dataContext, dataMarkup } = createDataContext();
  app
  .route(EXPRESS_COVERED_URL)
  .get((req, res, next) => {
    const url = req.path;
    // Using Express only to serve HTML files generated here
    if (url.indexOf('.') !== -1) {
      logger.debug('URL avoided', url);
      next();
      return;
    }
    // Start performance cheking
    perfStart();
    debugLastRequest = req;
    debugLastResponse = res;

    // STEP1 User agent analysis
    // @TODO

    // SETP2 Cache analysis
    // @TODO Find a pattern for expressing query
    // const query = req.query;
    let statusCode = 200;
    let head = null;
    let body = null;
    let hash = null;
    let Location = null;
    let isFromCache = false;
    let is404fromCache = false;
    if (cache.has(url)) {
      const cached = cache.get(url);
      logger.debug('Cache hit: type:', cached.type);
      statusCode = cached.type;
      isFromCache = true;
      switch (cached.type) {
        case 200:
          hash = cached.hash;
          head = cached.head;
          body = cached.body;
          break;
        case 301:
          statusCode = 301;
          Location = cached.location;
          break;
        case 404: {
          statusCode = 404;
          const notFoundCached = cache.get(NOT_FOUND_URL);
          head = notFoundCached.head;
          body = notFoundCached.body;
        } break;
        default:
      }
    }

    // STEP3 Application rendering if required
    if (!isFromCache) {
      let helmetHead = null;
      // Create and render application main entry point
      const routerContext = createServerRenderContext();
      let bodyMarkup = renderToString(
        <Provider store={store}>
          <ServerRouter location={url} context={routerContext}>
            <MainApp context={dataContext} />
          </ServerRouter>
        </Provider>,
      );
      helmetHead = rewind();
      // Get router results
      const routerResult = routerContext.getResult();
      // Redirect case
      if (routerResult.redirect) {
        statusCode = 301;
        Location = routerResult.redirect.pathname;
      // Not found, re-render for <Miss> component
      } else if (routerResult.missed) {
        statusCode = 404;
        // Check if a former not found page has been cached
        if (cache.has(NOT_FOUND_URL)) {
          is404fromCache = true;
          const cachedPage = cache.get(NOT_FOUND_URL);
          head = cachedPage.head;
          body = cachedPage.body;
        } else {
          // @NOTE There's an odd behavior while rerendering the app as depicted
          // in react-router docs. The client side does not compute the ID
          // properly leading to inconsistencies during the application re-hydratation.
          bodyMarkup = renderToStaticMarkup(
            <Provider store={store}>
              <ServerRouter location={url} context={routerContext}>
                <MainApp context={dataContext} />
              </ServerRouter>
            </Provider>,
          );
          helmetHead = rewind();
        }
      }
      if (body === null) {
        // Create body
        body = `<div id="react">${bodyMarkup}</div>${dataMarkup}`;
      }
      if (head === null) {
        // Create head
        head = ['title', 'meta', 'link', 'script']
          .reduce((acc, key) => `${acc}${helmetHead[key].toString()}`, '');
      }
      if (statusCode === 200 && hash === null) {
        hash = crypto.createHash('md5').update(head + body).digest('hex');
      }
    }

    // STEP4 Transport
    const formerHash = req.headers && req.headers['if-none-match'];
    if (statusCode === 200 && formerHash && formerHash === hash) {
      statusCode = 304;
    }
    req.res.statusCode = statusCode;
    switch (statusCode) {
      // OK
      case 200:
        req.dynamicHead = head;
        req.dynamicBody = body;
        res.set({ ETag: hash, 'Cache-Control': 'public, no-cache' });
        next();
        break;
      // Redirect
      case 301:
        res.writeHead(301, { Location });
        res.end();
        break;
      // Not modified
      case 304:
        res.writeHead(304);
        res.end();
        break;
      // Not found
      case 404:
        req.res.statusMessage = 'Not found';
        req.dynamicHead = head;
        req.dynamicBody = body;
        next();
        break;
      default:
    }

    // STEP5 Cache filling if required
    if (!isFromCache) {
      nextTick(() => {
        if (statusCode === 404) {
          if (!is404fromCache) {
            cache.setPage(NOT_FOUND_URL, head, body, hash);
          }
          cache.setNotFound(url);
        } else {
          cache.setPage(url, head, body, hash);
        }
      });
    }

    // End performance cheking
    perfStop(`${statusCode} - ${url}`);
  });
  // Add Express to Meteor's connect
  WebApp.connectHandlers.use(Meteor.bindEnvironment(app));
};

// Server side exports
export default createRouter;
export {
  logger,
  // For easing debug in `meteor shell`
  debugLastRequest, debugLastResponse,
};
