/* eslint-disable no-undef, import/no-extraneous-dependencies, import/no-unresolved, import/extensions, max-len */
import useragent from 'useragent';
/* eslint-enable */

// Impure function
/* eslint-disable no-param-reassign */
const userAgentAnalysis = (stepResults) => {
  const res = useragent.lookup(stepResults.req.headers['user-agent']);
  const os = res.os;
  const device = res.device;
  if (os.family === 'Android') {
    stepResults.platform = 'android';
  } else if (device.family === 'iPad') {
    stepResults.platform = 'ipad';
  } else if (device.family === 'iPhone') {
    stepResults.platform = 'iphone';
  } else if (res.family === 'Safari') {
    stepResults.platform = 'safari';
  } else if (res.family == 'IE') {
    stepResults.platform = 'ie';
  }
};
export default userAgentAnalysis;
