import { Meteor } from 'meteor/meteor';
import { winston } from './peerDependencies';
import { LOG_LEVEL } from '../../shared/constants';

let loglevel = LOG_LEVEL;
const { ssr } = Meteor.settings.public;
if (ssr && ssr.loglevel) {
  loglevel = ssr.loglevel;
}

// Winston configuration
winston.level = loglevel;
export default winston;

const getLoglevel = () => loglevel;
export { getLoglevel };
