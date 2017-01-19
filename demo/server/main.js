import { createRouter, logger } from 'meteor/ssrwpo:ssr';
import { ServerRouter, createServerRenderContext } from 'react-router';
import MainApp from '/imports/app/MainApp';
import * as appReducers from '/imports/reducers';
// Collection and fixtures
import '/imports/api/Folks/server';
import '/imports/api/Places/server';

logger.info('Starting router');
createRouter(
  // Your MainApp as the top component rendered and injected in the HTML payload
  MainApp, appReducers,
  // The server side router from react-router-4
  ServerRouter,
  createServerRenderContext,
);
logger.info('Router started');
