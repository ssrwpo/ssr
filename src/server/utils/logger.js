/* eslint-disable no-undef, import/no-extraneous-dependencies, import/no-unresolved, import/extensions, max-len */
import winston from 'winston';
/* eslint-enable */
import { Meteor } from 'meteor/meteor';
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
