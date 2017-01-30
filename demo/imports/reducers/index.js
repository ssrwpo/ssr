import { createValueReducer } from 'meteor/ssrwpo:ssr';

const auth = createValueReducer('auth', false);
const retina = createValueReducer('retina', false);
const perfItems = createValueReducer('perfItems', 2000);
const isPubSubSubscribed = createValueReducer('isPubSubSubscribed', false);

export {
  auth,
  retina,
  perfItems,
  isPubSubSubscribed,
};
