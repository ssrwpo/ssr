import React, { PureComponent, PropTypes as pt } from 'react';
import { logger } from 'meteor/ssrwpo:ssr';
import moment from 'moment';
import Helmet from 'react-helmet';
import { connect } from 'react-redux';
import { insertRandomPubSubItem } from '/imports/api/PubSub';

class PubSub extends PureComponent {
  static propTypes = {
    pubSubs: pt.array.isRequired,
  }
  handleInserRandom() {
    insertRandomPubSubItem.callPromise()
    .then(() => logger.info('Item inserted'))
    .catch(err => logger.warn('Insertion failed', err.toString()));
  }
  render() {
    const { pubSubs } = this.props;
    return (
      <div>
        <Helmet title="Reactive cases" />
        <h2>Reactive cases</h2>
        <hr />
        <button onClick={this.handleInserRandom}>Insert a random item</button>
        <hr />
        {
          pubSubs.map(item =>
            <p key={item.id}>
              <img src={item.avatar} alt={item.email} width={30} height={30} style={{ verticalAlign: 'middle' }} />&nbsp;
              <strong>{item.email}</strong>&nbsp;-&nbsp;
              <small>{moment(item.lastMod).format('DD/MM/YY - HH:mm:ss')}</small>
            </p>,
          )
        }
      </div>
    );
  }
}

export default connect(state => ({ pubSubs: state.PubSub }))(PubSub);
