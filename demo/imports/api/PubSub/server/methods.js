import { logger } from 'meteor/ssrwpo:ssr';
import faker from 'faker';
import PubSub from '..';

function insertRandomPubSubItem() {
  PubSub.insert({
    avatar: faker.internet.avatar(),
    email: faker.internet.email(),
    lastMod: (new Date()).valueOf(),
  });
  logger.info('PubSub item inserted');
}

export {
  // eslint-disable-next-line import/prefer-default-export
  insertRandomPubSubItem,
};
