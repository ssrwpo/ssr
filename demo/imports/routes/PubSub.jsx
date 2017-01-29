import React, { PureComponent, PropTypes as pt } from 'react';
import { logger, valueSet } from 'meteor/ssrwpo:ssr';
import moment from 'moment';
import Helmet from 'react-helmet';
import { connect } from 'react-redux';
import { insertRandomPubSubItem } from '/imports/api/PubSub';

class PubSub extends PureComponent {
  static propTypes = {
    pubSubs: pt.array.isRequired,
    isPubSubSubscribed: pt.bool.isRequired,
    handleSubscribe: pt.func.isRequired,
    handleInserRandom: pt.func.isRequired,
  }
  render() {
    const { pubSubs, isPubSubSubscribed, handleSubscribe, handleInserRandom } = this.props;
    const styles = {
      button: { marginRight: '1em' },
      img: { verticalAlign: 'middle' },
    };
    return (
      <div>
        <Helmet title="Reactive cases" />
        <h2>Reactive cases</h2>
        <hr />
        <button style={styles.button} onClick={() => handleSubscribe(isPubSubSubscribed)}>
          {isPubSubSubscribed ? 'Unsubscribe' : 'Subscribe'} to collection
        </button>
        <button style={styles.button} onClick={handleInserRandom}>
          Insert a random item
        </button>
        <hr />
        {
          pubSubs.map(item =>
            <p key={item.id}>
              <img
                src={item.avatar} alt={item.email} width={30} height={30} style={styles.img}
              />&nbsp;
              <strong>{item.email}</strong>&nbsp;-&nbsp;
              <small>{moment(item.lastMod).format('DD/MM/YY - HH:mm:ss')}</small>
            </p>,
          )
        }
      </div>
    );
  }
}

export default connect(
  state => ({
    pubSubs: state.PubSub,
    isPubSubSubscribed: state.isPubSubSubscribed,
  }),
  dispatch => ({
    handleSubscribe(isPubSubSubscribed) {
      dispatch(valueSet('isPubSubSubscribed', !isPubSubSubscribed));
    },
    handleInserRandom() {
      insertRandomPubSubItem.callPromise()
      .then(() => logger.info('Item inserted'))
      .catch(err => logger.warn('Insertion failed', err.toString()));
    },
  }),
)(PubSub);
