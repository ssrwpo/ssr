/* eslint-disable no-undef, import/no-extraneous-dependencies, import/no-unresolved, import/extensions, max-len */
import NodeCache from 'node-cache';
/* eslint-enable */
import { logger } from '..';

/** @class */
class Cache {
  /* eslint-disable no-underscore-dangle */
  /**
   * @constructor
   * @param  {Object} [options={maxItems: Cache.MAX_ITEMS, stdTTL: Cache.DEFAULT_TTL.ttl}]
   */
  constructor(options = {
    maxItems: Cache.MAX_ITEMS,
    stdTTL: Cache.DEFAULT_TTL.ttl,
  }) {
    this._maxSize = options.maxItems || Infinity;

    this.cache = new NodeCache(options);
  }
  /* eslint-enable */

  /**
   * @summary Deletes cache entry `route`
   * @locus Server
   * @instance
   * @memberof Cache
   * @method del
   * @param  {Object} route
   * @return {Number}
   */
  del(route) {
    return this.cache.del(this.generateKey(route));
  }

  /**
   * @summary
   * @locus Server
   * @instance
   * @memberof Cache
   * @method generateKey
   * @param  {Object} route
   * @param  {String} route.platform
   * @param  {String} route.url
   * @param  {String} route.userLocale
   * @return {String}
   */
  generateKey({ platform, url, userLocale }) {
    if (!platform && !userLocale) {
      return url;
    }
    return `${platform}-${userLocale}-${url}`;
  }

  /**
   * @summary Returns `value` for `route`
   * @locus Server
   * @instance
   * @memberof Cache
   * @method get
   * @param  {Object} route
   * @return {*}
   */
  get(route) {
    return this.cache.get(this.generateKey(route));
  }

  /**
   * @summary Returns true if `key` is present in cache
   * @locus Server
   * @instance
   * @memberof Cache
   * @method has
   * @param  {Object} route
   * @return {Boolean}
   */
  has(route) {
    return !!this.get(route);
  }

  /**
   * @summary Deletes keys that match with regex
   * @locus Server
   * @instance
   * @memberof Cache
   * @method rdel
   * @param  {RegExp} regex
   * @return {Number}
   */
  rdel(regex) {
    const keys = this.cache.keys();
    let hit = 0;

    keys.forEach((key) => {
      if (key.match(regex)) {
        logger.debug('cache del: ', key);
        hit += this.del({ url: key });
      }
    });
    return hit;
  }

  /**
   * @summary Reset cache
   * @locus Server
   * @instance
   * @memberof Cache
   * @method reset
   */
  reset() {
    logger.debug('cache reset');
    this.cache.flushAll();
  }

  /* eslint-disable no-underscore-dangle */
  /**
   * @summary Set `value` for `key`
   * @locus Server
   * @instance
   * @memberof Cache
   * @method set
   * @param  {Object} route
   * @param  {Any} value
   * @param  {Number} ttl
   */
  set(route, value, ttl) {
    if (this.cache.getStats().keys < this._maxSize) {
      this.cache.set(this.generateKey(route), value, ttl);
    }
  }
  /* eslint-enable */

  /**
   * @summary Set value for 404 `key`
   * @locus Server
   * @instance
   * @memberof Cache
   * @method setNotFound
   * @param  {Object} route
   */
  setNotFound(route) {
    logger.debug('cache notfound:', route.url);
    this.set(route, { type: 404 }, Cache.DEFAULT_TTL);
  }

  /**
   * @summary Set `value` from page `key`
   * @locus Server
   * @instance
   * @memberof Cache
   * @method setPage
   * @param  {Object} route
   * @param  {String} html
   * @param  {Object} hash
   * @param  {Number} [type=200]
   */
  setPage(route, html, hash, type = 200) {
    logger.debug('cache page:', this.generateKey(route));
    this.set(route, { type, html, hash }, Cache.DEFAULT_TTL);
  }

  /**
   * @summary Set location for redirect `key`
   * @locus Server
   * @instance
   * @memberof Cache
   * @method setRedirect
   * @param  {Object} route
   * @param  {String} location
   */
  setRedirect(route, location) {
    logger.debug('cache redirect:', route.url);
    this.set(route, { type: 301, location }, Cache.DEFAULT_TTL);
  }
}

// 1k pages are cached
// eslint-disable-next-line no-restricted-properties
Cache.MAX_ITEMS = Math.pow(2, 10);
// TTL set to 1day
Cache.DEFAULT_TTL = { ttl: 1000 * 60 * 60 * 24 };
const cache = new Cache();
export function resetSSRCache(key) {
  if (key && key instanceof RegExp) {
    cache.rdel(key);
  } else if (key) {
    cache.del(key);
  } else {
    cache.reset();
  }
}
export default cache;
