import { valueSet } from 'meteor/ssrwpo:ssr';

let lastPlatform = null;

// @NOTE See http://redux.js.org/docs/api/Store.html#subscribelistener
const storeSubscription = (store) => {
  const platform = store.getState().platform;
  if (lastPlatform !== platform) {
    lastPlatform = platform;
    switch (platform) {
      case 'iphone':
      case 'ipad':
      case 'android':
        store.dispatch(valueSet('retina', true));
        break;
      default:
        store.dispatch(valueSet('retina', false));
    }
  }
};

export default storeSubscription;
