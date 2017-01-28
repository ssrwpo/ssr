import { url as urlActions } from '../../shared/actions';
import { valueSet } from '../../shared/actions/utils';

const initStoreValues = (stepResults) => {
  stepResults.store.dispatch(valueSet('platform', stepResults.userAgent));
  stepResults.store.dispatch(urlActions.set(stepResults.url));
};

export default initStoreValues;
