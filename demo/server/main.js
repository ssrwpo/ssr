import createRouter, { logger } from 'meteor/ssrwpo:ssr';
import { ServerRouter, createServerRenderContext } from 'react-router';
import MainApp from '/imports/app/MainApp';
import store from '/imports/store';

logger.info('Starting router');
createRouter(MainApp, store, ServerRouter, createServerRenderContext);
logger.info('Router started');
