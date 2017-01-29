import { createRouter, debugLastRequest, debugLastResponse } from './createRouter';
import logger from './utils/logger';
import sitemapFromArray from './utils/sitemaps';
import pure from '../shared/hoc/pure';
import {
  createCollectionReducers,
  createValueReducer,
} from '../shared/reducers/utils';
import {
  collectionAdd,
  collectionChange,
  collectionRemove,
  valueSet,
  valueReset,
} from '../shared/actions/utils';
import createHandleSubscribe from '../shared/selectors/createHandleSubscribe';

// Server side exports
export {
  // Main API
  createRouter,
  // Isomorphic logger
  logger,
  // Sitemap helper, server side only
  sitemapFromArray,
  // HOC
  pure,
  // Store creation
  createCollectionReducers,
  createValueReducer,
  // Actions on store
  collectionAdd,
  collectionChange,
  collectionRemove,
  valueSet,
  valueReset,
  // Helpers on selectors,
  createHandleSubscribe,
  // Acces to last reques, mainly for debug in `meteor shell`
  debugLastRequest,
  debugLastResponse,
};
