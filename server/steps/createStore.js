import createAppAndPackageStore from '../utils/createAppAndPackageStore';

// Impure function
/* eslint-disable no-param-reassign */
const createStore = (
  stepResults,
  storeSubscription,
  appReducers,
  appCursors,
) => {
  // Create a redux store
  stepResults.store = createAppAndPackageStore(appReducers, appCursors);
    // Set store subscription
  if (storeSubscription) {
    stepResults.store.subscribe(() => storeSubscription(stepResults.store));
  }
};

export default createStore;
