import { createRouter, getStore } from './createRouter';
import logger from './utils/logger';
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
  changeLanguage,
  setMessages,
} from '../shared/actions/intl';
import {
  createToggleSubscribe,
  createHandleSyncViaMethod,
} from '../shared/selectors/createHandles';
import { BrowserStats } from '../shared/components';

// Client side exports
export {
  // Main API
  createRouter,
  // Isomorphic logger
  logger,
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
  changeLanguage,
  setMessages,
  // Helpers on selectors,
  createToggleSubscribe,
  createHandleSyncViaMethod,
  // Ready made components
  BrowserStats,
  // Store access, mainly for debug
  getStore,
};
