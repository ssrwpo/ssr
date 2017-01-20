import { EJSON } from 'meteor/ejson';
import { buildDate } from '../../shared/actions';

// Impure function
/* eslint-disable no-param-reassign */
const createDataContext = (stepResults) => {
  if (stepResults.isFromCache) {
    return;
  }
  stepResults.store.dispatch(buildDate.set((new Date()).valueOf()));
  const serialized = EJSON.stringify(stepResults.store.getState());
  stepResults.contextMarkup = `<script>window.__PRELOADED_STATE__='${serialized}';</script>`;
};
export default createDataContext;
