let messages = {};
// eslint-disable-next-line import/prefer-default-export
export function intl(state = { locale: 'en', messages }, action) {
  switch (action.type) {
    case 'CHANGE_LANGUAGE': {
      const { locale, fallback } = action.payload;
      return {
        locale: locale || fallback,
        messages: messages[locale || fallback],
      };
    }
    case 'SET_MESSAGES':
    // @NOTE No break here as the next case needs to be interpreted
    // eslint-disable-next-line no-fallthrough
    case 'RECEIVE_INTL': {
      messages = action.payload.messages;
      const { locale, languages, fallback } = action.payload;
      let userLocale = null;
      // Detect if users locale is fully supported by us
      const fullySupportedLng = languages.indexOf(locale) !== -1;
      if (fullySupportedLng) {
        userLocale = locale;
      } else {
        // Detect if users locale is partially supported by us
        const shortLocale = locale.substring(0, 2);
        const partiallySupportedLng = languages.indexOf(shortLocale) !== -1;
        if (partiallySupportedLng) userLocale = shortLocale;
      }
      return {
        locale: userLocale || fallback,
        messages: messages[userLocale || fallback],
      };
    }
    default: return state;
  }
}
