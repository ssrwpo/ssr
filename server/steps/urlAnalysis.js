/* eslint-enable */
import * as urlActions from '../../shared/actions';

// Impure function
/* eslint-disable no-param-reassign */
const urlAnalysis = ({ url }) => {
  stepResults.store.dispatch(urlActions.set(url));
};
export default urlAnalysis;
