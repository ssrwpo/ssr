import pick from 'lodash/pick';
import Folks from '../imports/api/Folks';

const routes = {
  '/folks': {
    urlQueryParameters: (params, query) => {
      const allowedKeys = ['folkId'];
      const allowedQueryParams = pick(query, allowedKeys);
      if (Object.keys(allowedQueryParams).length !== allowedKeys.length) {
        return allowedQueryParams;
      }
      // const folk = store.getState().Folks.find(item => item.id === allowedQueryParams.folkId);
      const folk = Folks.findOne(allowedQueryParams.folkId);
      if (!folk) {
        return null;
      }
      return allowedQueryParams;
    },
  },
  // Query specific to routes
  '/folks/:folkId': {
    urlQueryParameters: (params) => {
      const allowedKeys = ['folkId'];
      const allowedQueryParams = pick(params, allowedKeys);
      if (Object.keys(allowedQueryParams).length !== allowedKeys.length) {
        return allowedQueryParams;
      }
      // const folk = store.getState().Folks.find(item => item.id === allowedQueryParams.folkId);
      const folk = Folks.findOne(allowedQueryParams.folkId);
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
