import 'react';
import createRouter, { logger } from 'meteor/ssrwpo:ssr';
import { BrowserRouter } from 'react-router';
import * as appReducers from '/imports/reducers';

import MainApp from '../imports/app/MainApp';

logger.info('Starting router');
createRouter(MainApp, appReducers, BrowserRouter)
.then(() => logger.info('Router started'));
