// Create a store holding a collecion
export const createCollectionReducers = cursorNames =>
  cursorNames.reduce((acc, cursorName) => (
    {
      ...acc,
      [cursorName]: (state = [], action) => {
        switch (action.type) {
          case `${cursorName}.ADD`:
            return [...state, action.value];
          case `${cursorName}.CHANGE`: {
            const idx = state.findIndex(item => (item.id === action.value.id));
            const newItem = { ...state[idx], ...action.value.fields };
            return [
              ...state.slice(0, idx),
              newItem,
              ...state.slice(idx + 1),
            ];
          }
          case `${cursorName}.REMOVE`: {
            const idx = state.findIndex(item => (item.id === action.value.id));
            return [
              ...state.slice(0, idx),
              ...state.slice(idx + 1),
            ];
          }
          default: return state;
        }
      },
    }
  ), {});

// Create a store holding a unique value
export const createValueReducer = (storeName, initialState = null) =>
  (state = initialState, { type, value }) => {
    switch (type) {
      case `${storeName}.SET`: return value;
      case `${storeName}.RESET`: return initialState;
      default: return state;
    }
  };
