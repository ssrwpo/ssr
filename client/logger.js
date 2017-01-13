import { logatim } from './peerDependencies';
import defaultLoglevel from '../shared/loglevel';

let loglevel = defaultLoglevel;
const { ssr } = Meteor.settings.public;
if (ssr && ssr.loglevel) {
  loglevel = ssr.loglevel;
}

// logatim configuration
logatim.setLevel(loglevel);
export default logatim;

const getLoglevel = () => loglevel;
export { getLoglevel };
