import {
  createCollectionReducers,
  createValueReducer,
} from 'meteor/ssrwpo:ssr';

const auth = createValueReducer('auth', false);
const collectionReducers = createCollectionReducers([
  'Folks',
  'Places',
  'PubSub',
]);

const perfItems = createValueReducer('perfItems', 2000);
const isPubSubSubscribed = createValueReducer('isPubSubSubscribed', false);
const isPubSubInitialised = createValueReducer('isPubSubInitialised', false);

export default {
  auth,
  ...collectionReducers,
  perfItems,
  isPubSubSubscribed,
  isPubSubInitialised,
};
