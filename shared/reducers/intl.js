let messages = {};
// eslint-disable-next-line import/prefer-default-export
export function intl(state = messages, action) {
  switch (action.type) {
    case 'CHANGE_LANGUAGE' : {
      return {
        locale: action.payload.language,
        messages: messages[action.payload.language],
      };
    }
    case 'SET_MESSAGES' : {
      messages = action.payload.messages;
      return {
        locale: action.payload.language || action.payload.fallback,
        messages: messages[action.payload.language || action.payload.fallback],
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
