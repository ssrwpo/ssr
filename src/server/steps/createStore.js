import createAppAndPackageStore from '../utils/createAppAndPackageStore';

// Impure function
/* eslint-disable no-param-reassign */
const createStore = (stepResults, storeSubscription, appReducers, platformTransformers) => {
  // Create a redux store
  stepResults.store = createAppAndPackageStore(appReducers, platformTransformers);
  // Set store subscription
  if (storeSubscription) stepResults.store.subscribe(() => storeSubscription(stepResults.store));
};
export default createStore;
