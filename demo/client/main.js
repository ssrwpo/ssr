import 'react';
import createRouter, { logger } from 'meteor/ssrwpo:ssr';
import { BrowserRouter } from 'react-router';
import store from '/imports/store';

import MainApp from '../imports/app/MainApp';

logger.info('Starting router');
createRouter(MainApp, store, BrowserRouter)
.then(() => logger.info('Router started'));
