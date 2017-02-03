import React, { PropTypes as pt } from 'react';
import { pure } from 'meteor/ssrwpo:ssr';
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
  places: pt.array.isRequired,
};
export default connect(state => ({ places: state.Places }))(pure(Places));
