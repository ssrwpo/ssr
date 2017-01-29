import { PERF_ITEMS } from '../constants';

const defaultState = 2000;

export default function auth(state = defaultState, action) {
  if (action.type === PERF_ITEMS.SET) {
    return action.value;
  }
  return state;
}
