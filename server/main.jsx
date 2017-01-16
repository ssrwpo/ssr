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
    perfStart();
    debugLastRequest = req;
    debugLastResponse = res;
    const url = req.path;
    // @TODO Find a pattern for expressing query
    // const query = req.query;
    // Page is in the cache
    if (cache.has(url)) {
      const cached = cache.get(url);
      logger.debug('Cache hit: type:', cached.type);
      switch (cached.type) {
        case 200: {
          const formerHash = req.headers && req.headers['if-none-match'];
          if (formerHash && formerHash === cached.hash) {
            logger.debug('304 - Not modified');
            req.res.statusCode = 304;
            res.writeHead(304);
            res.end();
          } else {
            logger.debug('200 - OK');
            req.dynamicHead = cached.head;
            req.dynamicBody = cached.body;
            res.set({ ETag: cached.hash, 'Cache-Control': 'public, no-cache' });
            next();
          }
        } break;
        case 301:
          logger.debug('301 - Redirect');
          req.res.statusCode = 301;
          res.writeHead(301, { Location: cached.location });
          res.end();
          break;
        case 404: {
          logger.debug('404 - Not found');
          req.res.statusCode = 404;
          req.res.statusMessage = 'Not found';
          const notFoundCached = cache.get(NOT_FOUND_URL);
          req.dynamicHead = notFoundCached.head;
          req.dynamicBody = notFoundCached.body;
          next();
        } break;
        default:
      }
      perfStop(url);
      return;
    }
    let head = null;
    let body = null;
    // Create application main entry point
    const routerContext = createServerRenderContext();
    let bodyMarkup = renderToString(
      <Provider store={store}>
        <ServerRouter location={url} context={routerContext}>
          <MainApp context={dataContext} />
        </ServerRouter>
      </Provider>,
    );
    // Get router results
    const routerResult = routerContext.getResult();
    // Redirect case
    if (routerResult.redirect) {
      logger.debug('301 - Redirect');
      req.res.statusCode = 304;
      const Location = routerResult.redirect.pathname;
      res.writeHead(301, { Location });
      res.end();
      nextTick(() => cache.setRedirect(url, Location));
      perfStop(url);
      return;
    }
    // Not found, re-render for <Miss> component
    if (routerResult.missed) {
      logger.debug('404 - Not found');
      req.res.statusCode = 404;
      req.res.statusMessage = 'Not found';
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
    } else {
      logger.debug('200 - OK');
    }
    // Cache missed case: render the app
    logger.debug('Cache missed');
    logger.debug('Store initial state:', JSON.stringify(store.getState()));
    // Create body
    body = `<div id="react">${bodyMarkup}</div>${dataMarkup}`;
    // Create head
    const helmetHead = rewind();
    head = ['title', 'meta', 'link', 'script']
      .reduce((acc, key) => `${acc}${helmetHead[key].toString()}`, '');
    // Set response's head and body in Webapp's dynamic handlers
    req.dynamicHead = head;
    req.dynamicBody = body;
    // Create hash for ETag cache control
    const hash = crypto.createHash('md5').update(head + body).digest('hex');
    res.set({ ETag: hash, 'Cache-Control': 'public, no-cache' });
    const formerHash = req.headers && req.headers['if-none-match'];
    if (formerHash && formerHash === hash) {
      logger.debug('304 - Not modified');
      req.res.statusCode = 304;
      res.writeHead(304);
      res.end();
    } else {
      // Next middleware
      next();
    }
    // Cache value on next process tick
    nextTick(() => {
      if (routerResult.missed) {
        cache.setNotFound(url);
        if (!cache.get(NOT_FOUND_URL)) {
          cache.setPage(NOT_FOUND_URL, head, body, hash);
        }
      } else {
        cache.setPage(url, head, body, hash);
      }
    });
    perfStop(url);
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
