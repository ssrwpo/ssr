import { createValueReducer } from './utils';
import url from './url';

const platform = createValueReducer('platform', 'default');
const buildDate = createValueReducer('buildDate', 0);

export {
  platform,
  buildDate,
  url,
};
