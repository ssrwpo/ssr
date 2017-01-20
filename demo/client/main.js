import { createRouter, logger } from 'meteor/ssrwpo:ssr';
import { BrowserRouter } from 'react-router';
import * as appReducers from '/imports/reducers';
import createLogger from 'redux-logger';
import thunk from 'redux-thunk';
import promise from 'redux-promise';
import MainApp from '../imports/app/MainApp';

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
  MainApp,
  // Optionnal: An object containing your application reducers
  appReducers,
  // Optionnal: An array of your redux middleware of choice
  appMiddlewares,
  // Optionnal: An array of your collection names
  appCursorNames,
  // The router used in your client
  BrowserRouter,
})
.then(() => logger.info('Router started'));
