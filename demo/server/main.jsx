import { Meteor } from 'meteor/meteor';
import { WebApp } from 'meteor/webapp';
import React from 'react';
import { renderToString, renderToStaticMarkup } from 'react-dom/server';
import Express from 'express';
import { rewind } from 'react-helmet';
import { EJSON } from 'meteor/ejson';

import MainApp from '../imports/app/MainApp';

// Create an Express server
const app = Express();
app.use((req, res, next) => {
  console.log('Rendering URL', req.originalUrl);
  console.time('rendering');
  // Create context
  const context = { someItems: ['Hello', 'world'] };
  const serializedContext = EJSON.stringify(context);
  // Create body
  const content = renderToString(<MainApp context={context} />);
  req.dynamicBody = renderToStaticMarkup(
    <div
      id="react"
      dangerouslySetInnerHTML={{
        __html: content
      }}
    />
  ) + renderToStaticMarkup(
    <script
      dangerouslySetInnerHTML={{
        __html: `window.initialReactContext='${serializedContext}';`
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
