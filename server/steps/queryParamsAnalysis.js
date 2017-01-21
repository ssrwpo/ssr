import url from 'url';

// Impure function
/* eslint-disable no-param-reassign */
const queryParamsAnalysis = (stepResults) => {
  if (!stepResults.urlQueryParameters) {
    return;
  }
  const query = stepResults.req.query;
  if (!query) {
    return;
  }
  // Check allowed query parameters on this route
  const queryRouteAnalysis = stepResults.urlQueryParameters[stepResults.url];
  if (!queryRouteAnalysis) {
    return;
  }
  const res = queryRouteAnalysis(query);
  if (!res) {
    stepResults.hasUnwantedQueryParameters = true;
    return;
  }
  stepResults.url = url.format({ pathname: stepResults.url, query: res });
};
export default queryParamsAnalysis;
