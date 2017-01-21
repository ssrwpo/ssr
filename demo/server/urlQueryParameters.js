const urlQueryParameters = {
  // Query allowed for every routes
  filtered(query) {
    return false;
  },
  // Query specific to routes
  '/folks': (query) => {
    console.log('query', query);
    return false;
  },
};

export default urlQueryParameters;
