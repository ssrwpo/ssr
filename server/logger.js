import { checkNpmVersions } from 'meteor/tmeasday:check-npm-versions';
import loglevel from '../shared/loglevel';

checkNpmVersions({
  winston: '2.x',
}, 'ssrwpo:ssr');

/* eslint-disable import/no-unresolved, import/no-extraneous-dependencies */
const winston = require('winston');
/* eslint-enable */

// Winston configuration
winston.level = loglevel;

export default winston;
