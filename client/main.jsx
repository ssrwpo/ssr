import { EJSON } from 'meteor/ejson';
import {
  React,
  render,
  Provider,
} from './peerDependencies';
import logger from './logger';

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
