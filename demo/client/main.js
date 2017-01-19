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
      return Object.assign({}, ...action, { type: String(action.type) });
    },
  }),
];

const appCursorNames = ['Folks', 'Places'];

logger.info('Starting router');
createRouter(
  // Your MainApp as the top component that will get rendered in <div id='react' />
  MainApp,
  // An object containing your application reducers
  appReducers,
  // Your redux middleware of choice
  appMiddlewares,
  // Your collection names
  appCursorNames,
  // The router used in your client
  BrowserRouter,
)
.then(() => logger.info('Router started'));
