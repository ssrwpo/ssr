import { checkNpmVersions } from 'meteor/tmeasday:check-npm-versions';
import defaultLoglevel from '../shared/loglevel';

checkNpmVersions({
  logatim: '0.x',
}, 'ssrwpo:ssr');

/* eslint-disable import/no-unresolved, import/no-extraneous-dependencies */
const logatim = require('logatim');
/* eslint-enable */

let loglevel = defaultLoglevel;
const { ssr } = Meteor.settings.public;
if (ssr && ssr.loglevel) {
  loglevel = ssr.loglevel;
}

// logatim configuration
logatim.setLevel(loglevel);

export default logatim;
