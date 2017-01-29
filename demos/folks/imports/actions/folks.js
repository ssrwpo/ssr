import { FOLKS } from '../constants';

const folkAdd = ({ _id, ...fields }) =>
  ({ type: FOLKS.ADD, value: { id: _id, ...fields } });
const folkChange = ({ _id, ...fields }) =>
  ({ type: FOLKS.CHANGE, value: { id: _id, ...fields } });
const folkRemove = ({ _id }) =>
  ({ type: FOLKS.REMOVE, value: _id });

export {
  folkAdd,
  folkChange,
  folkRemove,
};
