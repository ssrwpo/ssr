import { Meteor } from 'meteor/meteor';
import { WebApp } from 'meteor/webapp';
import React from 'react';
import { renderToString, renderToStaticMarkup } from 'react-dom/server';
import Express from 'express';
import { rewind } from 'react-helmet';
import { EJSON } from 'meteor/ejson';
import { ServerRouter, createServerRenderContext } from 'react-router';
import MainApp from '../imports/app/MainApp';

/* eslint-disable no-param-reassign, react/no-danger, no-console, new-cap */
let lastRequest = null;

const getLastRequest = () => lastRequest;
export default getLastRequest;

// Create an Express server
const app = Express();
app.use((req, res, next) => {
  lastRequest = req;
  console.log('Rendering URL', req.originalUrl);
  console.time('rendering');
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
  console.log('routerResult', routerResult);
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
  console.timeEnd('rendering');
  next();
});
// Add Express to Meteor's connect
WebApp.connectHandlers.use(Meteor.bindEnvironment(app));
