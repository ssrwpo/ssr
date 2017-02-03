import React, { PureComponent, PropTypes as pt } from 'react';
import once from 'lodash/once';
import omit from 'lodash/omit';
import {
  logger, pure, collectionAdd,
  // Helpers for collectionStore synchronization
  valueSet, createHandleSubscribe, createHandleSyncViaMethod,
} from 'meteor/ssrwpo:ssr';
import moment from 'moment';
import Helmet from 'react-helmet';
import { connect } from 'react-redux';
import PubSubCol, {
  PubSubPublicationName,
  insertRandomPubSubItem, updatePubSubItem, removePubSubItem,
  valuesFromLastMod,
} from '/imports/api/PubSub';

// This function will be called by the server to prepare the store before the
// server-side rendering. Since we may wish to prepare the same store from several
// different components, it's good practise to ensure that the function can only be
// called once
export const preparePubSubStore = once((store) => {
  logger.debug('Preparing PubSub store');
  PubSubCol.find({}, { sort: { order: -1 } }).fetch().forEach((ps) => {
    store.dispatch(collectionAdd(
      'PubSub',
      ps._id, // eslint-disable-line no-underscore-dangle
      omit(ps, '_id'),
    ));
  });

  // We set a flag on the store so that we know that we don't need to fetch any
  // data when mounting the component.
  store.dispatch(valueSet('isPubSubInitialised', true));
});

const styles = {
  button: { marginRight: '1em' },
  img: { verticalAlign: 'middle' },
};

let Item = ({ isPubSubSubscribed, id, avatar, email, lastMod }) => {
  const Actions = isPubSubSubscribed
    ? () => (
      <span>
        &nbsp;-&nbsp;
        <button onClick={() => updatePubSubItem.callPromise({ id })}>Update</button>&nbsp;-&nbsp;
        <button onClick={() => removePubSubItem.callPromise({ id })}>Remove</button>
      </span>
    )
    : () => null;
  return (
    <p>
      <img
        src={avatar} alt={email} width={30} height={30} style={styles.img}
      />&nbsp;
      <strong>{email}</strong>&nbsp;
      <small>({id})</small>&nbsp;-&nbsp;
      <small>{moment(lastMod).format('DD/MM/YY - HH:mm:ss')}</small>
      <Actions />
    </p>
  );
};

Item.propTypes = {
  isPubSubSubscribed: pt.bool.isRequired,
  id: pt.string.isRequired,
  avatar: pt.string.isRequired,
  email: pt.string.isRequired,
  lastMod: pt.number.isRequired,
};

Item = pure(Item);

class PubSub extends PureComponent {
  static propTypes = {
    buildDate: pt.number.isRequired,
    PubSubStore: pt.array.isRequired,
    isPubSubSubscribed: pt.bool.isRequired,
    isPubSubInitialised: pt.bool.isRequired,
    markPubSubAsInitialised: pt.func.isRequired,
    handleSubscribe: pt.func.isRequired,
    handleInserRandom: pt.func.isRequired,
    handleSyncViaMethod: pt.func.isRequired,
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
    // If the user has visited this route directly then the initial data will already be
    // in the store (hydrated by the `preparePubSubStore`). In this case we don't need
    // to do anything (`preparePubSubStore` will have set `isPubSubInitialised` to
    // let us know that).
    //
    // If we're coming from another route then we won't have any data yet, so we need
    // to fetch it now. The next time we visit this route, the store will still
    // contain the data.

    const {
      isPubSubInitialised,
      markPubSubAsInitialised,
      PubSubStore,
      handleSyncViaMethod,
    } = this.props;

    if (!isPubSubInitialised) {
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

  // SSR requirements for this component
  ssr = {
    // If you supply a `prepareStore` function then it will be called to hydrate the store
    // for server-side-rendering. This pre-hydrated store will also be send with the initial
    // HTML payload.
    //
    // Here we prepare the PubSub store. Note however that this doesn't mean that the data
    // we always be available on the client. The store will only be pre-hydrated if this component
    // has been rendered on the server. If the client visits the route from another one after
    // the app is loaded then we'll need to get the data during initialisation.
    prepareStore: preparePubSubStore,
  };

  render() {
    const {
      PubSubStore, isPubSubSubscribed, buildDate,
      handleSubscribe, handleInserRandom, handleSyncViaMethod,
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
        <button style={styles.button} onClick={handleInserRandom}>
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
    handleInserRandom() {
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
