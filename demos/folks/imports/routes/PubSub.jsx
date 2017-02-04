import React, { PureComponent, PropTypes as pt } from 'react';
import omit from 'lodash/omit';
import {
  logger, valueSet, createHandleSubscribe, createHandleSyncViaMethod, collectionAdd,
} from 'meteor/ssrwpo:ssr';
import Helmet from 'react-helmet';
import { connect } from 'react-redux';
import PubSubCol, { PubSubPublicationName, insertRandomPubSubItem, valuesFromLastMod,
} from '/imports/api/PubSub';
import Item from './Item';

const styles = {
  button: { marginRight: '1em' },
};

class PubSub extends PureComponent {
  static propTypes = {
    buildDate: pt.number.isRequired,
    PubSubStore: pt.array.isRequired,
    isPubSubSubscribed: pt.bool.isRequired,
    isPubSubInitialised: pt.bool.isRequired,
    markPubSubAsInitialised: pt.func.isRequired,
    handleSubscribe: pt.func.isRequired,
    handleInsertRandom: pt.func.isRequired,
    handleSyncViaMethod: pt.func.isRequired,
  }

  static ssr = {
    prepareStore: (store) => {
      const { isPubSubInitialised } = store.getState();
      if (!isPubSubInitialised) {
        logger.debug('Initialising PubSub Store');
        PubSubCol.find({}, { sort: { lastMod: -1 } }).fetch().forEach((ps) => {
          store.dispatch(collectionAdd(
            'PubSub',
            ps._id, // eslint-disable-line no-underscore-dangle
            omit(ps, '_id'),
          ));
        });
        store.dispatch(valueSet('isPubSubInitialised', true));
        return true;
      }

      return false;
    },
  }

  componentWillMount() {
    // A traditional meteor application would need to subscribe in some way to the
    // collection. With ssrwpo:ssr things are different. We use Redux to store the
    // contents of server-side rendered collections. Changes to the collection may
    // be observed using `createHandleSubscribe`, which will update the Redux store
    // and cause any dependant components to re-render.
    //
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
    // have any data yet, so we need to fetch it. We use a store parameter to flag
    // whether or not the store data has been initialised.
    //
    // We don't do this on the server since we the store data be passed through
    // to our props. That will allow the SSR treewalking to continue into the
    // children (which themselves have SSR requirements).
    //
    // Instead we use the `prepareStore` function on the static `ssr` object. This will
    // be hoisted up by our connect, so the store data will be ready by the time
    // this component is traversed.

    const {
      isPubSubInitialised,
      markPubSubAsInitialised,
      PubSubStore,
      handleSyncViaMethod,
    } = this.props;

    if (Meteor.isClient && !isPubSubInitialised) {
      handleSyncViaMethod(0, PubSubStore);
      markPubSubAsInitialised();
    }
  }

  componentWillUnmount() {
    const { isPubSubSubscribed, handleSubscribe, buildDate } = this.props;
    if (isPubSubSubscribed) {
      handleSubscribe(this, isPubSubSubscribed, buildDate);
    }
  }

  render() {
    const {
      PubSubStore, isPubSubSubscribed, buildDate,
      handleSubscribe, handleInsertRandom, handleSyncViaMethod,
    } = this.props;
    return (
      <div>
        <Helmet title="Reactive cases" />
        <h2>Reactive cases</h2>
        <hr />
        <button
          style={styles.button}
          onClick={() => handleSubscribe(this, isPubSubSubscribed, buildDate, PubSubStore)}
        >
          {isPubSubSubscribed ? 'Stop subscription' : 'Synchronize via subscribe'}
        </button>
        {
          isPubSubSubscribed ||
            <button
              style={styles.button}
              onClick={() => handleSyncViaMethod(buildDate, PubSubStore)}
            >
              Synchronize via method
            </button>
        }
        <button style={styles.button} onClick={handleInsertRandom}>
          Insert a random item
        </button>
        <hr />
        {
          PubSubStore
          .sort((a, b) => b.lastMod - a.lastMod)
          .map(item => <Item key={`${item.id}-${item.lastMod}`} {...{ ...item, isPubSubSubscribed }} />)
        }
      </div>
    );
  }
}

export default connect(
  state => ({
    buildDate: state.buildDate,
    PubSubStore: state.PubSub,
    isPubSubSubscribed: state.isPubSubSubscribed,
    isPubSubInitialised: state.isPubSubInitialised,
  }),

  dispatch => ({
    handleSubscribe: createHandleSubscribe(
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
      valuesFromLastMod,
      'PubSub',
    ),
  }),
)(PubSub);
