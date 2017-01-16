import { checkNpmVersions } from 'meteor/tmeasday:check-npm-versions';
import logger from './logger';

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
  setPage(url, head, body) {
    logger.debug('Cache Page', url);
    this.receptacle.set(url, { type: 200, head, body }, { ttl: Cache.DEFAULT_TTL });
  }
  setRedirect(url, location) {
    logger.debug('Cache Redirect', url);
    this.receptacle.set(url, { type: 301, location }, { ttl: Cache.DEFAULT_TTL });
  }
  setNotFound(url) {
    logger.debug('Cache NotFound', url);
    this.receptacle.set(url, { type: 404 }, { ttl: Cache.DEFAULT_TTL });
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
