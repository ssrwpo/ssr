import cache from '../utils/cache';
import nextTick from '../utils/nextTick';
import { NOT_FOUND_URL } from '../constants';

const cacheFilling = (stepResults) => {
  if (stepResults.isFromCache) {
    return;
  }
  nextTick(() => {
    if (stepResults.statusCode === 404) {
      if (!stepResults.is404fromCache) {
        cache.setPage(NOT_FOUND_URL, stepResults.head, stepResults.body, stepResults.hash);
      }
      cache.setNotFound(stepResults.url);
    } else {
      cache.setPage(stepResults.url, stepResults.head, stepResults.body, stepResults.hash);
    }
  });
};
export default cacheFilling;
