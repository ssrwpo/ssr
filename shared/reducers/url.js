import { URL } from '../constants';

export default function url(state = null, action) {
  if (action.type === 'SET_URL') {
    return action.value;
  }
  return state;
}
