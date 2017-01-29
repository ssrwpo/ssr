import pick from 'lodash/pick';
import Folks from '../imports/api/Folks';
import Places from '../imports/api/Places';

import { folkAdd } from '../imports/actions/folks';
import { placeAdd } from '../imports/actions/places';

const routes = {
  '/folks': {
    urlQueryParameters: (params, query) => {
      const allowedKeys = ['folkId'];
      const allowedQueryParams = pick(query, allowedKeys);
      if (Object.keys(allowedQueryParams).length !== allowedKeys.length) {
        return allowedQueryParams;
      }
      // const folk = store.getState().Folks.find(item => item.id === allowedQueryParams.folkId);
      const folk = Folks.find(allowedQueryParams.folkId);
      if (!folk) {
        return null;
      }
      return allowedQueryParams;
    },
  },
  // Query specific to routes
  '/folks/:folkId': {
    urlQueryParameters: (params, query) => {
      const allowedKeys = ['folkId'];
      const allowedQueryParams = pick(query, allowedKeys);
      if (Object.keys(allowedQueryParams).length !== allowedKeys.length) {
        return allowedQueryParams;
      }
      // const folk = store.getState().Folks.find(item => item.id === allowedQueryParams.folkId);
      const folk = Folks.find(allowedQueryParams.folkId);
      if (!folk) {
        return null;
      }
      return allowedQueryParams;
    },
  },
  middlewares: (params, store) => {
    Folks.find({}, { sort: { order: -1 } }).fetch().forEach((folk) => {
      store.dispatch(folkAdd(folk));
    });
    Places.find({}, { sort: { order: -1 } }).fetch().forEach((place) => {
      store.dispatch(placeAdd(place));
    });
  },
  options: {
    enableCahing: true,
  },
};

export default routes;
