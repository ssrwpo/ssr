import { EJSON } from 'meteor/ejson';

const createDataContext = () => {
  const dataContext = { someItems: ['Hello', 'world'] };
  const serialized = EJSON.stringify(dataContext);
  /* eslint-disable react/no-danger */
  return {
    dataContext,
    dataMarkup: `<script>window.initialReactContext='${serialized}';</script>`,
  };
  /* eslint-enable */
};
export default createDataContext;
