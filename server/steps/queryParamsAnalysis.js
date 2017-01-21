const queryParamsAnalysis = (stepResults) => {
  if (!stepResults.urlQueryParameters) {
    return;
  }
  const query = stepResults.req.query;
  if (!query) {
    return;
  }
  // Check for filtered query
  // Check if other query parameters are accepeted on this route
  if (!stepResults.urlQueryParameters[stepResults.url]) {

  }
  console.log('query', query);
};
export default queryParamsAnalysis;
