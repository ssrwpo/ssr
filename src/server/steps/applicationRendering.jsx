import { WebApp, WebAppInternals } from 'meteor/webapp';
/* eslint-disable no-undef, import/no-extraneous-dependencies, import/no-unresolved, import/extensions, max-len */
import htmlMinifier from 'html-minifier';
import React from 'react';
import { StaticRouter } from 'react-router-dom';
import { renderToString } from 'react-dom/server';
import { Provider } from 'react-redux';
import { I18nextProvider } from 'react-i18next';
import Helmet from 'react-helmet';
/* eslint-enable */
import cache from '../utils/cache';
import { NOT_FOUND_URL } from '../../shared/constants';

// Impure function
/* eslint-disable no-param-reassign */
const applicationRendering = (stepResults) => {
  if (stepResults.isFromCache) return;
  let helmetHead = null;
  let bodyMarkup = null;
  const { MainApp, i18nOptions } = stepResults;
  const routerContext = {};
  let app = (
    <Provider store={stepResults.store}>
      <StaticRouter location={stepResults.url} context={routerContext}>
        <MainApp />
      </StaticRouter>
    </Provider>
  );
  if (i18nOptions) app = <I18nextProvider i18n={i18nOptions.server}>{app}</I18nextProvider>;
  // Avoid the initial app rendering in case there's an unwanted URL query parameter
  if (!stepResults.hasUnwantedQueryParameters) {
    // Create and render application main entry point
    bodyMarkup = renderToString(app);
    helmetHead = Helmet.renderStatic();
  }
  // Redirect case
  if (routerContext.location && routerContext.location.pathname) {
    stepResults.statusCode = 301;
    stepResults.Location = routerContext.location.pathname;
    return;
  }
  // Not found
  if (stepResults.hasUnwantedQueryParameters || routerContext.has404) {
    stepResults.statusCode = 404;
    // Check if a former not found page has been cached
    const platform = stepResults.store.getState().platform;
    if (cache.has(platform, NOT_FOUND_URL)) {
      stepResults.is404fromCache = true;
      const cachedPage = cache.get(platform, NOT_FOUND_URL);
      stepResults.html = cachedPage.html;
    }
  }
  if (stepResults.html === null) {
    // Create body
    stepResults.req.dynamicBody = `<div id="react">${bodyMarkup}</div>${stepResults.contextMarkup}`;
    // Create head
    stepResults.req.dynamicHead = ['title', 'meta', 'link', 'script']
      .reduce((acc, key) => `${acc}${helmetHead[key].toString()}`, '');

    // Add html attributes
    stepResults.req.htmlAttributes = helmetHead.htmlAttributes;
    WebApp.addHtmlAttributeHook(request => request.htmlAttributes.toComponent());

    // Add humans.txt link, if required
    if (stepResults.humansTxt) stepResults.req.dynamicHead += '<link rel="author" href="humans.txt" />';
    // Create minified HTML payload
    const meteorHtml = WebAppInternals.getBoilerplate(stepResults.req, WebApp.defaultArch);
    stepResults.html = htmlMinifier.minify(meteorHtml, {
      removeScriptTypeAttributes: true,
      removeStyleLinkTypeAttributes: true,
      collapseWhitespace: true,
    });
    // Load Meteor's bundle asynchroneously only in production
    if (process.env.NODE_ENV === 'production') {
      stepResults.html = stepResults.html.replace(/<script src/g, '<script async src');
    }
  }
};
export default applicationRendering;
