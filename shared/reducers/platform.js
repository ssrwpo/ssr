import { PLATFORM } from '../constants';

const defaultState = 'default';

export default function platform(state = defaultState, action) {
  if (action.type === PLATFORM.SET) {
    return action.value;
  }
  return state;
}
