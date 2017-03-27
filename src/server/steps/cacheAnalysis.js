import cache from '../utils/cache';
// import { NOT_FOUND_URL } from '../../shared/constants';
import logger from '../../shared/utils/logger';

// Impure function
/* eslint-disable no-param-reassign */
const cacheAnalysis = (stepResults) => {
  const platform = stepResults.userAgent;
  const userLocale = stepResults.userLocale;

  if (!cache.has(platform, stepResults.url, stepResults.userLocale)) {
    stepResults.isFromCache = false;
    logger.debug('cache missed: url:', platform, stepResults.userLocale, stepResults.url);
    return;
  }

  const cached = cache.get(platform, stepResults.url, userLocale);
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
    case 404: {
      stepResults.statusCode = 404;
      stepResults.html = cached.html;
      // URL is a 404 but we need to check if a NotFound page has been
      //  rendered for this platform
      // if (cache.has(platform, NOT_FOUND_URL)) {
      //   const notFoundCached = cache.get(platform, NOT_FOUND_URL);
      //   stepResults.statusCode = 404;
      //   stepResults.head = notFoundCached.head;
      //   stepResults.body = notFoundCached.body;
      // } else {
        // No rendered page for this platform, ensure that this page will
        //  get rendered and cache
      //   stepResults.isFromCache = false;
      // }
    } break;
    default:
  }
};
export default cacheAnalysis;
