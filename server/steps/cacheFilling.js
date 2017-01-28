import cache from '../utils/cache';
import nextTick from '../utils/nextTick';
import { NOT_FOUND_URL } from '../../shared/constants';

const canEnableCache = (routePattern, routes, statusCode) => {
  if (routes.options || routes.options.enableCahing) {
    return true;
  }

  if (routePattern
    && routes[routePattern].options
    && routes[routePattern].options.enableCahing
  ) {
    return true;
  }

  if (statusCode === 404
    && routes[NOT_FOUND_URL]
    && routes[NOT_FOUND_URL].options
    && routes[NOT_FOUND_URL].options.enableCahing
  ) {
    return true;
  }

  return false;
};

const cacheFilling = ({
  body,
  hash,
  head,
  routePattern,
  routes,
  statusCode,
  url,
  userAgent,
}) => {
  nextTick(() => {
    // const platform = stepResults.userAgent;
    // if (stepResults.statusCode === 404) {
      // if (!stepResults.is404fromCache) {
      //   cache.setPage(
      //     platform, NOT_FOUND_URL,
      //     stepResults.head, stepResults.body, stepResults.hash,
      //   );
      // }
      // // Don't cache 404 for URL query parameters
      // if (stepResults.hasUnwantedQueryParameters) {
      //   cache.setNotFound(stepResults.url);
      // }
    // } else {
    if (canEnableCache(routePattern, routes, statusCode)) {
      cache.setPage(userAgent, url, head, body, hash);
    }
    // }
  });
};
export default cacheFilling;
