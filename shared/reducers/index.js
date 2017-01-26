import { createValueReducer } from './utils';
import url from './url';
import redirect from './redirect';

const platform = createValueReducer('platform', 'default');
const buildDate = createValueReducer('buildDate', 0);

export {
  platform,
  buildDate,
  url,
  redirect,
};
