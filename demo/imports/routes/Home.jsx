import moment from 'moment';
import pick from 'lodash/pick';
import React, { PropTypes } from 'react';
import { pure, valueReset } from 'meteor/ssrwpo:ssr';
import Helmet from 'react-helmet';
import { connect } from 'react-redux';

const Home = ({ auth, logout, platform, buildDate, retina }) => (
  <div>
    <Helmet title="Home" />
    <h2>Home</h2>
    <p>{auth ? 'Logged in' : 'Logged out'}</p>
    { auth && <p><button onClick={logout}>Log out</button></p>}
    <p>Current platform is: <strong>{platform}</strong></p>
    <p><em>Build date: {moment(buildDate).format('DD/MM/YYYY HH:mm')}</em></p>
    <p>Define as {retina ? 'Retina display' : 'Normal display'} by server</p>
  </div>
);
Home.propTypes = {
  auth: PropTypes.bool.isRequired,
  logout: PropTypes.func.isRequired,
  platform: PropTypes.string.isRequired,
  buildDate: PropTypes.number.isRequired,
  retina: PropTypes.bool.isRequired,
};
const mapStateToProps = state => pick(state, ['auth', 'platform', 'buildDate', 'retina']);
const mapDispatchToProps = dispatch => ({
  logout(e) {
    e.preventDefault();
    dispatch(valueReset('auth'));
  },
});
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(pure(Home));
