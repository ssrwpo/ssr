import { createRouter, logger } from 'meteor/ssrwpo:ssr';
import { ServerRouter, createServerRenderContext } from 'react-router';
import MainApp from '/imports/app/MainApp';
import * as appReducers from '/imports/reducers';

logger.info('Starting router');
createRouter(MainApp, appReducers, ServerRouter, createServerRenderContext);
logger.info('Router started');
