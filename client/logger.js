import { checkNpmVersions } from 'meteor/tmeasday:check-npm-versions';
import loglevel from '../shared/loglevel';

checkNpmVersions({
  logatim: '0.x',
}, 'ssrwpo:ssr');

/* eslint-disable import/no-unresolved, import/no-extraneous-dependencies */
const logatim = require('logatim');
/* eslint-enable */

logatim.setLevel(loglevel);

export default logatim;
