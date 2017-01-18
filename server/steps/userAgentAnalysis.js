/* eslint-disable no-undef, import/no-extraneous-dependencies, import/no-unresolved, import/extensions, max-len */
import useragent from 'useragent';
/* eslint-enable */

// Impure function
/* eslint-disable no-param-reassign */
const userAgentAnalysis = (stepResults) => {
  const res = useragent.lookup(stepResults.req.headers['user-agent']);
};
export default userAgentAnalysis;
