/* eslint-disable no-undef, import/no-extraneous-dependencies, import/no-unresolved, import/extensions, max-len */
import NodeCache from 'node-cache';
/* eslint-enable */
import { logger } from '..';

/** @class */
export default class Cache {
  /**
   * @constructor
   * @param {Object} [options={}]
   * @param {Number} [options.checkperiod=600]
   * @param {Boolean} [options.enableLogs=true]
   * @param {Boolean} [options.errorOnMissing=false]
   * @param {Number} [options.maxItems=Cache.MAX_ITEMS]
   * @param {Number} [options.stdTTL=Cache.DEFAULT_TTL]
   * @param {Boolean} [options.useClones=true]
   */
  constructor(options = {}) {
    this.cache = new NodeCache({
      stdTTL: Cache.DEFAULT_TTL,
      ...options,
    });
    this.enableLogs = !(options.enableLogs === false);
    this.maxItems = options.maxItems || Cache.MAX_ITEMS;

    // node-cache API
    this.close = this.cache.close;
    this.del = this.cache.del;
    this.flushAll = this.cache.flushAll;
    this.get = this.cache.get;
    this.getStats = this.cache.getStats;
    this.getTtl = this.cache.getTtl;
    this.keys = this.cache.keys;
    this.mget = this.cache.mget;
    this.on = this.cache.on;
    this.reset = this.cache.flushAll;
    this.ttl = this.cache.ttl;

    // Events
    if (this.enableLogs) {
      this.cache.on('del', (key) => {
        logger.debug('cache del: ', key);
      });

      this.cache.on('flush', () => {
        logger.debug('cache reset');
      });
    }
  }

  /**
   * @summary Deletes keys that match with regex
   * @locus Server
   * @instance
   * @memberof Cache
   * @method rdel
   * @param  {RegExp} regexp
   * @return {Number}
   */
  rdel(regexp) {
    const keys = this.cache.keys();
    let hit = 0;

    keys.forEach((key) => {
      if (key.match(regexp)) {
        hit += this.del(key);
      }
    });
    return hit;
  }

  /**
   * @summary Set `value` for `key`
   * @locus Server
   * @instance
   * @memberof Cache
   * @method set
   * @param  {String} key
   * @param  {Object} value
   * @param  {Number} ttl
   */
  set(key, value, ttl) {
    if (this.getStats().keys < this.maxItems) {
      this.cache.set(key, value, ttl);
    }
  }

  /**
   * @summary Set value for 404 `key`
   * @locus Server
   * @instance
   * @memberof Cache
   * @method setNotFound
   * @param  {String} key
   */
  setNotFound(key) {
    logger.debug('cache notfound:', key);
    this.set(key, { type: 404 }, Cache.DEFAULT_TTL);
  }

  /**
   * @summary Set `value` from page `key`
   * @locus Server
   * @instance
   * @memberof Cache
   * @method setPage
   * @param  {String} key
   * @param  {String} html
   * @param  {String} hash
   * @param  {Number} [type=200]
   */
  setPage(key, html, hash, type = 200) {
    logger.debug('cache page:', key);
    this.set(key, { type, html, hash }, Cache.DEFAULT_TTL);
  }

  /**
   * @summary Set location for redirect `key`
   * @locus Server
   * @instance
   * @memberof Cache
   * @method setRedirect
   * @param  {String} key
   * @param  {String} location
   */
  setRedirect(key, location) {
    logger.debug('cache redirect:', key);
    this.set(key, { type: 301, location }, Cache.DEFAULT_TTL);
  }
}

// TTL set to 1day
Cache.DEFAULT_TTL = 1000 * 60 * 60 * 24;

// 1k pages are cached
// eslint-disable-next-line no-restricted-properties
Cache.MAX_ITEMS = Math.pow(2, 10);

export const cache = new Cache();

export function generateKey({ platform, url, userLocale }) {
  if (!platform && !userLocale) {
    return url;
  }
  return `${platform}-${userLocale}-${url}`;
}

export function resetSSRCache(key) {
  if (key && key instanceof RegExp) {
    cache.rdel(key);
  } else if (key) {
    cache.del(key);
  } else {
    cache.reset();
  }
}
