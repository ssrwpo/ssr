import i18n from 'i18next';
import XHR from 'i18next-xhr-backend';

i18n
  .use(XHR)
  .init({
      whitelist: ['en', 'tr', 'fr'],
      fallbackLng: 'en',
      debug: false,
      // have a common namespace used around the full app
      ns: ['common', 'greetings'],
      defaultNS: 'common',

      backend: {
          loadPath: `${Meteor.absoluteUrl()}locales/{{lng}}/{{ns}}.json`,
      },
  });

export default i18n;
