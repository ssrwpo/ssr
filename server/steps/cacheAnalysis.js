import cache from '../utils/cache';
import { NOT_FOUND_URL } from '../../shared/constants';
import logger from '../utils/logger';

// Impure function
/* eslint-disable no-param-reassign */
const cacheAnalysis = (stepResults) => {
  if (!cache.has(stepResults.platform, stepResults.url)) {
    return;
  }
  const cached = cache.get(stepResults.platform, stepResults.url);
  logger.debug('Cache hit: type:', cached.type);
  stepResults.isFromCache = true;
  switch (cached.type) {
    case 200:
      stepResults.statusCode = 200;
      stepResults.hash = cached.hash;
      stepResults.head = cached.head;
      stepResults.body = cached.body;
      break;
    case 301:
      stepResults.statusCode = 301;
      stepResults.Location = cached.location;
      break;
    case 404: {
      // URL is a 404 but we need to check if a NotFound page has been
      //  rendered for this platform
      if (cache.has(stepResults.platform, NOT_FOUND_URL)) {
        const notFoundCached = cache.get(stepResults.platform, NOT_FOUND_URL);
        stepResults.statusCode = 404;
        stepResults.head = notFoundCached.head;
        stepResults.body = notFoundCached.body;
      } else {
        // No rendered page for this platform, ensure that this page will
        //  get rendered and cache
        stepResults.isFromCache = false;
      }
    } break;
    default:
  }
};
export default cacheAnalysis;
