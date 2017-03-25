import logger from '../../shared/utils/logger';
import cache from '../utils/cache';
import nextTick from '../utils/nextTick';
import { NOT_FOUND_URL } from '../../shared/constants';

const cacheFilling = (stepResults) => {
  if (stepResults.isFromCache) {
    logger.debug('cache fill: avoided');
    return;
  }
  nextTick(() => {
    const platform = stepResults.store.getState().platform;
    logger.debug(
      'cache fill:', platform, stepResults.statusCode,
      stepResults.url, stepResults.hasUnwantedQueryParameters,
    );
    if (stepResults.statusCode === 404) {
      if (!stepResults.is404fromCache) {
        cache.setPage(
          platform, NOT_FOUND_URL,
          stepResults.head, stepResults.body, stepResults.hash,
        );
      }
      // Don't cache 404 for wrong URL query parameters
      if (!stepResults.hasUnwantedQueryParameters) {
        cache.setNotFound(stepResults.url);
      }
    } else if (stepResults.statusCode === 200) {
      cache.setPage(
        platform, stepResults.url,
        stepResults.head, stepResults.body, stepResults.hash,
      );
    } else if (stepResults.statusCode === 301) {
      cache.setRedirect(stepResults.url, stepResults.Location);
    }
  });
};
export default cacheFilling;
