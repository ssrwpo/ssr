import { EJSON } from 'meteor/ejson';
import { buildDate } from '../../shared/actions';

// Impure function
/* eslint-disable no-param-reassign */
const fixedEncodeURIComponent = str => (
  encodeURIComponent(str)
    .replace(/[!'()*]/g, c => `%${c.charCodeAt(0).toString(16)}`)
);

const createDataContext = (stepResults) => {
  if (stepResults.isFromCache) {
    return;
  }
  stepResults.store.dispatch(buildDate.set((new Date()).valueOf()));
  const serialized = EJSON.stringify(stepResults.store.getState());
  const encoded = fixedEncodeURIComponent(serialized);
  stepResults.contextMarkup = `<script>window.__PRELOADED_STATE__='${encoded}';</script>`;
};
export default createDataContext;
