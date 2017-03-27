import { url as urlActions } from '../../shared/actions';

const urlAnalysis = ({ store, url }) => store.dispatch(urlActions.set(url));
export default urlAnalysis;
