import crypto from 'crypto';
import {
  React,
  renderToString,
  renderToStaticMarkup,
  rewind,
  Provider,
} from '../utils/peerDependencies';
import cache from '../utils/cache';
import { NOT_FOUND_URL } from '../../shared/constants';

// Impure function
/* eslint-disable no-param-reassign */
const applicationRendering = (stepResults) => {
  if (stepResults.isFromCache) {
    return;
  }
  const { MainApp, ServerRouter, createServerRenderContext } = stepResults;
  let helmetHead = null;
  // Create and render application main entry point
  const routerContext = createServerRenderContext();
  let bodyMarkup = renderToString(
    <Provider store={stepResults.store}>
      <ServerRouter location={stepResults.url} context={routerContext}>
        <MainApp context={stepResults.dataContext} />
      </ServerRouter>
    </Provider>,
  );
  helmetHead = rewind();
  // Get router results
  const routerResult = routerContext.getResult();
  // Redirect case
  if (routerResult.redirect) {
    stepResults.statusCode = 301;
    stepResults.Location = routerResult.redirect.pathname;
  // Not found, re-render for <Miss> component
  } else if (routerResult.missed) {
    stepResults.statusCode = 404;
    // Check if a former not found page has been cached
    if (cache.has(NOT_FOUND_URL)) {
      stepResults.is404fromCache = true;
      const cachedPage = cache.get(NOT_FOUND_URL);
      stepResults.head = cachedPage.head;
      stepResults.body = cachedPage.body;
    } else {
      // @NOTE There's an odd behavior while rerendering the app as depicted
      // in react-router docs. The client side does not compute the ID
      // properly leading to inconsistencies during the application re-hydratation.
      bodyMarkup = renderToStaticMarkup(
        <Provider store={stepResults.store}>
          <ServerRouter location={stepResults.url} context={routerContext}>
            <MainApp context={stepResults.dataContext} />
          </ServerRouter>
        </Provider>,
      );
      helmetHead = rewind();
    }
  }
  if (stepResults.body === null) {
    // Create body
    stepResults.body = `<div id="react">${bodyMarkup}</div>${stepResults.dataMarkup}`;
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
