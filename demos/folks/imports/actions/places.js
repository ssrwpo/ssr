import { PLACES } from '../constants';

const placeAdd = ({ _id, ...fields }) =>
  ({ type: PLACES.ADD, value: { id: _id, ...fields } });
const placeChange = ({ _id, ...fields }) =>
  ({ type: PLACES.CHANGE, value: { id: _id, ...fields } });
const placeRemove = ({ _id }) =>
  ({ type: PLACES.REMOVE, value: _id });

export {
  placeAdd,
  placeChange,
  placeRemove,
};
