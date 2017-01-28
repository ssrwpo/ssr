import { createRouter, logger, pure } from 'meteor/ssrwpo:ssr';
import { BrowserRouter } from 'react-router';
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

const appCursorNames = ['Folks', 'Places'];

logger.info('Starting router');
createRouter({
  // Your MainApp as the top component that will get rendered in <div id='react' />
  MainApp: pure(MainApp),
  // Optional: Store subscription
  storeSubscription,
  // Optional: An object containing your application reducers
  appReducers,
  // Optional: An array of your redux middleware of choice
  appMiddlewares,
  // Optional: An array of your collection names
  appCursorNames,
  // Optional: Add a redux store that watches for URL changes
  hasUrlStore: false,
  // Optional: Internalization
  i18n,
  // The router used in your client
  BrowserRouter: pure(BrowserRouter),
})
.then(() => logger.info('Router started'));
