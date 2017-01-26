import { REDIRECT } from '../constants';

export default function redirect(state = false, action) {
  switch (action.type) {
    case REDIRECT.TO:
      return action.url;
    case REDIRECT.DISABLE:
      return false;
    default:
      return state;
  }
}
