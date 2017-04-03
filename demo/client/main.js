import pino from 'pino';
import { createRouter, logger, getStore } from 'meteor/ssrwpo:ssr';
import appReducers from '/imports/reducers';
import { createLogger } from 'redux-logger';
import thunk from 'redux-thunk';
import promise from 'redux-promise';
import MainApp from '/imports/app/MainApp';
import storeSubscription from '/imports/store';
import * as messages from '/imports/messages';

// Set logger
let LOG_LEVEL = 'error';
if (process.env.NODE_ENV !== 'production') {
  LOG_LEVEL = 'debug';
}
logger.set(pino({ level: LOG_LEVEL }));

// Middlewares
const appMiddlewares = [thunk, promise];
if (process.env.NODE_ENV !== 'production') {
  // Logs in development
  appMiddlewares.push(createLogger({
    actionTransformer(action) { return { ...action, type: String(action.type) }; },
  }));
}

// Internationalization
const languages = Object.keys(messages);
const localization = {
  languages,
  fallback: languages[0],
  async: Meteor.settings.public.localization.async,
  messages,
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
  window.getStore = getStore;
  logger.info('Router started');
});
