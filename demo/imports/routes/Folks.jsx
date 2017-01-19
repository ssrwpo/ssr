import React, { PropTypes } from 'react';
import Helmet from 'react-helmet';
import { connect } from 'react-redux';

const Folks = ({ folks }) => (
  <div>
    <Helmet title="Folks" />
    <h2>Folks</h2>
    {
      folks.map(folk => <p key={folk.id}>{folk.name}</p>)
    }
  </div>
);
Folks.propTypes = {
  folks: PropTypes.array.isRequired,
};
export default connect(state => ({ folks: state.Folks }))(Folks);
