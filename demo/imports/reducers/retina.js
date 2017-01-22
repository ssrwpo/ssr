import { RETINA } from '../constants';

const defaultState = false;

export default function retina(state = defaultState, action) {
  if (action.type === RETINA.SET) {
    return action.value;
  }
  return state;
}
