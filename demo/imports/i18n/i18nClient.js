import i18n from 'i18next';

i18n
  .init({
    whitelist: ['en', 'tr', 'fr'],
    fallbackLng: 'en',
    debug: false,
    // have a common namespace used around the full app
    ns: ['common', 'greetings'],
    defaultNS: 'common',
  });

export default i18n;
