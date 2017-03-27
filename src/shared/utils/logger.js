const logger = { debug() {}, info() {}, warn() {}, error() {} };
const loggerFct = Object.keys(logger);
logger.set = customLogger =>
  loggerFct.forEach(key => (logger[key] = customLogger[key].bind(customLogger)));

export default logger;
