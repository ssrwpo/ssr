const urlQueryParameters = {
  // Query specific to routes
  '/folks': (query) => {
    console.log('query', query);
    return false;
  },
};

export default urlQueryParameters;
