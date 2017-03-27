/* eslint-disable no-undef, import/no-extraneous-dependencies, import/no-unresolved, import/extensions, max-len */
import Receptacle from 'receptacle';
/* eslint-enable */
import { logger } from '..';

// 1k IPs are cached
// eslint-disable-next-line no-restricted-properties
const MAX_ITEMS = Math.pow(2, 10);
// TTL is set to 30s
const DEFAULT_TTL = { ttl: 1000 * 30 };
// 3 retries per HTTP 304
const MAX_RETRY = 3;

const ipCache = new Receptacle({ max: MAX_ITEMS });

const shouldForce200 = (ip) => {
  if (ipCache.has(ip)) {
    const nbAttemps = ipCache.get(ip);
    if (nbAttemps >= MAX_RETRY) {
      logger.debug(`Forcing HTTP 200 for ip: ${ip}`);
      ipCache.delete(ip);
      return true;
    }
    ipCache.set(ip, nbAttemps + 1, DEFAULT_TTL);
    return false;
  }
  ipCache.set(ip, 1, DEFAULT_TTL);
  return false;
};
export default shouldForce200;
