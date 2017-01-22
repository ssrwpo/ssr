import { retina } from '/imports/actions';

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
        store.dispatch(retina.set(true));
        break;
      default:
        store.dispatch(retina.set(false));
    }
  }
};

export default storeSubscription;
