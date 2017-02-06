global.Intl = require('intl');

let messages = {};
// eslint-disable-next-line import/prefer-default-export
export function intl(state = { locale: '', messages }, action) {
  switch (action.type) {
    case 'CHANGE_LANGUAGE' : {
      return {
        locale: action.payload.language || action.payload.fallback,
        messages: messages[action.payload.language],
      };
    }
    case 'SET_MESSAGES' : {
      messages = action.payload.messages;
      let userLanguage = null;
      const fullySupportedLng =
        action.payload.languages.includes(action.payload.language);
      const partiallySupportedLng =
        action.payload.languages.includes(action.payload.language.substring(0, 2));
      if (fullySupportedLng) {
        userLanguage = action.payload.language;
      }
      if (!userLanguage && partiallySupportedLng) {
        userLanguage = action.payload.language.substring(0, 2);
      }
      return {
        locale: userLanguage || action.payload.language || action.payload.fallback,
        messages: messages[
          userLanguage ||
          action.payload.language ||
          action.payload.fallback],
      };
    }
    case 'SET_EMPTY_LOCALIZATION' : {
      return {
        locale: '',
        messages: {},
      };
    }
    case 'RECEIVE_INTL' : {
      const lng = action.payload.language || global.userLanguage || action.payload.fallback;
      return {
        locale: lng,
        messages: action.payload.messages[lng],
      };
    }
    default: return state;
  }
}
