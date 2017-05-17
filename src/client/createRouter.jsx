import { Meteor } from 'meteor/meteor';
import { EJSON } from 'meteor/ejson';
/* eslint-disable no-undef, import/no-extraneous-dependencies, import/no-unresolved, import/extensions, max-len */
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { I18nextProvider } from 'react-i18next';
import { combineReducers, applyMiddleware, createStore } from 'redux';
/* eslint-enable */
import * as packageReducers from '../shared/reducers';
import * as optionalReducers from '../shared/reducers/optionals';
import {
  createCollectionReducers,
} from '../shared/reducers/utils';

// Global client side store
let store = null;

const getStore = () => store;

const createRouter = ({
  MainApp,
  storeSubscription,
  appReducers = {},
  appMiddlewares = [],
  appCursorNames = [],
  i18n,
  hasPlatformTransformer = true,
}) =>
  new Promise((resolve) => {
    const cursorReducers = createCollectionReducers(appCursorNames);
    const allReducers = combineReducers({
      ...appReducers,
      ...Object.assign(packageReducers, hasPlatformTransformer ? optionalReducers : null),
      ...cursorReducers,
    });
    Meteor.startup(() => {
      // Get initial context transmitted as a script
      // eslint-disable-next-line no-underscore-dangle
      const state = window.__PRELOADED_STATE__;
      const decodedEjsonString = state ? decodeURIComponent(state) : null;
      const initialState = !decodedEjsonString ? {} : EJSON.parse(decodedEjsonString);
      // Create store
      store = createStore(
        allReducers,
        initialState,
        applyMiddleware(...appMiddlewares),
      );
      // Set store subscription
      if (storeSubscription) store.subscribe(() => storeSubscription(store));
      // Get the React root element
      let div = document.getElementById('react');
      if (Meteor.isCordova) {
        div = document.createElement('div');
        div.setAttribute('id', 'react');
        document.body.appendChild(div);
      }

      let app = (
        <Provider store={store}>
          <BrowserRouter>
            <MainApp />
          </BrowserRouter>
        </Provider>
      );
      // Init I18n
      // eslint-disable-next-line no-underscore-dangle
      const localization = window.__i18n;
      if (localization) {
        const decodedI18n = JSON.parse(localization);
        i18n.changeLanguage(decodedI18n.locale);
        decodedI18n.namespaces.forEach(ns =>
          i18n.addResourceBundle(
            decodedI18n.locale,
            ns,
            decodedI18n.resources[ns],
            true),
        );
        app = (<I18nextProvider i18n={i18n}>{app}</I18nextProvider>);
      }
      // Render and start the application
      render(app, div);
      resolve();
    });
  });

export { createRouter, getStore };
