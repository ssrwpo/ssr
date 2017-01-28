/* eslint-disable no-param-reassign */
import cache from '../utils/cache';

const learnForeignLanguages = (stepResults) => {
  const { req, i18n } = stepResults;
  // if nothing passed about i18n just do nothing
  if (!i18n) {
    return;
  }
  // get user language from request
  const locale = req.language;
  // bundle resources from public directory
  const resources = i18n.getResourceBundle(req.language, 'common');
  // prepare client side window object
  const client = { locale, resources };
  // prepare i18n object for I18nextProvider
  const server = i18n.cloneInstance();
  // be sure language is set to user language
  server.changeLanguage(locale);
  // set cache language to check later
  cache.setLanguage(locale);
  // prepared i18n options for rest of the flow
  stepResults.i18nOptions = {
    client,
    server,
    locale,
  };
};
export default learnForeignLanguages;
