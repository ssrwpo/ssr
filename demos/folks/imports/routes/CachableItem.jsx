import React, { PropTypes as pt } from 'react';
import moment from 'moment';
import { pure } from 'meteor/ssrwpo:ssr';
import { updatePubSubItem, removePubSubItem } from '/imports/api/PubSub';

const styles = {
  img: { verticalAlign: 'middle' },
};

class CachableItem extends React.Component {
  static propTypes = {
    isPubSubSubscribed: pt.bool.isRequired,
    id: pt.string.isRequired,
    avatar: pt.string.isRequired,
    email: pt.string.isRequired,
    lastMod: pt.number.isRequired,
  }

  static ssr = {
    cacheConfig: {
      strategy: 'simple',
      enable: true,
    },
  }

  render() {
    const { isPubSubSubscribed, id, avatar, email, lastMod } = this.props;
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
  }
}

export default pure(CachableItem);
