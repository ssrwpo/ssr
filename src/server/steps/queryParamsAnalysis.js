import url from 'url';

// Impure function
/* eslint-disable no-param-reassign */
const queryParamsAnalysis = (stepResults) => {
  if (!stepResults.urlQueryParameters) {
    return;
  }
  const query = stepResults.req.query;
  if (!query || Object.keys(query).length === 0) {
    return;
  }
  // Check allowed query parameters on this route
  const queryRouteAnalysis = stepResults.urlQueryParameters[stepResults.url];
  if (!queryRouteAnalysis) {
    return;
  }
  const res = queryRouteAnalysis(query, stepResults.store);
  if (!res) {
    stepResults.hasUnwantedQueryParameters = true;
    return;
  }
  const sortedQuery = Object.keys(res).sort().reduce((acc, key) =>
    ({ ...acc, [key]: res[key] })
  , {});
  stepResults.url = url.format({ pathname: stepResults.url, query: sortedQuery });
};
export default queryParamsAnalysis;
