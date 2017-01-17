import { EJSON } from 'meteor/ejson';

const createDataContext = () => {
  const dataContext = { someItems: ['Hello', 'world'] };
  const serialized = EJSON.stringify(dataContext);
  return {
    dataContext,
    dataMarkup: `<script>window.__PRELOADED_STATE__='${serialized}';</script>`,
  };
};
export default createDataContext;
