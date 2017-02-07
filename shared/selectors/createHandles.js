/* eslint-disable import/first, no-undef, import/no-extraneous-dependencies, import/no-unresolved, import/extensions, max-len */
import omit from 'lodash/omit';
import isEqual from 'lodash/isEqual';
/* eslint-enable */
import { Meteor } from 'meteor/meteor';
import {
  valueSet, collectionAdd, collectionChange, collectionRemove, collectionReset,
} from '../actions/utils';

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
          // First replace the store with the new contents
          const remoteData = cursor.fetch();
          // eslint-disable-next-line no-underscore-dangle
          const newData = remoteData.map(doc => ({ id: doc._id, ...omit(doc, '_id') }));
          dispatch(collectionReset(collectionStoreName, newData));

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
        // We just need to replace the store with the new contents
        // eslint-disable-next-line no-underscore-dangle
        const newData = remoteData.map(doc => ({ id: doc._id, ...omit(doc, '_id') }));
        dispatch(collectionReset(collectionStoreName, newData));
      }
    });

export {
  createToggleSubscribe,
  createHandleSyncViaMethod,
};
