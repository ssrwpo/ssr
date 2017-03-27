import logger from '../../shared/utils/logger';

let start = null;

const perfStart = () => (start = (new Date()).valueOf());

const perfStop = message => logger.debug(message, 'in', (new Date()).valueOf() - start, 'ms');

export { perfStart, perfStop };
