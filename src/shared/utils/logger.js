/* eslint-disable no-undef, import/no-extraneous-dependencies, import/no-unresolved, import/extensions, max-len */
import pino from 'pino';
/* eslint-enable */

const logger = pino({ level: 'debug', extreme: true });

export default logger;
