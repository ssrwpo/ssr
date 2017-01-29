import React, { PureComponent, PropTypes as pt } from 'react';
import { Meteor } from 'meteor/meteor';
import omit from 'lodash/omit';
import isEqual from 'lodash/isEqual';
import {
  logger, pure, valueSet, collectionAdd, collectionChange, collectionRemove,
} from 'meteor/ssrwpo:ssr';
import moment from 'moment';
import Helmet from 'react-helmet';
import { connect } from 'react-redux';
import PubSubCol, {
  PubSubPublicationName,
  insertRandomPubSubItem, updatePubSubItem, removePubSubItem,
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
    pubSubs: pt.array.isRequired,
    isPubSubSubscribed: pt.bool.isRequired,
    handleSubscribe: pt.func.isRequired,
    handleInserRandom: pt.func.isRequired,
  }
  componentWillUnmount() {
    const { isPubSubSubscribed, handleSubscribe, buildDate } = this.props;
    if (isPubSubSubscribed) {
      handleSubscribe(this, isPubSubSubscribed, buildDate);
    }
  }
  render() {
    const {
      pubSubs, isPubSubSubscribed, handleSubscribe, handleInserRandom, buildDate,
    } = this.props;
    return (
      <div>
        <Helmet title="Reactive cases" />
        <h2>Reactive cases</h2>
        <hr />
        <button
          style={styles.button}
          onClick={() => handleSubscribe(this, isPubSubSubscribed, buildDate, pubSubs)}
        >
          {isPubSubSubscribed ? 'Unsubscribe' : 'Subscribe'} to collection
        </button>
        <button style={styles.button} onClick={handleInserRandom}>
          Insert a random item
        </button>
        <hr />
        {
          pubSubs
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
    pubSubs: state.PubSub,
    isPubSubSubscribed: state.isPubSubSubscribed,
  }),
  dispatch => ({
    handleSubscribe(context, isPubSubSubscribed, buildDate, pubSubs) {
      const newState = !isPubSubSubscribed;
      dispatch(valueSet('isPubSubSubscribed', !isPubSubSubscribed));
      if (newState) {
        // Find the first appropriate date
        const since = pubSubs.reduce((acc, item) => Math.min(buildDate, item.lastMod));
        // eslint-disable-next-line no-param-reassign
        context.query = null;
        // Subscribe to collection
        // eslint-disable-next-line no-param-reassign
        context.sub = Meteor.subscribe(
          PubSubPublicationName,
          { lastMod: since },
          () => {
            console.log(PubSubPublicationName, 'ready');
            // Check for removed items and changed items
            const fromCollection = PubSubCol.find().fetch();
            const dispatchActions = [];
            pubSubs.forEach((storeItem) => {
              // eslint-disable-next-line no-underscore-dangle
              const colItemIdx = fromCollection.findIndex(item => item._id === storeItem.id);
              if (colItemIdx !== -1) {
                // Check for updated items
                const colFields = omit(fromCollection[colItemIdx], '_id');
                const storeFields = omit(storeItem, 'id');
                if (!isEqual(colFields, storeFields)) {
                  dispatchActions.push(collectionAdd('PubSub', storeItem.id, colFields));
                }
              } else {
                // Item is not anymore in the collection and must be removed from store
                dispatchActions.push(collectionRemove('PubSub', storeItem.id));
              }
            });
            dispatchActions.forEach(action => dispatch(action));
            // eslint-disable-next-line no-param-reassign
            context.query = PubSubCol.find().observeChanges({
              added(id, fields) {
                console.log('store adding?', id);
                if (pubSubs.findIndex(item => item.id === id) === -1) {
                  console.log('store added', id);
                  dispatch(collectionAdd('PubSub', id, fields));
                }
              },
              changed(id, fields) {
                console.log('store changed', id);
                dispatch(collectionChange('PubSub', id, fields));
              },
              removed(id) {
                console.log('store removed', id);
                dispatch(collectionRemove('PubSub', id));
              },
            });
          },
        );
      } else {
        if (context.query) {
          context.query.stop();
        }
        context.sub.stop();
        console.log(PubSubPublicationName, 'stop');
      }
    },
    handleInserRandom() {
      insertRandomPubSubItem.callPromise()
      .then(() => logger.info('Item inserted'))
      .catch(err => logger.warn('Insertion failed', err.toString()));
    },
  }),
)(PubSub);
