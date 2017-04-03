// Logger
import pino from 'pino';
import { logger } from 'meteor/ssrwpo:ssr';

if (process.env.NODE_ENV !== 'production') {
  logger.set(pino({ level: 'debug' }));
}
