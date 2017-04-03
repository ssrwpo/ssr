import '../shared/utils/peerDependencies';
import { createRouter, getStore } from './createRouter';
import logger from '../shared/utils/logger';
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
  receiveIntl,
} from '../shared/actions/intl';
import {
  createToggleSubscribe,
  createHandleSyncViaMethod,
} from '../shared/selectors/createHandles';
import { BrowserStats, UserStats } from '../shared/components';
import { TRANSLATION_URL, NOT_FOUND_URL } from '../shared/constants';

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
  receiveIntl,
  // Helpers on selectors,
  createToggleSubscribe,
  createHandleSyncViaMethod,
  // Ready made components
  BrowserStats,
  UserStats,
  // Store access, mainly for debug
  getStore,
  // Constants
  NOT_FOUND_URL,
  TRANSLATION_URL,
};
