import { BUILD_DATE } from '../constants';

const defaultState = 0;

export default function buildDate(state = defaultState, action) {
  if (action.type === BUILD_DATE.SET) {
    return action.value;
  }
  return state;
}
