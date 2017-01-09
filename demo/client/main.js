import 'react';
import createRouter, { logger } from 'meteor/ssrwpo:ssr';
import { BrowserRouter } from 'react-router';

import MainApp from '../imports/app/MainApp';

logger.info('Router started');
createRouter(MainApp, BrowserRouter);
