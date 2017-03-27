import moment from 'moment';
import _ from 'lodash';
import React, { PropTypes as pt } from 'react';
import { pure, valueReset } from 'meteor/ssrwpo:ssr';
import Helmet from 'react-helmet';
import { connect } from 'react-redux';

const Home = ({
  auth, logout, platform, buildDate,
  retina, mobile, viewportWidth, viewportHeight,
}) => (
  <div>
    <Helmet><title>Home</title></Helmet>
    <h2>Home</h2>
    <p>{auth ? 'Logged in' : 'Logged out'}</p>
    { auth && <p><button onClick={logout}>Log out</button></p>}
    <p>Current platform is: <strong>{platform}</strong></p>
    <p><em>Build date: {moment(buildDate).format('DD/MM/YYYY HH:mm')}</em></p>
    <p>Define as {retina ? 'Retina display' : 'Normal display'}</p>
    <p>Device is considered as mobile? <strong>{mobile ? 'Yes' : 'No'}</strong></p>
    <p>Viewport: <code>{viewportWidth}x{viewportHeight}</code></p>
  </div>
);
Home.propTypes = {
  auth: pt.bool.isRequired,
  logout: pt.func.isRequired,
  platform: pt.string.isRequired,
  buildDate: pt.number.isRequired,
  retina: pt.bool.isRequired,
  mobile: pt.bool.isRequired,
  viewportWidth: pt.number.isRequired,
  viewportHeight: pt.number.isRequired,
};
const mapStateToProps = state => _.pick(state, [
  'auth', 'platform', 'buildDate',
  'retina', 'mobile', 'viewportWidth', 'viewportHeight',
]);
const mapDispatchToProps = dispatch => ({
  logout(e) {
    e.preventDefault();
    dispatch(valueReset('auth'));
  },
});
export default connect(mapStateToProps, mapDispatchToProps)(pure(Home));
