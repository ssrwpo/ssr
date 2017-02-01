import { createRouter, logger, getStore } from 'meteor/ssrwpo:ssr';
import * as appReducers from '/imports/reducers';
import createLogger from 'redux-logger';
import thunk from 'redux-thunk';
import promise from 'redux-promise';
import MainApp from '/imports/app/MainApp';
import storeSubscription from '/imports/store';
// i18n
import i18n from '/imports/i18n/i18nClient';

const appMiddlewares = [
  thunk,
  promise,
  // Middleware for logs
  createLogger({
    actionTransformer(action) {
      return { ...action, type: String(action.type) };
    },
  }),
];

const appCursorNames = ['Folks', 'Places', 'PubSub'];

logger.info('Starting router');
createRouter({
  // Your MainApp as the top component that will get rendered in <div id='react' />
  MainApp,
  // Optional: Store subscription
  storeSubscription,
  // Optional: An object containing your application reducers
  appReducers,
  // Optional: An array of your redux middleware of choice
  appMiddlewares,
  // Optional: An array of your collection names
  appCursorNames,
  // Optional: Add a redux store that watches for URL changes
  hasUrlStore: true,
  // Optional: An i18n config for client side
  i18n,
})
.then(() => {
  // For easing debug
  window.store = getStore();
  logger.info('Router started');
});
