/* eslint-disable no-undef, import/no-extraneous-dependencies, import/no-unresolved, import/extensions, max-len */
import { combineReducers, createStore } from 'redux';
/* eslint-enable */
import * as packageReducers from '../../shared/reducers';

const createAppAndPackageStore = (appReducers, appCursors) => {
  Object.keys(appCursors).forEach(cursor => console.log(appCursors[cursor].fetch()));
  // Create a redux store
  const allReducers = combineReducers({ ...appReducers, ...packageReducers });
  const store = createStore(allReducers);
  return store;
};
export default createAppAndPackageStore;
