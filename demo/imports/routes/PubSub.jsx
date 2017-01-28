import React, { PropTypes } from 'react';
import moment from 'moment';
import { pure } from 'meteor/ssrwpo:ssr';
import Helmet from 'react-helmet';
import { connect } from 'react-redux';

const PubSub = ({ pubSubs }) => (
  <div>
    <Helmet title="Reactive cases" />
    <h2>Reactive cases</h2>
    {
      pubSubs.map(item =>
        <p key={item.id} style={{ verticalAlign: 'middle' }}>
          <img src={item.avatar} alt={item.email} width={30} height={30} />&nbsp;
          <strong>{item.email}</strong>&nbsp;-&nbsp;
          <small>{moment(item.lastMod).format('DD/MM/YY - HH:mm:ss')}</small>
        </p>,
      )
    }
  </div>
);
PubSub.propTypes = {
  pubSubs: PropTypes.array.isRequired,
};
export default connect(state => ({ pubSubs: state.PubSub }))(pure(PubSub));
