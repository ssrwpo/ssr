import cache from '../utils/cache';
import nextTick from '../utils/nextTick';
import { NOT_FOUND_URL } from '../../shared/constants';

const cacheFilling = (stepResults) => {
  if (stepResults.isFromCache) {
    return;
  }
  nextTick(() => {
    const platform = stepResults.store.getState().platform;
    if (stepResults.statusCode === 404) {
      if (!stepResults.is404fromCache) {
        cache.setPage(
          platform, NOT_FOUND_URL,
          stepResults.head, stepResults.body, stepResults.hash,
        );
      }
      // Don't cache 404 for URL query parameters
      if (stepResults.hasUnwantedQueryParameters) {
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
