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
    default: return state;
  }
}
