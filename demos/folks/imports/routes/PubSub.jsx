import React, { PureComponent, PropTypes as pt } from 'react';
import once from 'lodash/once';
import {
  logger, pure,
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
