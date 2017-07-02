/* eslint-disable no-undef, import/no-extraneous-dependencies, import/no-unresolved, import/extensions, max-len */
import { combineReducers, createStore } from 'redux';
/* eslint-enable */
import * as packageReducers from '../../shared/reducers';
import * as optionalReducers from '../../shared/reducers/optionals';

const createAppAndPackageStore = (appReducers, platformTransformers, storeEnhancers) => {
  // Create a redux store
  const allReducers = combineReducers({
    ...appReducers,
    ...Object.assign(
      packageReducers,
      platformTransformers ? optionalReducers : null,
    ),
  });
  return createStore(allReducers, {}, storeEnhancers);
};

export default createAppAndPackageStore;
