import { createRouter, logger } from 'meteor/ssrwpo:ssr';
import { ServerRouter, createServerRenderContext } from 'react-router';
import MainApp from '/imports/app/MainApp';
import * as appReducers from '/imports/reducers';

logger.info('Starting router');
createRouter(
  // Your MainApp as the top component rendered and injected in the HTML payload
  MainApp, appReducers,
  // The server side router from react-router-4
  ServerRouter,
  createServerRenderContext,
);
logger.info('Router started');
