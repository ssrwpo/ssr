import logger from '../../shared/utils/logger';
import { cache, generateKey } from '../utils/cache';
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
        cache.setRedirect({ url }, Location);
      } else {
        cache.setPage(generateKey({
          platform: userAgent,
          url,
          userLocale,
        }), html, hash, statusCode);
      }
    }
  });
};
export default cacheFilling;
