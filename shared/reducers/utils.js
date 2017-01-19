const createCollectionReducers = cursorNames =>
  cursorNames.reduce((acc, cursorName) => (
    {
      ...acc,
      [cursorName]: (state = [], action) => {
        switch (action.type) {
          case `${cursorName}.ADD`: return [...state, action.value];
          case `${cursorName}.CHANGE`: return [...state];
          case `${cursorName}.REMOVE`: return [...state];
          default: return state;
        }
      },
    }
  ), {});

export default createCollectionReducers;
