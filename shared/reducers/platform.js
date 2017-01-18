import { PLATFORM } from '../constants';

const defaultState = 'default';

export default function platform(state = defaultState, action) {
  switch (action.type) {
    case PLATFORM.SET: return action.value;
    default: return state;
  }
}

// Shared props selectors
export const selectPlatform = state => ({ platform: state.platform });
