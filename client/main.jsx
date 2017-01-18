import { Meteor } from 'meteor/meteor';
import { EJSON } from 'meteor/ejson';
/* eslint-disable no-undef, import/no-extraneous-dependencies, import/no-unresolved, import/extensions, max-len */
import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { combineReducers, createStore } from 'redux';
/* eslint-enable */
import logger from './utils/logger';
import * as packageReducers from '../shared/reducers';

let store = null;

const getStore = () => store;

const createRouter = (MainApp, appReducers, BrowserRouter) =>
  new Promise((resolve) => {
    const allReducers = combineReducers(Object.assign(appReducers, packageReducers));
    Meteor.startup(() => {
      // Get initial context transmitted as a script
      // eslint-disable-next-line no-underscore-dangle
      const initialState = EJSON.parse(window.__PRELOADED_STATE__);
      // Create store
      store = createStore(allReducers, initialState);
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
    });
  });

// Client side exports
export { createRouter, logger, getStore };
