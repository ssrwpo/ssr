import React, { PropTypes } from 'react';
import Helmet from 'react-helmet';
import { connect } from 'react-redux';

const Places = ({ places }) => (
  <div>
    <Helmet title="Places" />
    <h2>Places</h2>
    {
      places.map(place => <p key={place.id}>{place.address}</p>)
    }
  </div>
);
Places.propTypes = {
  places: PropTypes.array.isRequired,
};
export default connect(state => ({ places: state.Places }))(Places);
