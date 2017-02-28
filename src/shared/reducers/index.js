import { createValueReducer } from './utils';
import url from './url';
import { intl } from './intl';

const platform = createValueReducer('platform', 'default');
const buildDate = createValueReducer('buildDate', 0);
const userLocale = createValueReducer('userLocale', 'en');
const isIntlInitialised = createValueReducer('isIntlInitialised', false);
const user = createValueReducer('user', false);

export {
  platform,
  buildDate,
  url,
  intl,
  userLocale,
  isIntlInitialised,
  user,
};
