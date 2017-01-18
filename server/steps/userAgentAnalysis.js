/* eslint-disable no-undef, import/no-extraneous-dependencies, import/no-unresolved, import/extensions, max-len */
import useragent from 'useragent';
/* eslint-enable */
import { platform } from '../../shared/actions';

// Impure function
/* eslint-disable no-param-reassign */
const userAgentAnalysis = (stepResults) => {
  const ua = useragent.lookup(stepResults.req.headers['user-agent']);
  const os = ua.os;
  const device = ua.device;
  let res = 'default';
  if (os.family === 'Android') {
    res = 'android';
  } else if (device.family === 'iPad') {
    res = 'ipad';
  } else if (device.family === 'iPhone') {
    res = 'iphone';
  } else if (ua.family === 'Safari') {
    res = 'safari';
  } else if (ua.family === 'IE') {
    res = 'ie';
  }
  stepResults.store.dispatch(platform.set(res));
};
export default userAgentAnalysis;
