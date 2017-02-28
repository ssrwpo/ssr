/* eslint-disable no-undef, import/no-extraneous-dependencies, import/no-unresolved, import/extensions, max-len */
import logatim from 'logatim';
/* eslint-enable */
import { LOG_LEVEL } from '../../shared/constants';

let loglevel = LOG_LEVEL;
const { ssr } = Meteor.settings.public;
if (ssr && ssr.loglevel) {
  loglevel = ssr.loglevel;
}

// logatim configuration
logatim.setLevel(loglevel);
export default logatim;

const getLoglevel = () => loglevel;
export { getLoglevel };
