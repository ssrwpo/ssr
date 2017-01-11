import { checkNpmVersions } from 'meteor/tmeasday:check-npm-versions';

checkNpmVersions({
  receptacle: '1.x',
}, 'ssrwpo:ssr');

/* eslint-disable import/no-unresolved, import/no-extraneous-dependencies */
const Receptacle = require('receptacle');
/* eslint-enable */

class Cache {
  constructor() {
    this.receptacle = new Receptacle({ max: Cache.MAX_ITEMS });
  }
  set(url, head, body) {
    this.receptacle.set(url, { head, body }, { ttl: Cache.DEFAULT_TTL });
  }
  has(url) {
    return this.receptacle.has(url);
  }
  get(url) {
    return this.receptacle.get(url);
  }
}
// eslint-disable-next-line no-restricted-properties
Cache.MAX_ITEMS = Math.pow(2, 10);
Cache.DEFAULT_TTL = 60 * 60 * 24;
const cache = new Cache();
export default cache;
