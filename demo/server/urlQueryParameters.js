import pick from 'lodash/pick';

const urlQueryParameters = {
  // Query specific to routes
  '/folks': (query, store) => {
    const allowedKeys = ['folkId'];
    const allowedQueryParams = pick(query, allowedKeys);
    if (Object.keys(allowedQueryParams).length !== allowedKeys.length) {
      return null;
    }
    const folk = store.getState().Folks.find(item => item.id === allowedQueryParams.folkId);
    if (!folk) {
      return null;
    }
    return allowedQueryParams;
  },
};

export default urlQueryParameters;
