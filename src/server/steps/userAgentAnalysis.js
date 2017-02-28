/* eslint-disable no-undef, import/no-extraneous-dependencies, import/no-unresolved, import/extensions, max-len */
import useragent from 'useragent';
/* eslint-enable */
import { valueSet } from '../../shared/actions/utils';

// Impure function
/* eslint-disable no-param-reassign */
const userAgentAnalysis = (stepResults) => {
  const ua = useragent.lookup(stepResults.req.headers['user-agent']);
  const os = ua.os;
  const device = ua.device;
  let platform = 'default';
  if (os.family === 'Android') {
    platform = 'android';
  } else if (device.family === 'iPad') {
    platform = 'ipad';
  } else if (device.family === 'iPhone') {
    platform = 'iphone';
  } else if (ua.family === 'Safari') {
    platform = 'safari';
  } else if (ua.family === 'IE') {
    platform = 'ie';
  }
  stepResults.store.dispatch(valueSet('platform', platform));
  if (stepResults.platformTransformers) {
    stepResults.platformTransformers(stepResults.store.dispatch, platform);
  }
};
export default userAgentAnalysis;
