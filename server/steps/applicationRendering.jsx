import crypto from 'crypto';
/* eslint-disable no-undef, import/no-extraneous-dependencies, import/no-unresolved, import/extensions, max-len */
import React from 'react';
import { StaticRouter } from 'react-router-dom';
import { renderToString } from 'react-dom/server';
import { Provider } from 'react-intl-redux';
import { rewind } from 'react-helmet';
/* eslint-enable */
import { setMessages, changeLanguage } from '../../shared/actions';

// Impure function
/* eslint-disable no-param-reassign */
const applicationRendering = (stepResults) => {
  if (stepResults.isFromCache) {
    return;
  }
  if (stepResults.localization) {
    // init localization resources
    const usersLanguage = stepResults.req.acceptsLanguages(stepResults.localization.languages);
    if (stepResults.localization.language) {
      stepResults.store.dispatch(
        /* eslint-disable */
          changeLanguage(usersLanguage ? usersLanguage : stepResults.localization.language),
        /* eslint-enable */
      );
    } else {
      stepResults.store.dispatch(
        /* eslint-disable */
          changeLanguage(usersLanguage ? usersLanguage : stepResults.localization.fallback),
        /* eslint-enable */
      );
    }
    stepResults.store.dispatch(setMessages(stepResults.localization));
  }
  let helmetHead = null;
  let bodyMarkup = null;
  const {
    MainApp,
    contextMarkup,
    hasUnwantedQueryParameters,
    i18nOptions,
  } = stepResults;
  const routerContext = {};
  const app = (
    <Provider store={stepResults.store}>
      <StaticRouter location={stepResults.url} context={routerContext}>
        <MainApp />
      </StaticRouter>
    </Provider>
  );

  // Avoid the initial app rendering in case there's an unwanted URL query parameter
  if (!hasUnwantedQueryParameters) {
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

  if (hasUnwantedQueryParameters || routerContext.has404) {
    stepResults.statusCode = 404;
    // const platform = stepResults.store.getState().platform;
    // if (cache.has(platform, NOT_FOUND_URL)) {
    //   stepResults.is404fromCache = true;
    //   const cachedPage = cache.get(platform, NOT_FOUND_URL);
    //   stepResults.head = cachedPage.head;
    //   stepResults.body = cachedPage.body;
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
