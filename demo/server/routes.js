import pick from 'lodash/pick';
import Folks from '../imports/api/Folks';
// import Places from '../imports/api/Places';

const routes = {
  // Query specific to routes
  '/folks/:id': {
    urlQueryParameters: (params, query) => {
      const allowedKeys = ['folkId'];
      const allowedQueryParams = pick(query, allowedKeys);
      if (Object.keys(allowedQueryParams).length !== allowedKeys.length) {
        return null;
      }
      // const folk = store.getState().Folks.find(item => item.id === allowedQueryParams.folkId);
      const folk = Folks.find(allowedQueryParams.folkId);
      if (!folk) {
        return null;
      }
      return allowedQueryParams;
    },
  },
  options: {
    enableCahing: true,
  },
};

export default routes;
