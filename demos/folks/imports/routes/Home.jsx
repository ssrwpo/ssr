import moment from 'moment';
import pick from 'lodash/pick';
import React, { PropTypes as pt } from 'react';
import { pure, valueSet } from 'meteor/ssrwpo:ssr';
import { Accounts } from 'meteor/accounts-base';
import Helmet from 'react-helmet';
import { connect } from 'react-redux';
// Components
import TransitionButton from '/imports/components/TransitionButton';

const Home = ({
  user, platform, buildDate, userLocale, logout,
  retina, mobile, viewportWidth, viewportHeight,
}) => (
  <div>
    <Helmet title="Home" />
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
    <p>Devive is considered as mobile? <strong>{mobile ? 'Yes' : 'No'}</strong></p>
    <p>Viewport: <code>{viewportWidth}x{viewportHeight}</code></p>
  </div>
);
Home.propTypes = {
  user: pt.oneOfType([
    pt.object,
    pt.bool,
  ]).isRequired,
  platform: pt.string.isRequired,
  buildDate: pt.number.isRequired,
  userLocale: pt.string.isRequired,
  retina: pt.bool.isRequired,
  mobile: pt.bool.isRequired,
  viewportWidth: pt.number.isRequired,
  viewportHeight: pt.number.isRequired,
};
const mapStateToProps = state => pick(state, [
  'user', 'platform', 'buildDate', 'userLocale',
  'retina', 'mobile', 'viewportWidth', 'viewportHeight',
]);

const mapDispatchToProps = dispatch => ({
  logout() {
    Meteor.logout((error) => {
      if (!error) {
        dispatch(valueSet('user', false));
      }
    });
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(pure(Home));
