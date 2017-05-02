import React, { PureComponent } from 'react';
import {
  logger, pure,
  // Helpers for collectionStore synchronization
  createHandleSubscribe, createHandleSyncViaMethod,
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
  isPubSubSubscribed: PropTypes.bool.isRequired,
  id: PropTypes.string.isRequired,
  avatar: PropTypes.string.isRequired,
  email: PropTypes.string.isRequired,
  lastMod: PropTypes.number.isRequired,
};

Item = pure(Item);

class PubSub extends PureComponent {
  static propTypes = {
    buildDate: PropTypes.number.isRequired,
    PubSubStore: PropTypes.array.isRequired,
    isPubSubSubscribed: PropTypes.bool.isRequired,
    handleSubscribe: PropTypes.func.isRequired,
    handleInserRandom: PropTypes.func.isRequired,
    handleSyncViaMethod: PropTypes.func.isRequired,
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
        <Helmet><title>Reactive cases</title></Helmet>
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
  }),
  dispatch => ({
    handleSubscribe: createHandleSubscribe(
      dispatch,
      PubSubPublicationName,
      PubSubCol.find(),
      'isPubSubSubscribed',
      'PubSub',
    ),
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
