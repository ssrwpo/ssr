import { checkNpmVersions } from 'meteor/tmeasday:check-npm-versions';
import { EJSON } from 'meteor/ejson';
import logger from './logger';

checkNpmVersions({
  react: '15.x',
  'react-dom': '15.x',
  'react-redux': '5.x',
}, 'ssrwpo:ssr');

/* eslint-disable import/no-unresolved, import/no-extraneous-dependencies */
const React = require('react');
const { render } = require('react-dom');
const { Provider } = require('react-redux');
/* eslint-enable */

const createRouter = (MainApp, store, BrowserRouter) =>
  new Promise((resolve) => {
    window.onload = () => {
      // Get initial context transmitted as a script
      // eslint-disable-next-line no-underscore-dangle
      const context = EJSON.parse(window.__PRELOADED_STATE__);
      // Get the React root element
      const div = document.getElementById('react');
      // Render and start the application
      render(
        <Provider store={store}>
          <BrowserRouter>
            <MainApp context={context} />
          </BrowserRouter>
        </Provider>,
        div,
      );
      resolve();
    };
  });

// Client side exports
export default createRouter;
export { logger };
