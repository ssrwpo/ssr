import { cache, generateKey } from '../utils/cache';
// import { NOT_FOUND_URL } from '../../shared/constants';
import logger from '../../shared/utils/logger';

// Impure function
/* eslint-disable no-param-reassign */
const cacheAnalysis = (stepResults) => {
  const platform = stepResults.userAgent;
  const userLocale = stepResults.userLocale;
  const cacheKey = generateKey({
    platform,
    url: stepResults.url,
    userLocale,
  });
  const cached = cache.get(cacheKey);

  if (!cached) {
    stepResults.isFromCache = false;
    logger.debug('cache missed: key:', cacheKey);
    return;
  }

  logger.debug('cache hit: type:', cached.type);
  stepResults.isFromCache = true;
  switch (cached.type) {
    case 200:
      stepResults.statusCode = 200;
      stepResults.hash = cached.hash;
      stepResults.html = cached.html;
      break;
    case 301:
      stepResults.statusCode = 301;
      stepResults.Location = cached.location;
      break;
    case 404:
      stepResults.statusCode = 404;
      stepResults.html = cached.html;
      break;
    default:
  }
};
export default cacheAnalysis;
