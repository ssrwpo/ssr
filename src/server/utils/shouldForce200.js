/* eslint-disable no-undef, import/no-extraneous-dependencies, import/no-unresolved, import/extensions, max-len */
import Cache from './cache';
/* eslint-enable */
import { logger } from '..';

// 1k IPs are cached
// eslint-disable-next-line no-restricted-properties
const MAX_ITEMS = Math.pow(2, 10);
// TTL is set to 30s
const DEFAULT_TTL = { ttl: 1000 * 30 };
// 3 retries per HTTP 304
const MAX_RETRY = 3;

const ipCache = new Cache({
  enableLogs: false,
  maxItems: MAX_ITEMS,
});

const shouldForce200 = (ip) => {
  const nbAttemps = ipCache.get(ip);

  if (nbAttemps && nbAttemps.value >= MAX_RETRY) {
    logger.debug(`Forcing HTTP 200 for ip: ${ip}`);
    ipCache.del(ip);
    return true;
  } else if (nbAttemps) {
    ipCache.set(ip, { value: nbAttemps.value + 1 }, DEFAULT_TTL);
  } else {
    ipCache.set(ip, { value: 1 }, DEFAULT_TTL);
  }

  return false;
};

export default shouldForce200;
