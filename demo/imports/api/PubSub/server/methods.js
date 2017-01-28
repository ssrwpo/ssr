import { logger } from 'meteor/ssrwpo:ssr';
import PubSub from '..';

function insertRandomPubSubItem() {
  logger.info('PubSub item inserted');
}

export {
  // eslint-disable-next-line import/prefer-default-export
  insertRandomPubSubItem,
};
