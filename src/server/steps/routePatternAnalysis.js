/* eslint-disable import/first, no-undef, import/no-extraneous-dependencies, import/no-unresolved, import/extensions, max-len */
import UrlPattern from 'url-pattern';
/* eslint-enable */

// Impure function
/* eslint-disable no-param-reassign */
const routePatternAnalysis = (stepResults, routePatterns) => {
  stepResults.routePattern = routePatterns.find((routePattern) => {
    const pattern = new UrlPattern(routePattern);
    let reqParams = null;

    reqParams = pattern.match(stepResults.req.path);
    if (reqParams) {
      Object.assign(stepResults.req.params, reqParams);
      return true;
    }
    return false;
  });
};

export default routePatternAnalysis;
