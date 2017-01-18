import { EJSON } from 'meteor/ejson';
/* eslint-disable no-undef, import/no-extraneous-dependencies, import/no-unresolved, import/extensions, max-len */
/* eslint-enable */

// Impure function
/* eslint-disable no-param-reassign */
const createDataContext = (stepResults) => {
  if (stepResults.isFromCache) {
    return;
  }
  const serialized = EJSON.stringify(stepResults.store.getState());
  stepResults.contextMarkup = `<script>window.__PRELOADED_STATE__='${serialized}';</script>`;
};
export default createDataContext;
