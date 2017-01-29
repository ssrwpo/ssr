import React, { PureComponent, PropTypes as pt } from 'react';
import { Meteor } from 'meteor/meteor';
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

let Item = ({ id, avatar, email, lastMod }) => (
  <p>
    <img
      src={avatar} alt={email} width={30} height={30} style={styles.img}
    />&nbsp;
    <strong>{email}</strong>&nbsp;-&nbsp;
    <small>{moment(lastMod).format('DD/MM/YY - HH:mm:ss')}</small>
  </p>
);
Item.propTypes = {
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
          onClick={() => handleSubscribe(this, isPubSubSubscribed, buildDate)}
        >
          {isPubSubSubscribed ? 'Unsubscribe' : 'Subscribe'} to collection
        </button>
        <button style={styles.button} onClick={handleInserRandom}>
          Insert a random item
        </button>
        <hr />
        {
          pubSubs
          .sort(item => item.lastMod)
          .map(item => <Item key={item.id} {...item} />)
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
    handleSubscribe(context, isPubSubSubscribed, buildDate) {
      const newState = !isPubSubSubscribed;
      dispatch(valueSet('isPubSubSubscribed', !isPubSubSubscribed));
      if (newState) {
        // eslint-disable-next-line no-param-reassign
        context.query = null;
        // eslint-disable-next-line no-param-reassign
        context.sub = Meteor.subscribe(
          PubSubPublicationName,
          { lastMod: buildDate },
          () => {
            console.log(PubSubPublicationName, 'ready');
            // eslint-disable-next-line no-param-reassign
            context.query = PubSubCol.find().observeChanges({
              added(id, fields) {
                console.log('store add', id);
                dispatch(collectionAdd('PubSub', id, fields));
              },
              changed(id, fields) {
                console.log('store changed', id);
                dispatch(collectionChange('PubSub', id, fields));
              },
              removed(id) {
                console.log('store removed', id);
                // dispatch(collectionRemove('PubSub', id));
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
