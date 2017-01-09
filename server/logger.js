import { Meteor } from 'meteor/meteor';
import { checkNpmVersions } from 'meteor/tmeasday:check-npm-versions';
import defaultLoglevel from '../shared/loglevel';

checkNpmVersions({
  winston: '2.x',
}, 'ssrwpo:ssr');

/* eslint-disable import/no-unresolved, import/no-extraneous-dependencies */
const winston = require('winston');
/* eslint-enable */

let loglevel = defaultLoglevel;
const { ssr } = Meteor.settings.public;
if (ssr && ssr.loglevel) {
  loglevel = ssr.loglevel;
}

// Winston configuration
winston.level = loglevel;
export default winston;

const getLoglevel = () => loglevel;
export { getLoglevel };
