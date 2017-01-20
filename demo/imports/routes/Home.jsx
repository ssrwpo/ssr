import moment from 'moment';
import pick from 'lodash/pick';
import React, { PropTypes } from 'react';
import Helmet from 'react-helmet';
import { connect } from 'react-redux';
import { auth as authAction } from '/imports/actions';

const Home = ({ auth, logout, platform, buildDate }) => (
  <div>
    <Helmet title="Home" />
    <h2>Home</h2>
    <p>{auth ? 'Logged in' : 'Logged out'}</p>
    { auth && <p><button onClick={logout}>Log out</button></p>}
    <p>Current platform is: <strong>{platform}</strong></p>
    <p><em>Build date: {moment(buildDate).format('DD/MM/YYYY HH:mm')}</em></p>
  </div>
);
Home.propTypes = {
  auth: PropTypes.bool.isRequired,
  logout: PropTypes.func.isRequired,
  platform: PropTypes.string.isRequired,
  buildDate: PropTypes.number.isRequired,
};
const mapStateToProps = state => pick(state, ['auth', 'platform', 'buildDate']);
const mapDispatchToProps = dispatch => ({
  logout(e) {
    e.preventDefault();
    dispatch(authAction.logout());
  },
});
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Home);
