import { createValueReducer } from 'meteor/ssrwpo:ssr';
import auth from './auth';
import retina from './retina';
import perfItems from './perfItems';

const isPubSubSubscribed = createValueReducer('isPubSubSubscribed', false);

export {
  auth,
  retina,
  perfItems,
  isPubSubSubscribed,
};
