import PropTypes from 'prop-types';
import { Meteor } from 'meteor/meteor';
import { logger, pure } from 'meteor/ssrwpo:ssr';
import { withRouter } from 'react-router-dom';

const TransitionLogger = ({ location }) => {
  if (Meteor.isClient) {
    logger.info('Client side only log for route transition', location);
  }
  return null;
};
TransitionLogger.propTypes = {
  location: PropTypes.object.isRequired,
};
export default withRouter(pure(TransitionLogger));
