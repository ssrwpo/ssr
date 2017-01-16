import { AUTH } from '../constants';

const defaultState = false;

export default function auth(state = defaultState, action) {
  switch (action.type) {
    case AUTH.LOGIN: return true;
    case AUTH.LOGOUT: return false;
    default: return state;
  }
}

// Shared props selectors
export const selectIsLoggedIn = state => ({ isLoggedIn: state.auth });
