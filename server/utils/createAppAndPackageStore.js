/* eslint-disable no-undef, import/no-extraneous-dependencies, import/no-unresolved, import/extensions, max-len */
import { combineReducers, createStore } from 'redux';
/* eslint-enable */
import * as packageReducers from '../../shared/reducers';

const createAppAndPackageStore = (appReducers) => {
  // Create a redux store
  const allReducers = combineReducers({ ...appReducers, ...packageReducers });
  return createStore(allReducers);
};
export default createAppAndPackageStore;
