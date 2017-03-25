import { EJSON } from 'meteor/ejson';
/* eslint-disable no-undef, import/no-extraneous-dependencies, import/no-unresolved, import/extensions, max-len */
import serialize from 'serialize-javascript';
/* eslint-enable */
import { valueSet } from '../../shared/actions/utils';
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
  stepResults.store.dispatch(valueSet('buildDate', (new Date()).valueOf()));
  const serialized = EJSON.stringify(stepResults.store.getState());
  const encoded = fixedEncodeURIComponent(serialized);
  let i18n = null;
  if (stepResults.i18nOptions) {
    i18n = `window.__i18n='${serialize(stepResults.i18nOptions.client)}';`;
  }
  stepResults.contextMarkup = `
  <script>window.__PRELOADED_STATE__='${encoded}';
  ${i18n}</script>`;
};
export default createDataContext;
