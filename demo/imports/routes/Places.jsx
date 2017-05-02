import React from 'react';
import PropTypes from 'prop-types';
import { pure } from 'meteor/ssrwpo:ssr';
import Helmet from 'react-helmet';
import { connect } from 'react-redux';

const Places = ({ places }) => (
  <div>
    <Helmet><title>Places</title></Helmet>
    <h2>Places</h2>
    {places.map(place => <p key={place.id}>{place.address}</p>)}
  </div>
);

Places.propTypes = {
  places: PropTypes.array.isRequired,
};

// state.Places is the the redux store that was pre-hydrated from the Mongo collection by
// the server. The hydration was performed by `prepareGlobalStores`.
export default connect(state => ({ places: state.Places }))(pure(Places));
