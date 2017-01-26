import { URL } from '../constants';

export default function url(state = null, action) {
  if (action.type === URL.SET) {
    return action.value;
  }
  return state;
}
