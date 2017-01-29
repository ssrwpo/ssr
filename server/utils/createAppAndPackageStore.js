/* eslint-disable no-undef, import/no-extraneous-dependencies, import/no-unresolved, import/extensions, max-len */
import { combineReducers, createStore } from 'redux';
/* eslint-enable */
import cache from './cache';
import * as packageReducers from '../../shared/reducers';
import { createCollectionReducers } from '../../shared/reducers/utils';
import {
  collectionAdd,
  collectionChange,
  collectionRemove,
} from '../../shared/actions/utils';

const createAppAndPackageStore = (appReducers, appCursors) => {
  let isStoreInitDone = false;
  const cursorNames = Object.keys(appCursors);
  const cursorReducers = createCollectionReducers(cursorNames);
  // Create a redux store
  const allReducers = combineReducers({ ...appReducers, ...packageReducers, ...cursorReducers });
  const store = createStore(allReducers);
  // Observe changes on cursors from the app
  cursorNames.forEach((cursorName) => {
    const cursor = appCursors[cursorName];
    cursor.observeChanges({
      added(id, fields) {
        if (isStoreInitDone) {
          cache.reset();
        }
        store.dispatch(collectionAdd(cursorName, id, fields));
        if (cursorName === 'PubSub') {
          console.log('PubSub added', id);
        }
      },
      changed(id, fields) {
        cache.reset();
        store.dispatch(collectionChange(cursorName, id, fields));
        if (cursorName === 'PubSub') {
          console.log('PubSub changed', id);
        }
      },
      removed(id) {
        cache.reset();
        store.dispatch(collectionRemove(cursorName, id));
        if (cursorName === 'PubSub') {
          console.log('PubSub removed', id);
        }
      },
    });
  });
  isStoreInitDone = true;
  return store;
};
export default createAppAndPackageStore;
