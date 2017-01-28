import i18n from 'i18next';
import Backend from 'i18next-node-remote-backend';
import { LanguageDetector } from 'i18next-express-middleware';
import { Meteor } from 'meteor/meteor';

i18n
  .use(Backend)
  .use(LanguageDetector)
  .init({
    whitelist: ['en', 'tr', 'fr'],
    fallbackLng: 'en',

    // have a common namespace used around the full app
    ns: ['common'],
    defaultNS: 'common',
    debug: false,

    backend: {
      loadPath: `${Meteor.absoluteUrl()}locales/{{lng}}/{{ns}}.json`,
      // loadPath: 'locales/{{lng}}/{{ns}}.json',
      jsonIndent: 2,
    },
  });

export default i18n;
