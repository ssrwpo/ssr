/* eslint-enable */
import { url as urlActions } from '../../shared/actions';

// Impure function
/* eslint-disable no-param-reassign */
const urlAnalysis = ({ store, url }) => {
  store.dispatch(urlActions.set(url));
};
export default urlAnalysis;
