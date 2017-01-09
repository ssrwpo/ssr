import logger, { getLoglevel } from './logger';

let start = null;
const perfRequired = getLoglevel() === 'debug';

const perfStart = () => {
  if (perfRequired) {
    start = (new Date()).valueOf();
  }
};

const perfStop = (message) => {
  if (perfRequired) {
    logger.debug(message, 'in', (new Date()).valueOf() - start, 'ms');
  }
};

export { perfStart, perfStop };
