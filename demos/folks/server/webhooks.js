const webhooks = {
  // eslint-disable-next-line no-unused-vars
  '/api/ready': (req, res, next) => {
    res.set('Content-Type', 'application/json');
    res.end(JSON.stringify({ ready: true }));
  },
  // eslint-disable-next-line no-unused-vars
  '/api/translations': (req, res, next) => {
    res.set('Content-Type', 'application/json');
    res.end(JSON.stringify({
      en: {
        'app.greetings': 'Hello from REST API !',
        'app.currentLanguage': 'Current language is ({language})',
      },
      fr: {
        'app.greetings': 'Bonjour de REST API !',
        'app.currentLanguage': 'La langue actuelle est {language}',
      },
      tr: {
        'app.greetings': 'REST API den Merhaba !',
        'app.currentLanguage': 'Şu anki dil ({language})',
      },
    }));
  },
};

export default webhooks;
