import { FOLKS } from '../constants';

const defaultState = [];

export default function folks(state = defaultState, action) {
  switch (action.type) {
    case FOLKS.ADD: return [...state, action.value];
    case FOLKS.CHANGE: {
      const idx = state.findIndex(item => (item.id === action.value.id));
      const newItem = { ...state[idx], ...action.value.fields };
      return [
        ...state.slice(0, idx),
        newItem,
        ...state.slice(idx + 1),
      ];
    }
    case FOLKS.REMOVE: {
      const idx = state.findIndex(item => (item.id === action.value.id));
      return [
        ...state.slice(0, idx),
        ...state.slice(idx + 1),
      ];
    }
    default: return state;
  }
}
