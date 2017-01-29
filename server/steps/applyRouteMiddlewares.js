/* eslint-disable import/first, no-undef, import/no-extraneous-dependencies, import/no-unresolved, import/extensions, max-len */
import cloneDeep from 'lodash/cloneDeep';
/* eslint-enable */

/* eslint-disable no-param-reassign */
const applyRouteMiddlewares = (stepResults) => {
  const {
    routePattern,
    routes,
    sortedQuery,
    store,
  } = stepResults;
  const allowedParams = cloneDeep(sortedQuery);

  const routeMiddlewares = [];

  let i;

  if (routes.middlewares
    && typeof routes.middlewares !== 'function') {
    throw new Error('middlewares must be a function.');
  } else if (routes.middlewares) {
    routeMiddlewares.push(routes.middlewares);
  }

  if (routePattern
      && routes[routePattern]
      && routes[routePattern].middleware
      && typeof routes[routePattern].middleware !== 'function') {
    throw new Error(`${routePattern} middleware must be a function.`);
  } else if (routePattern
      && routes[routePattern]
      && routes[routePattern].middleware) {
    routeMiddlewares.push(routes[routePattern].middleware);
  }

  // Apply all middlewares on this route
  /* eslint-disable no-plusplus */
  for (i = 0; i < routeMiddlewares.length; i++) {
    routeMiddlewares[i](allowedParams, store);
  }
};

export default applyRouteMiddlewares;
