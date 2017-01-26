/* eslint-enable */
import { url } from '../../shared/actions';

// Impure function
/* eslint-disable no-param-reassign */
const urlAnalysis = (stepResults) => {
  stepResults.store.dispatch(url.set(stepResults.url));
};
export default urlAnalysis;
