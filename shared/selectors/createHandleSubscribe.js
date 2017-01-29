/* eslint-disable import/first, no-undef, import/no-extraneous-dependencies, import/no-unresolved, import/extensions, max-len */
import omit from 'lodash/omit';
import isEqual from 'lodash/isEqual';
/* eslint-enable */
import { Meteor } from 'meteor/meteor';
import {
  valueSet, collectionAdd, collectionChange, collectionRemove,
} from '../actions/utils';

/**
 * Create an `handleSubscribe` function for your `mapDispatchToProps`.
 * @param dispatch Store's dispatch.
 * @param publicationName Your publication name which must accept an UNIX date value as `lastMod`.
 * @param cursor A cursor on Mongo collection with a `lastMod` set on each item.
 * @param valueStoreNameForSubscription Name of the value store identifying subscription state.
 * @param collectionStoreName Name of the collection store holding replica of collection.
 * @return A function allowing to subscribe and unsubscribe.
 */
const createHandleSubscribe = (
  dispatch,
  publicationName,
  cursor,
  valueStoreNameForSubscription,
  collectionStoreName,
) =>
  (context, isSubscribed, buildDate, collectionStore) => {
    // Set the store either as subscribe or not
    const newState = !isSubscribed;
    dispatch(valueSet(valueStoreNameForSubscription, !isSubscribed));
    if (newState) {
      // Find the first appropriate date
      const since = collectionStore.reduce((acc, item) => Math.min(buildDate, item.lastMod));
      // eslint-disable-next-line no-param-reassign
      context.query = null;
      // Subscribe to collection
      // eslint-disable-next-line no-param-reassign
      context.sub = Meteor.subscribe(
        publicationName,
        { lastMod: since },
        // Once subscription is ready:
        // * Reconciliate data in store with the collection
        // * Setup an observer on the collection to synschronise the store
        () => {
          // Reconciliate store with the collection
          const fromCollection = cursor.fetch();
          const dispatchActions = [];
          collectionStore.forEach((storeItem) => {
            // eslint-disable-next-line no-underscore-dangle
            const colItemIdx = fromCollection.findIndex(item => item._id === storeItem.id);
            // Item in collection is present in the store, check if its content has changed
            if (colItemIdx !== -1) {
              // Check for updated items
              const colFields = omit(fromCollection[colItemIdx], '_id');
              const storeFields = omit(storeItem, 'id');
              if (!isEqual(colFields, storeFields)) {
                dispatchActions.push(collectionAdd(collectionStoreName, storeItem.id, colFields));
              }
            // Item in the store is no longer present in the collection, remove it
            } else {
              // Item is not anymore in the collection and must be removed from store
              dispatchActions.push(collectionRemove(collectionStoreName, storeItem.id));
            }
          });
          // Apply reconciliation actions to the store
          dispatchActions.forEach(action => dispatch(action));
          // Setup the observer on the collection
          // eslint-disable-next-line no-param-reassign
          context.query = cursor.observeChanges({
            added(id, fields) {
              if (fields.lastMod > buildDate) {
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

export default createHandleSubscribe;
