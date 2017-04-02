import React, { PureComponent, PropTypes as pt } from 'react';
import omit from 'lodash/omit';
import {
  logger, valueSet, createToggleSubscribe, createHandleSyncViaMethod, collectionAdd,
} from 'meteor/ssrwpo:ssr';
import Helmet from 'react-helmet';
import { connect } from 'react-redux';
import PubSubCol, { PubSubPublicationName, insertRandomPubSubItem, getPubSubValues,
} from '/imports/api/PubSub';
import CachableItem from './CachableItem';

const styles = {
  button: { marginRight: '1em' },
};

class PubSub extends PureComponent {
  static propTypes = {
    PubSubStore: pt.array.isRequired,
    isPubSubSubscribed: pt.bool.isRequired,
    isPubSubInitialised: pt.bool.isRequired,
    markPubSubAsInitialised: pt.func.isRequired,
    toggleSubscribe: pt.func.isRequired,
    handleInsertRandom: pt.func.isRequired,
    handleSyncViaMethod: pt.func.isRequired,
  }

  static ssr = {
    prepareStore: (store) => {
      const { isPubSubInitialised } = store.getState();

      // We need to ensure that we haven't already synced because this function
      // will also be hoisted to `connect` HOC, so it will be called twice during
      // the tree walk.
      if (!isPubSubInitialised) {
        logger.debug('Initialising PubSub Store');

        // We mark the data as initialised that we know not to fetch the data on the
        // client unnecessarily. This also prevents this function being called twice
        // during to the hoisting of the statics by the `connect` HOC.
        store.dispatch(valueSet('isPubSubInitialised', true));

        // Add data from the PubSub collection to the store
        PubSubCol.find().fetch().forEach((ps) => {
          store.dispatch(collectionAdd(
            'PubSub',
            ps._id, // eslint-disable-line no-underscore-dangle
            omit(ps, '_id'),
          ));
        });

        // Returning true indicates that we've updated the store.
        return true;
      }

      // We haven't updated the store...
      return false;
    },
  }

  componentWillMount() {
    // For this example we don't wish to reactively subscribe unless the user
    // specifically presses the button to do that, but we do wish to display the initial
    // data set.
    //
    // ssrwpo:ssr will scan the render tree once before it's actually rendered, giving
    // all components an opportunity to prepare the store for rendering.
    // We can do this in a synchronous fashion in componentWillMount().
    // Not only will data added to the store here will be rendered on the server,
    // it will also be injected into the Redux store in the initial HTML payload.
    // This means that if we access this route directly, we don't need to re-fetch the data.
    //
    // If the app is already loaded and we're coming from another route then we won't
    // have any data yet, so we need to fetch it. In that case `isPubSubInitialised` will
    // be false.
    //
    // On the server we use `prepareStore` to initialise the data, so we must only run
    // this code on the client.
    const {
      isPubSubInitialised,
      markPubSubAsInitialised,
      PubSubStore,
      handleSyncViaMethod,
    } = this.props;

    if (Meteor.isClient && !isPubSubInitialised) {
      handleSyncViaMethod(PubSubStore);
      markPubSubAsInitialised();
    }
  }

  componentWillUnmount() {
    const { isPubSubSubscribed, toggleSubscribe, PubSubStore } = this.props;
    if (isPubSubSubscribed) toggleSubscribe(this, isPubSubSubscribed, PubSubStore);
  }

  render() {
    const {
      PubSubStore, isPubSubSubscribed,
      toggleSubscribe, handleInsertRandom, handleSyncViaMethod,
    } = this.props;
    return (
      <div>
        <Helmet title="Reactive cases" />
        <h2>Reactive cases</h2>
        <hr />
        <button
          style={styles.button}
          onClick={() => toggleSubscribe(this, isPubSubSubscribed, PubSubStore)}
        >
          {isPubSubSubscribed ? 'Stop subscription' : 'Synchronize via subscribe'}
        </button>
        {isPubSubSubscribed
          || <button style={styles.button} onClick={() => handleSyncViaMethod(PubSubStore)}>
            Synchronize via method
          </button>
        }
        <button style={styles.button} onClick={handleInsertRandom}>
          Insert a random item
        </button>
        <hr />
        {PubSubStore
        .sort((a, b) => b.lastMod - a.lastMod)
        .map(item => <CachableItem key={`${item.id}`} {...{ ...item, isPubSubSubscribed }} />)
        }
      </div>
    );
  }
}

export default connect(
  state => ({
    PubSubStore: state.PubSub,
    isPubSubSubscribed: state.isPubSubSubscribed,
    isPubSubInitialised: state.isPubSubInitialised,
  }),
  dispatch => ({
    toggleSubscribe: createToggleSubscribe(
      dispatch,
      PubSubPublicationName,
      PubSubCol.find(),
      'isPubSubSubscribed',
      'PubSub',
    ),
    markPubSubAsInitialised() {
      dispatch(valueSet('isPubSubInitialised', true));
    },
    handleInsertRandom() {
      insertRandomPubSubItem.callPromise()
      .then(() => logger.info('Item inserted'))
      .catch(err => logger.warn('Insertion failed', err.toString()));
    },
    handleSyncViaMethod: createHandleSyncViaMethod(
      dispatch,
      getPubSubValues,
      'PubSub',
    ),
  }),
)(PubSub);
