// Logger
import pino from 'pino';
import { logger } from 'meteor/ssrwpo:ssr';

const logLevels = {
  default: 'USERLVL',
  60: 'FATAL',
  50: 'ERROR',
  40: 'WARN',
  30: 'INFO',
  20: 'DEBUG',
  10: 'TRACE',
};
const pretty = pino.pretty({
  formatter(trace) { return `${logLevels[trace.level]}: ${trace.msg}`; },
});
pretty.pipe(process.stdout);
logger.set(pino({ level: 'debug' }, pretty));
