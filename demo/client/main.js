import 'react';
import createRouter, { logger } from 'meteor/ssrwpo:ssr';
import { BrowserRouter } from 'react-router';

import MainApp from '../imports/app/MainApp';

logger.info('Starting router');
createRouter(MainApp, BrowserRouter)
.then(() => logger.info('Router started'));
