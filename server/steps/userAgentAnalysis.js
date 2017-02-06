/* eslint-disable no-undef, import/no-extraneous-dependencies, import/no-unresolved, import/extensions, max-len */
import useragent from 'useragent';
/* eslint-enable */

// Impure function
/* eslint-disable no-param-reassign */
const userAgentAnalysis = (stepResults) => {
  const ua = useragent.lookup(stepResults.req.headers['user-agent']);
  const os = ua.os;
  const device = ua.device;
  if (os.family === 'Android') {
    stepResults.userAgent = 'android';
  } else if (device.family === 'iPad') {
    stepResults.userAgent = 'ipad';
  } else if (device.family === 'iPhone') {
    stepResults.userAgent = 'iphone';
  } else if (ua.family === 'Safari') {
    stepResults.userAgent = 'safari';
  } else if (ua.family === 'IE') {
    stepResults.userAgent = 'ie';
  } else if (ua.family === 'Firefox') {
    stepResults.userAgent = 'firefox';
  }
};
export default userAgentAnalysis;
