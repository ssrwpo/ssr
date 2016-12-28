import { Meteor } from 'meteor/meteor';
import { WebApp } from 'meteor/webapp';
import React from 'react';
import { renderToString, renderToStaticMarkup } from 'react-dom/server';
import express from 'express';
import helmet from 'helmet';
import { rewind } from 'react-helmet';
import { EJSON } from 'meteor/ejson';
import { ServerRouter, createServerRenderContext } from 'react-router';
import winston from 'winston';
import MainApp from '../imports/app/MainApp';

/* eslint-disable no-param-reassign, react/no-danger */

// Debugging information for `meteor shell`
let lastRequest = null;
const getLastRequest = () => lastRequest;
export default getLastRequest;

// Winston configuration
winston.level = 'debug';

// Create an Express server
const app = express();
// Secure Express
app.use(helmet());
// Avoid parsing "/api" URLs
app.get(/^(?!\/api)/, (req, res, next) => {
  lastRequest = req;
  winston.debug('Rendering URL', req.originalUrl);
  winston.profile('rendering');
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
    </ServerRouter>
  );
  const routerResult = routerContext.getResult();
  winston.debug('routerResult', routerResult);
  req.dynamicBody = renderToStaticMarkup(
    <div
      id="react"
      dangerouslySetInnerHTML={{
        __html: bodyMarkup,
      }}
    />
  ) + renderToStaticMarkup(
    <script
      dangerouslySetInnerHTML={{
        __html: `window.initialReactContext='${serializedDataContext}';`,
      }}
    />
  );
  // Create head
  const head = rewind();
  req.dynamicHead = ['title', 'meta', 'link', 'script']
    .reduce((acc, key) => acc.concat(head[key].toString()), '');
  // Next middleware
  winston.profile('rendering');
  return next();
});
// Add Express to Meteor's connect
WebApp.connectHandlers.use(Meteor.bindEnvironment(app));
