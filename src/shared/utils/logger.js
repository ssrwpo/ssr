// eslint-disable-next-line import/no-mutable-exports
let logger = { debug() {}, info() {}, warn() {}, error() {} };

const setLogger = customLogger => (logger = customLogger);

export default logger;
export {
  setLogger,
};
