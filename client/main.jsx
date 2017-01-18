import { EJSON } from 'meteor/ejson';
/* eslint-disable no-undef, import/no-extraneous-dependencies, import/no-unresolved, import/extensions, max-len */
import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
/* eslint-enable */
import logger from './utils/logger';

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
            <MainApp />
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
