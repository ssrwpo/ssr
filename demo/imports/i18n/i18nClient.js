import i18n from 'i18next';

i18n
  .init({
    whitelist: ['en', 'tr', 'fr'],
    fallbackLng: 'en',

    // have a common namespace used around the full app
    ns: ['common'],
    defaultNS: 'common',
  });

export default i18n;
