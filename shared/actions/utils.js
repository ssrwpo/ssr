// Actions on collection stores
const collectionAdd = (collectionName, { _id, ...fields }) =>
  ({ type: `${collectionName}.ADD`, value: { id: _id, ...fields } });
const collectionChange = (collectionName, { _id, ...fields }) =>
  ({ type: `${collectionName}.CHANGE`, value: { id: _id, ...fields } });
const collectionRemove = (collectionName, { _id }) =>
  ({ type: `${collectionName}.REMOVE`, value: { id: _id } });

// Actions on value stores
const valueSet = (storeName, value) => ({ type: `${storeName}.SET`, value });
const valueReset = (storeName, value) => ({ type: `${storeName}.RESET`, value });

export {
  collectionAdd,
  collectionChange,
  collectionRemove,
  valueSet,
  valueReset,
};
