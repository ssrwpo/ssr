import omit from 'lodash/omit';
import pick from 'lodash/pick';

import { collectionAdd } from 'meteor/ssrwpo:ssr';

import Folks from '../imports/api/Folks';
import Places from '../imports/api/Places';
import PubSub from '../imports/api/PubSub';

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
  middlewares: (params, store) => {
    Folks.find({}, { sort: { order: -1 } }).fetch().forEach((folk) => {
      store.dispatch(collectionAdd(
        'Folks',
        // eslint-disable-next-line no-underscore-dangle
        folk._id,
        omit(folk, '_id'),
      ));
    });
    Places.find({}, { sort: { order: -1 } }).fetch().forEach((place) => {
      store.dispatch(collectionAdd(
        'Places',
        // eslint-disable-next-line no-underscore-dangle
        place._id,
        omit(place, '_id'),
      ));
    });
    PubSub.find({}, { sort: { lastMod: -1 } }).fetch().forEach((ps) => {
      store.dispatch(collectionAdd(
        'PubSub',
        // eslint-disable-next-line no-underscore-dangle
        ps._id,
        omit(ps, '_id'),
      ));
    });
  },
  options: {
    enableCahing: true,
  },
};

export default routes;
