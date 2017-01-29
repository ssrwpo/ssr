import { PLACES } from '../constants';

const defaultState = [];

export default function folks(state = defaultState, action) {
  switch (action.type) {
    case PLACES.ADD: return [...state, action.value];
    case PLACES.CHANGE: {
      const idx = state.findIndex(item => (item.id === action.value.id));
      const newItem = { ...state[idx], ...action.value.fields };
      return [
        ...state.slice(0, idx),
        newItem,
        ...state.slice(idx + 1),
      ];
    }
    case PLACES.REMOVE: {
      const idx = state.findIndex(item => (item.id === action.value.id));
      return [
        ...state.slice(0, idx),
        ...state.slice(idx + 1),
      ];
    }
    default: return state;
  }
}
