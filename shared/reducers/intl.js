global.Intl = require('intl');

let messages = {};
// eslint-disable-next-line import/prefer-default-export
export function intl(state = { locale: 'mui', messages }, action) {
  switch (action.type) {
    case 'CHANGE_LANGUAGE' : {
      return {
        locale: action.payload.locale || action.payload.fallback,
        messages: messages[action.payload.locale],
      };
    }
    case 'SET_MESSAGES' : {
      messages = action.payload.messages;
      let userLocale = null;
      // detect users locale is fully supported by us
      const fullySupportedLng =
        action.payload.languages.includes(action.payload.locale);
        // detect users locale is partially supported by us
      const partiallySupportedLng =
        action.payload.languages.includes(action.payload.locale.substring(0, 2));
      if (fullySupportedLng) {
        userLocale = action.payload.locale;
      }
      if (!userLocale && partiallySupportedLng) {
        userLocale = action.payload.locale.substring(0, 2);
      }
      return {
        locale: userLocale || action.payload.fallback,
        messages: messages[
          userLocale ||
          action.payload.fallback],
      };
    }
    case 'RECEIVE_INTL' : {
      let userLocale = null;
      // detect users locale is fully supported by us
      const fullySupportedLng =
        action.payload.languages.includes(action.payload.locale);
        // detect users locale is partially supported by us
      const partiallySupportedLng =
        action.payload.languages.includes(action.payload.locale.substring(0, 2));
      if (fullySupportedLng) {
        userLocale = action.payload.locale;
      }
      if (!userLocale && partiallySupportedLng) {
        userLocale = action.payload.locale.substring(0, 2);
      }
      return {
        locale: userLocale,
        messages: action.payload.messages[userLocale],
      };
    }
    default: return state;
  }
}
