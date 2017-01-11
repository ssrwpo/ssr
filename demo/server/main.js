import createRouter, { logger } from 'meteor/ssrwpo:ssr';
import { ServerRouter, createServerRenderContext } from 'react-router';
import MainApp from '../imports/app/MainApp';

logger.info('Starting router');
createRouter(MainApp, ServerRouter, createServerRenderContext);
logger.info('Router started');
