import moment from 'moment';
import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import { pure, valueSet, valueReset } from 'meteor/ssrwpo:ssr';
import Helmet from 'react-helmet';
import { connect } from 'react-redux';
// Components
import TransitionButton from '/imports/components/TransitionButton';

const Home = ({
  user, platform, buildDate, userLocale, logout,
  retina, mobile, viewportWidth, viewportHeight,
}) => (
  <div>
    <Helmet><title>Home</title></Helmet>
    <h2>Home</h2>
    {/* Programmatic transitions */}
    <TransitionButton href="/topics">Go to topics</TransitionButton>
    <hr />
    <p>{user ? `Logged in as : ${user.emails[0].address}` : 'Logged out'}</p>
    {user && <button onClick={() => logout()}>Log out</button>}
    <p>Current platform is: <strong>{platform}</strong></p>
    <p>Current user language is: <strong>{userLocale}</strong></p>
    <p><em>Build date: {moment(buildDate).format('DD/MM/YYYY HH:mm')}</em></p>
    <p>Define as {retina ? 'Retina display' : 'Normal display'}</p>
    <p>Device is considered as mobile? <strong>{mobile ? 'Yes' : 'No'}</strong></p>
    <p>Viewport: <code>{viewportWidth}x{viewportHeight}</code></p>
  </div>
);
Home.propTypes = {
  user: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]).isRequired,
  logout: PropTypes.func.isRequired,
  platform: PropTypes.string.isRequired,
  buildDate: PropTypes.number.isRequired,
  retina: PropTypes.bool.isRequired,
  mobile: PropTypes.bool.isRequired,
  viewportWidth: PropTypes.number.isRequired,
  viewportHeight: PropTypes.number.isRequired,
};
const mapStateToProps = state => _.pick(state, [
  'user', 'platform', 'buildDate', 'userLocale',
  'retina', 'mobile', 'viewportWidth', 'viewportHeight',
]);

const mapDispatchToProps = dispatch => ({
  logout() {
    Meteor.logout((error) => {
      if (!error) dispatch(valueSet('user', false));
    });
  },
});
export default connect(mapStateToProps, mapDispatchToProps)(pure(Home));
