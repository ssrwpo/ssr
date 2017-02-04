const webhooks = {
  // eslint-disable-next-line no-unused-vars
  '/api/ready': (req, res, next) => {
    res.set('Content-Type', 'application/json');
    res.end(JSON.stringify({ ready: true }));
  },
};

export default webhooks;
