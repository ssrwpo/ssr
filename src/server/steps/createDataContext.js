import { WebApp } from 'meteor/webapp';
import { EJSON } from 'meteor/ejson';
import crypto from 'crypto';
import { valueSet } from '../../shared/actions/utils';
// Impure function
/* eslint-disable no-param-reassign */
const fixedEncodeURIComponent = str => (
  encodeURIComponent(str)
    .replace(/[!'()*]/g, c => `%${c.charCodeAt(0).toString(16)}`)
);

const createDataContext = (stepResults) => {
  stepResults.store.dispatch(valueSet('buildDate', (new Date()).valueOf()));
  const serialized = EJSON.stringify(stepResults.store.getState());
  const encoded = fixedEncodeURIComponent(serialized);
  stepResults.contextMarkup = `<script>window.__PRELOADED_STATE__='${encoded}';</script>`;
  if (stepResults.hash === null) {
    stepResults.hash = crypto.createHash('md5')
      .update(WebApp.clientHash() + stepResults.contextMarkup)
      .digest('hex');
  }
};

export default createDataContext;
