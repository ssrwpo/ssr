import { checkNpmVersions } from 'meteor/tmeasday:check-npm-versions';
import { EJSON } from 'meteor/ejson';
import logger from './logger';

checkNpmVersions({
  react: '15.x',
  'react-dom': '15.x',
}, 'ssrwpo:ssr');

/* eslint-disable import/no-unresolved, import/no-extraneous-dependencies */
const React = require('react');
const { render } = require('react-dom');
/* eslint-enable */

const createRouter = (MainApp, BrowserRouter) => {
  window.onload = () => {
    // Get initial context transmitted as a script
    const context = EJSON.parse(window.initialReactContext);
    // Get the React root element
    const div = document.getElementById('react');
    // Render and start the application
    render(
      <BrowserRouter>
        <MainApp context={context} />
      </BrowserRouter>,
      div);
  };
};

// Client side exports
export default createRouter;
export { logger };
