import crypto from 'crypto';
/* eslint-disable no-undef, import/no-extraneous-dependencies, import/no-unresolved, import/extensions, max-len */
import React from 'react';
import { StaticRouter } from 'react-router-dom';
import { renderToString } from 'react-dom/server';
import { Provider } from 'react-redux';
import { rewind } from 'react-helmet';
/* eslint-enable */
import cache from '../utils/cache';
import { NOT_FOUND_URL } from '../../shared/constants';

// Impure function
/* eslint-disable no-param-reassign */
const applicationRendering = (stepResults) => {
  if (stepResults.isFromCache) {
    return;
  }
  let helmetHead = null;
  let bodyMarkup = null;
  const { MainApp } = stepResults;
  const routerContext = {};
  const app = (
    <Provider store={stepResults.store}>
      <StaticRouter location={stepResults.url} context={routerContext}>
        <MainApp />
      </StaticRouter>
    </Provider>
  );
  // Avoid the initial app rendering in case there's an unwanted URL query parameter
  if (!stepResults.hasUnwantedQueryParameters) {
    // Create and render application main entry point
    bodyMarkup = renderToString(app);
    helmetHead = rewind();
  }
  // Redirect case
  if (routerContext.location && routerContext.location.pathname) {
    stepResults.statusCode = 301;
    stepResults.Location = routerContext.location.pathname;
    return;
  }
  // Not found, check if re-render for <Miss> component
  if (stepResults.hasUnwantedQueryParameters || routerContext.has404) {
    stepResults.statusCode = 404;
    // Check if a former not found page has been cached
    const platform = stepResults.store.getState().platform;
    if (cache.has(platform, NOT_FOUND_URL)) {
      stepResults.is404fromCache = true;
      const cachedPage = cache.get(platform, NOT_FOUND_URL);
      stepResults.head = cachedPage.head;
      stepResults.body = cachedPage.body;
    }
  }
  if (stepResults.body === null) {
    // Create body
    stepResults.body = `<div id="react">${bodyMarkup}</div>${stepResults.contextMarkup}`;
  }
  if (stepResults.head === null) {
    // Create head
    stepResults.head = ['title', 'meta', 'link', 'script']
      .reduce((acc, key) => `${acc}${helmetHead[key].toString()}`, '');
  }
  if (stepResults.statusCode === 200 && stepResults.hash === null) {
    stepResults.hash = crypto.createHash('md5')
      .update(stepResults.head + stepResults.body)
      .digest('hex');
  }
};
export default applicationRendering;
