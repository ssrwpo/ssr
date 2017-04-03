import logger from '../../shared/utils/logger';
import cache from '../utils/cache';
import nextTick from '../utils/nextTick';
import { NOT_FOUND_URL } from '../../shared/constants';

const canEnableCache = (routePattern, routes, statusCode) => {
  if (routes.options && routes.options.enableCaching) {
    return true;
  }

  if (routePattern
    && routes[routePattern].options
    && routes[routePattern].options.enableCaching
  ) {
    return true;
  }

  if (statusCode === 404
    && routes[NOT_FOUND_URL]
    && routes[NOT_FOUND_URL].options
    && routes[NOT_FOUND_URL].options.enableCaching
  ) {
    return true;
  }

  return false;
};

const cacheFilling = ({
  html,
  hash,
  hasUnwantedQueryParameters,
  Location,
  routePattern,
  routes,
  statusCode,
  url,
  userAgent,
  userLocale,
}) => {
  nextTick(() => {
    // const platform = stepResults.userAgent;
    // if (stepResults.statusCode === 404) {
    //   if (!stepResults.is404fromCache) {
    //     cache.setPage(
    //       platform, NOT_FOUND_URL,
    //       stepResults.head, stepResults.body, stepResults.hash,
    //     );
    //   }
    //   // Don't cache 404 for wrong URL query parameters
    //   if (!stepResults.hasUnwantedQueryParameters) {
    //     cache.setNotFound(stepResults.url);
    //   }
    // } else if (stepResults.statusCode === 200) {
    //   cache.setPage(
    //     platform, stepResults.url,
    //     stepResults.head, stepResults.body, stepResults.hash,
    //   );
    // } else if (stepResults.statusCode === 301) {
    //   cache.setRedirect(stepResults.url, stepResults.Location);
    // }
    if (canEnableCache(routePattern, routes, statusCode)) {
      logger.debug(
        'cache fill:',
        userAgent,
        userLocale,
        statusCode,
        url,
        hasUnwantedQueryParameters,
      );
      if (statusCode === 301) {
        cache.setRedirect(url, Location);
      } else {
        cache.setPage(userAgent, userLocale, url, html, hash, statusCode);
      }
    }
  });
};
export default cacheFilling;
