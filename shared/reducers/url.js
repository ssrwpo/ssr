import { URL } from '../constants';

const DEFAULT_URL = null;

export default function url(state = DEFAULT_URL, action) {
  return action.type === URL.SET ? action.value : state;
}
