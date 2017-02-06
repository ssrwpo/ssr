import { createRouter, debugLastRequest, debugLastResponse } from './createRouter';
import logger from './utils/logger';
import { resetSSRCache } from './utils/cache';
import sitemapFromArray from './utils/sitemaps';
import pure from '../shared/hoc/pure';
import asymetricSsr from '../shared/hoc/asymetricSsr';
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
import {
  createHandleSubscribe,
  createHandleSyncViaMethod,
} from '../shared/selectors/createHandles';
import { BrowserStats } from '../shared/components';

// Server side exports
export {
  // Main API
  createRouter,
  resetSSRCache,
  // Isomorphic logger
  logger,
  // Sitemap helper, server side only
  sitemapFromArray,
  // HOC
  pure,
  asymetricSsr,
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
  createHandleSyncViaMethod,
  // Ready made components
  BrowserStats,
  // Acces to last request, mainly for debug in `meteor shell`
  debugLastRequest,
  debugLastResponse,
};
