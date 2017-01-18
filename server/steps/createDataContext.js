import { EJSON } from 'meteor/ejson';

// Impure function
/* eslint-disable no-param-reassign */
const createDataContext = (stepResults) => {
  if (stepResults.isFromCache) {
    return;
  }
  stepResults.dataContext = { someItems: ['Hello', 'world'] };
  const serialized = EJSON.stringify(stepResults.dataContext);
  stepResults.dataMarkup = `<script>window.__PRELOADED_STATE__='${serialized}';</script>`;
};
export default createDataContext;
