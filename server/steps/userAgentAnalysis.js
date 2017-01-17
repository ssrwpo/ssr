import { useragent } from '../utils/peerDependencies';

// Impure function
/* eslint-disable no-param-reassign */
const userAgentAnalysis = (stepResults) => {
  const res = useragent.lookup(stepResults.req.headers['user-agent']);
};
export default userAgentAnalysis;
