import url from './url';
import redirect from './redirect';
import { createValueReducer } from './utils';

const platform = createValueReducer('platform', 'default');
const buildDate = createValueReducer('buildDate', 0);

export {
  platform,
  buildDate,
  url,
  redirect,
};
