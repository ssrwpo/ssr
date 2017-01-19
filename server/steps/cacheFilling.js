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
      cache.setNotFound(stepResults.url);
    } else {
      cache.setPage(
        platform, stepResults.url,
        stepResults.head, stepResults.body, stepResults.hash,
      );
    }
  });
};
export default cacheFilling;
