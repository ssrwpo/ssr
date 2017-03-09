import bodyParser from 'body-parser';
import { logger } from 'meteor/ssrwpo:ssr';

const urlencodedParser = bodyParser.urlencoded({ extended: false });

// For more details see: https://github.com/expressjs/body-parser#express-route-specific
const webhooks = (app) => {
  // eslint-disable-next-line no-unused-vars
  app.post('/api/ready', urlencodedParser, (req, res, next) => {
    logger.info('Called with:', req.body);
    res.set('Content-Type', 'application/json');
    res.end(JSON.stringify({ ready: true }));
  });
};

export default webhooks;
