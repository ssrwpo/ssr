import { checkNpmVersions } from 'meteor/tmeasday:check-npm-versions';
import { Meteor } from 'meteor/meteor';
import { WebApp } from 'meteor/webapp';
import { EJSON } from 'meteor/ejson';
import logger from './logger';

checkNpmVersions({
  react: '15.x',
  'react-dom': '15.x',
  express: '4.x',
  helmet: '3.x',
  'react-helmet': '3.x',
}, 'ssrwpo:ssr');

/* eslint-disable import/no-unresolved, import/no-extraneous-dependencies */
const React = require('react');
const { renderToString, renderToStaticMarkup } = require('react-dom/server');
const express = require('express');
const helmet = require('helmet');
const { rewind } = require('react-helmet');
/* eslint-enable */

/* eslint-disable no-param-reassign, react/no-danger */
const createRouter = (MainApp, ServerRouter, createServerRenderContext) =>
  new Promise((resolve) => {
    // Create an Express server
    const app = express();
    // Secure Express
    app.use(helmet());
    // Avoid parsing "/api" URLs
    app.get(/^(?!\/api)/, (req, res, next) => {
      logger.debug('Rendering URL', req.originalUrl);
      // winston.profile('rendering');
      // Create data context
      const dataContext = { someItems: ['Hello', 'world'] };
      const serializedDataContext = EJSON.stringify(dataContext);
      // Create body
      const routerContext = createServerRenderContext();
      const bodyMarkup = renderToString(
        <ServerRouter
          location={req.originalUrl}
          context={routerContext}
        >
          <MainApp context={dataContext} />
        </ServerRouter>,
      );
      const routerResult = routerContext.getResult();
      logger.debug('routerResult', routerResult);
      req.dynamicBody = renderToStaticMarkup(
        <div
          id="react"
          dangerouslySetInnerHTML={{
            __html: bodyMarkup,
          }}
        />,
      ) + renderToStaticMarkup(
        <script
          dangerouslySetInnerHTML={{
            __html: `window.initialReactContext='${serializedDataContext}';`,
          }}
        />,
      );
      // Create head
      const head = rewind();
      req.dynamicHead = ['title', 'meta', 'link', 'script']
        .reduce((acc, key) => acc.concat(head[key].toString()), '');
      // Next middleware
      // winston.profile('rendering');
      return next();
    });
    // Add Express to Meteor's connect
    WebApp.connectHandlers.use(Meteor.bindEnvironment(app));
    resolve();
  });

// Server side exports
export default createRouter;
export { logger };
