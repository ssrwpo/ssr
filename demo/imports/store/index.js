import { logger } from 'meteor/ssrwpo:ssr';

let lastPlatform = null;

// @NOTE See http://redux.js.org/docs/api/Store.html#subscribelistener
const storeSubscription = (store) => {
  const platform = store.getState().platform;
  if (lastPlatform !== platform) {
    lastPlatform = platform;
    logger.info('Platform set', platform);
  }
};

export default storeSubscription;
