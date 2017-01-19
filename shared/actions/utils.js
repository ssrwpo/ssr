const collectionAdd = (collectionName, id, fields) =>
  ({ type: `${collectionName}.ADD`, value: { _id: id, ...fields } });
const collectionChange = (collectionName, id, fields) =>
  ({ type: `${collectionName}.CHANGE`, value: { _id: id, fields } });
const collectionRemove = (collectionName, id) =>
  ({ type: `${collectionName}.REMOVE`, value: id });

export {
  collectionAdd,
  collectionChange,
  collectionRemove,
};
