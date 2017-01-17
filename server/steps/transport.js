import shouldForce200 from '../shouldForce200';

// Un-pure function
/* eslint-disable no-param-reassign */
const transport = (stepResults) => {
  const formerHash = stepResults.req.headers && stepResults.req.headers['if-none-match'];
  if (stepResults.statusCode === 200 && formerHash && formerHash === stepResults.hash) {
    const callerIp = stepResults.req.socket && stepResults.req.socket.remoteAddress
      ? stepResults.req.socket.remoteAddress
      : 'undefined';
    if (!shouldForce200(callerIp)) {
      stepResults.statusCode = 304;
    }
  }
  stepResults.req.res.statusCode = stepResults.statusCode;
  switch (stepResults.statusCode) {
    // OK
    case 200:
      stepResults.req.dynamicHead = stepResults.head;
      stepResults.req.dynamicBody = stepResults.body;
      stepResults.res.set({ ETag: stepResults.hash, 'Cache-Control': 'public, no-cache' });
      stepResults.next();
      break;
    // Redirect
    case 301:
      stepResults.res.writeHead(301, { Location: stepResults.Location });
      stepResults.res.end();
      break;
    // Not modified
    case 304:
      stepResults.res.writeHead(304);
      stepResults.res.end();
      break;
    // Not found
    case 404:
      stepResults.req.res.statusMessage = 'Not found';
      stepResults.req.dynamicHead = stepResults.head;
      stepResults.req.dynamicBody = stepResults.body;
      stepResults.next();
      break;
    default:
  }
};
export default transport;
