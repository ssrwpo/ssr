import { Meteor } from 'meteor/meteor';
import { EJSON } from 'meteor/ejson';
/* eslint-disable no-undef, import/no-extraneous-dependencies, import/no-unresolved, import/extensions, max-len */
import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { combineReducers, applyMiddleware, createStore } from 'redux';
/* eslint-enable */
import logger from './utils/logger';
import * as packageReducers from '../shared/reducers';
import createCollectionReducers from '../shared/reducers/utils';
import pure from '../shared/hoc/pure';

let store = null;

const getStore = () => store;

const createRouter = ({
  MainApp,
  storeSubscription,
  appReducers = {},
  appMiddlewares = [],
  appCursorNames = [],
  BrowserRouter,
}) =>
  new Promise((resolve) => {
    const cursorReducers = createCollectionReducers(appCursorNames);
    const allReducers = combineReducers({ ...appReducers, ...packageReducers, ...cursorReducers });
    Meteor.startup(() => {
      // Get initial context transmitted as a script
      // eslint-disable-next-line no-underscore-dangle
      const decodedEjsonString = decodeURIComponent(window.__PRELOADED_STATE__);
      const initialState = !decodedEjsonString ? {} : EJSON.parse(decodedEjsonString);
      // Create store
      store = createStore(
        allReducers,
        initialState,
        applyMiddleware(...appMiddlewares),
      );
      // Set store subscription
      if (storeSubscription) {
        store.subscribe(() => storeSubscription(store));
      }
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
export { createRouter, logger, getStore, pure };
