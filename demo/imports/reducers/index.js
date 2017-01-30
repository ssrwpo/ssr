import { createValueReducer } from 'meteor/ssrwpo:ssr';

const auth = createValueReducer('auth', false);
const perfItems = createValueReducer('perfItems', 2000);
const isPubSubSubscribed = createValueReducer('isPubSubSubscribed', false);

export {
  auth,
  perfItems,
  isPubSubSubscribed,
};
