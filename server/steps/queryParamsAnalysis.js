const reduceParams = res => (acc, key) => ({ ...acc, [key]: res[key] });

// Impure function
/* eslint-disable no-param-reassign */
const queryParamsAnalysis = (stepResults) => {
  const {
    req,
    routePattern,
    routes,
  } = stepResults;
  const allowedParams = {};

  const validators = [];

  const reqParams = req.params;
  const reqQuery = req.query;

  if ((!reqParams || Object.keys(reqParams).length === 0)
    && (!reqQuery || Object.keys(reqQuery).length === 0)
  ) {
    return;
  }

  let i;
  let res;

  if (routes.urlQueryParameters
    && typeof routes.urlQueryParameters !== 'function') {
    throw new Error('urlQueryParameters must be a function.');
  } else if (routes.urlQueryParameters) {
    validators.push(routes.urlQueryParameters);
  }

  if (routePattern
      && routes[routePattern]
      && routes[routePattern].urlQueryParameters
      && typeof routes[routePattern].urlQueryParameters !== 'function') {
    throw new Error(`${routePattern} urlQueryParameters must be a function.`);
  } else if (routePattern
      && routes[routePattern]
      && routes[routePattern].urlQueryParameters) {
    validators.push(routes[routePattern].urlQueryParameters);
  }

  // Check allowed query parameters on this route
  /* eslint-disable no-plusplus */
  for (i = 0; i < validators.length; i++) {
    res = validators[i](reqParams, reqQuery);
    if (!res) {
      stepResults.hasUnwantedQueryParameters = true;
      return;
    }
    Object.assign(
      allowedParams,
      Object.keys(res).sort().reduce(reduceParams(res), {}),
    );
  }

  stepResults.sortedQuery = allowedParams;
};
export default queryParamsAnalysis;
