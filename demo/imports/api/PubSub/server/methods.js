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

function updatePubSubItem({ id }) {
  PubSub.update(id, {
    $set: {
      avatar: faker.internet.avatar(),
      email: faker.internet.email(),
      lastMod: (new Date()).valueOf(),
    },
  });
  logger.info('PubSub item updated');
}
function removePubSubItem({ id }) {
  PubSub.remove(id);
  logger.info('PubSub item removed');
}

export {
  insertRandomPubSubItem,
  updatePubSubItem,
  removePubSubItem,
};
