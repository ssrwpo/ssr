import cache from '../utils/cache';
import { NOT_FOUND_URL } from '../constants';
import logger from '../utils/logger';

// Impure function
/* eslint-disable no-param-reassign */
const cacheAnalysis = (stepResults) => {
  if (!cache.has(stepResults.url)) {
    return;
  }
  const cached = cache.get(stepResults.url);
  logger.debug('Cache hit: type:', cached.type);
  stepResults.statusCode = cached.type;
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
      stepResults.statusCode = 404;
      const notFoundCached = cache.get(NOT_FOUND_URL);
      stepResults.head = notFoundCached.head;
      stepResults.body = notFoundCached.body;
    } break;
    default:
  }
};
export default cacheAnalysis;
