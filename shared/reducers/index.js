import { createValueReducer } from './utils';

const platform = createValueReducer('platform', 'default');
const buildDate = createValueReducer('buildDate', 0);

export {
  platform,
  buildDate,
};
