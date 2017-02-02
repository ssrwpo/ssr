// Actions on collection stores
const collectionAdd = (collectionName, id, fields) =>
  ({ type: `${collectionName}.ADD`, value: { id, ...fields } });
const collectionChange = (collectionName, id, fields) =>
  ({ type: `${collectionName}.CHANGE`, value: { id, fields } });
const collectionRemove = (collectionName, id) =>
  ({ type: `${collectionName}.REMOVE`, value: { id } });

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
