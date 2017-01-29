import crypto from 'crypto';
/* eslint-disable no-undef, import/no-extraneous-dependencies, import/no-unresolved, import/extensions, max-len */
import React from 'react';
import { renderToString, renderToStaticMarkup } from 'react-dom/server';
import { Provider } from 'react-redux';
import { rewind } from 'react-helmet';
/* eslint-enable */

// Impure function
/* eslint-disable no-param-reassign */
const applicationRendering = (stepResults) => {
  let routerResult = null;
  let helmetHead = null;
  let bodyMarkup = null;

  const {
    MainApp,
    ServerRouter,
    contextMarkup,
    createServerRenderContext,
    hasUnwantedQueryParameters,
  } = stepResults;
  const routerContext = createServerRenderContext();

  // Avoid the initial app rendering in case there's an unwanted URL query parameter
  if (!hasUnwantedQueryParameters) {
    // Create and render application main entry point
    bodyMarkup = renderToString(
      <Provider store={stepResults.store}>
        <ServerRouter location={stepResults.url} context={routerContext}>
          <MainApp />
        </ServerRouter>
      </Provider>,
    );
    helmetHead = rewind();
    // Get router results
    routerResult = routerContext.getResult();
  }

  // Redirect case
  if (routerResult && routerResult.redirect) {
    stepResults.statusCode = 301;
    stepResults.Location = routerResult.redirect.pathname;
  // Not found, re-render for <Miss> component
  } else if (hasUnwantedQueryParameters
    || (routerResult && routerResult.missed)
  ) {
    stepResults.statusCode = 404;

    // const platform = stepResults.store.getState().platform;
    // if (cache.has(platform, NOT_FOUND_URL)) {
    //   stepResults.is404fromCache = true;
    //   const cachedPage = cache.get(platform, NOT_FOUND_URL);
    //   stepResults.head = cachedPage.head;
    //   stepResults.body = cachedPage.body;
    // } else {

    // @NOTE There's an odd behavior while rerendering the app as depicted
    // in react-router docs. The client side does not compute the ID
    // properly leading to inconsistencies during the application re-hydratation.
    bodyMarkup = renderToStaticMarkup(
      <Provider store={stepResults.store}>
        <ServerRouter location={stepResults.url} context={routerContext}>
          <MainApp />
        </ServerRouter>
      </Provider>,
    );
    helmetHead = rewind();
    // }
  }

  if (stepResults.body === null) {
    // Create body
    stepResults.body = `<div id="react">${bodyMarkup}</div>${contextMarkup}`;
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
