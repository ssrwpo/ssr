/* eslint-disable no-undef, import/no-extraneous-dependencies, import/no-unresolved, import/extensions, max-len */
import { combineReducers, createStore } from 'redux';
/* eslint-enable */
import cache from './cache';
import * as packageReducers from '../../shared/reducers';
import createCollectionReducers from '../../shared/reducers/utils';

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
        store.dispatch({ type: `${cursorName}.ADD`, value: { _id: id, ...fields } });
        // console.log(cursorName, 'added', id, fields);
      },
      changed(id, fields) {
        cache.reset();
        // console.log(cursorName, 'changed', id, fields);
      },
      removed(id) {
        cache.reset();
        // console.log(cursorName, 'removed', id);
      },
    });
  });
  isStoreInitDone = true;
  return store;
};
export default createAppAndPackageStore;
