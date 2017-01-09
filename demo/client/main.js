import 'react';
import createRouter from 'meteor/ssrwpo:ssr';
import { BrowserRouter } from 'react-router';

import MainApp from '../imports/app/MainApp';

createRouter(MainApp, BrowserRouter);
