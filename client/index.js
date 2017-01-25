import { createRouter, getStore } from './createRouter';
import logger from './utils/logger';
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

// Client side exports
export {
  // Main API
  createRouter,
  // Isomorphic logger
  logger,
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
  // Store access, mainly for debug
  getStore,
};
