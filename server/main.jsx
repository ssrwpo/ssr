import { checkNpmVersions } from 'meteor/tmeasday:check-npm-versions';
import { Meteor } from 'meteor/meteor';
import { WebApp } from 'meteor/webapp';
import logger from './logger';
import { perfStart, perfStop } from './perfMeasure';
import createDataContext from './dataContext';

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
    // Create data context
    const { dataContext, dataMarkup } = createDataContext();
    // Avoid parsing "/api" URLs
    app.get(/^(?!\/api)/, (req, res, next) => {
      perfStart();
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
      // const routerResult = routerContext.getResult();
      req.dynamicBody = renderToStaticMarkup(
        <div
          id="react"
          dangerouslySetInnerHTML={{
            __html: bodyMarkup,
          }}
        />,
      ) + dataMarkup;
      // Create head
      const head = rewind();
      req.dynamicHead = ['title', 'meta', 'link', 'script']
        .reduce((acc, key) => acc.concat(head[key].toString()), '');
      perfStop(`URL ${req.originalUrl}`);
      // Next middleware
      return next();
    });
    // Add Express to Meteor's connect
    WebApp.connectHandlers.use(Meteor.bindEnvironment(app));
    resolve();
  });

// Server side exports
export default createRouter;
export { logger };
