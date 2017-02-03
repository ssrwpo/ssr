import { createRouter, logger, getStore } from 'meteor/ssrwpo:ssr';
import appReducers from '/imports/reducers';
import createLogger from 'redux-logger';
import thunk from 'redux-thunk';
import promise from 'redux-promise';
import MainApp from '/imports/app/MainApp';
import storeSubscription from '/imports/store';
import { en, fr, tr } from '/imports/messages';

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

const localization = {
  languages: ['en', 'tr', 'fr'], // required
  fallback: 'en', // required
  // language: 'fr', // force default language optional
  messages: { en, fr, tr }, // language resources required
};

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
  // Optional: Localization
  localization,
})
.then(() => {
  // For easing debug
  window.store = getStore();
  logger.info('Router started');
});
