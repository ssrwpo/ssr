/* eslint-enable */
import url from 'url';

// Impure function
/* eslint-disable no-param-reassign */
const urlAnalysis = (stepResults) => {
  if (!stepResults.hasUnwantedQueryParameters) {
    stepResults.url = url.format({
      pathname: stepResults.url,
      query: stepResults.sortedQuery,
    });
  }
};

export default urlAnalysis;
