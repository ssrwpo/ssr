import createRouter from 'meteor/ssrwpo:ssr';
import { ServerRouter, createServerRenderContext } from 'react-router';
import MainApp from '../imports/app/MainApp';

createRouter(MainApp, ServerRouter, createServerRenderContext);
