/* eslint-disable import/first, no-undef, import/no-extraneous-dependencies, import/no-unresolved, import/extensions, max-len */
import omit from 'lodash/omit';
import isEqual from 'lodash/isEqual';
/* eslint-enable */
import { Meteor } from 'meteor/meteor';
import {
  valueSet, collectionAdd, collectionChange, collectionRemove,
} from '../actions/utils';

const syncActionsFromStore = (collectionStoreName, collectionStore, remoteData) => {
  const dispatchActions = [];
  collectionStore.forEach((storeItem) => {
    // eslint-disable-next-line no-underscore-dangle
    const colItemIdx = remoteData.findIndex(item => item._id === storeItem.id);
    // Item in collection is present in the store, check if its content has changed
    if (colItemIdx !== -1) {
      // Check for updated items
      const colFields = omit(remoteData[colItemIdx], '_id');
      const storeFields = omit(storeItem, 'id');
      if (!isEqual(colFields, storeFields)) {
        dispatchActions.push(collectionChange(collectionStoreName, storeItem.id, colFields));
      }
    // Item in the store is no longer present in the collection, remove it
    } else {
      // Item is not anymore in the collection and must be removed from store
      dispatchActions.push(collectionRemove(collectionStoreName, storeItem.id));
    }
  });
  return dispatchActions;
};

/**
 * `createToggleSubscribe`
 * Create an `handleSubscribe` function for your `mapDispatchToProps`.
 * @param dispatch Store's dispatch.
 * @param publicationName Your publication name
 * @param cursor A cursor for the Mongo collection to synchronise
 * @param valueStoreNameForSubscription Name of the value store with subscription state
          (true => subscribed, false => not subscribed).
 * @param collectionStoreName Name of the collection store holding replica of collection.
 * @return A function toggle the current subscription state.
 */
const createToggleSubscribe = (
  dispatch,
  publicationName,
  cursor,
  valueStoreNameForSubscription,
  collectionStoreName,
) =>
  (context, isSubscribed, collectionStore, ...publicationParams) => {
    // Toggle the current subscription state
    const newState = !isSubscribed;
    dispatch(valueSet(valueStoreNameForSubscription, !isSubscribed));

    if (newState) {
      // Subscribe to collection
      context.query = null; // eslint-disable-line no-param-reassign
      context.sub = Meteor.subscribe( // eslint-disable-line no-param-reassign
        publicationName,
        ...publicationParams,
        // Once subscription is ready:
        // * Reconciliate data in store with the collection
        // * Setup an observer on the collection to synschronise the store
        () => {
          // Reconciliate store with the collection
          const remoteData = cursor.fetch();
          const dispatchActions = syncActionsFromStore(
            collectionStoreName,
            collectionStore,
            remoteData,
          );
          dispatchActions.forEach(action => dispatch(action));

          // Setup the observer on the collection
          // eslint-disable-next-line no-param-reassign
          context.query = cursor.observeChanges({
            added(id, fields) {
              const colItemIdx = collectionStore.findIndex(item => item.id === id);
              if (colItemIdx === -1) {
                dispatch(collectionAdd(collectionStoreName, id, fields));
              }
            },
            changed(id, fields) {
              dispatch(collectionChange(collectionStoreName, id, fields));
            },
            removed(id) {
              dispatch(collectionRemove(collectionStoreName, id));
            },
          });
        },
      );
    // Stop cursor observer and unsubscribe
    } else {
      if (context.query) {
        context.query.stop();
      }
      context.sub.stop();
    }
  };

/**
 * `createHandleSyncViaMethod`
 * Create an `handleSyncViaMethod` function for your `mapDispatchToProps`.
 * @param dispatch Store's dispatch.
 * @param validatedMethod A validated method which returns the entire collection to be synced.
 * @param collectionStoreName Name of the collection store holding replica of collection.
 * @return A function which takes the store and the parameters to send to the validated method,
           and which synchronizes the store with the collection return by the method.
 */
const createHandleSyncViaMethod = (
  dispatch,
  validatedMethod,
  collectionStoreName,
) => (collectionStore, ...methodParams) => validatedMethod.call(...methodParams,
    (err, remoteData) => {
      if (!err) {
         // Reconciliate deletion and update with results from method
        const dispatchActions = syncActionsFromStore(
          collectionStoreName,
          collectionStore,
          remoteData,
        );

        // Add new items get from method
        remoteData.forEach((methodItem) => {
          // eslint-disable-next-line no-underscore-dangle
          const colItemIdx = collectionStore.findIndex(item => item.id === methodItem._id);
          if (colItemIdx === -1) {
            dispatchActions.push(collectionAdd(
              collectionStoreName,
              methodItem._id, // eslint-disable-line no-underscore-dangle
              omit(methodItem, '_id'),
            ));
          }
        });
        dispatchActions.forEach(action => dispatch(action));
      }
    });

export {
  createToggleSubscribe,
  createHandleSyncViaMethod,
};
