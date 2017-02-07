import { logger } from 'meteor/ssrwpo:ssr';
import faker from 'faker';
import PubSub from '..';

function insertRandomPubSubItem() {
  const res = PubSub.insert({
    avatar: faker.internet.avatar(),
    email: faker.internet.email(),
    lastMod: (new Date()).valueOf(),
  });
  logger.info('PubSub item inserted', res);
}

function updatePubSubItem({ id }) {
  const res = PubSub.update(id, {
    $set: {
      avatar: faker.internet.avatar(),
      email: faker.internet.email(),
      lastMod: (new Date()).valueOf(),
    },
  });
  logger.info('PubSub item updated', id, res);
}

function removePubSubItem({ id }) {
  const res = PubSub.remove(id);
  logger.info('PubSub item removed', id, res);
}

function getPubSubValues() {
  const res = PubSub.find().fetch();
  logger.info(
    'getPubSubValues',
    res.length, 'items',
  );
  return res;
}

export {
  insertRandomPubSubItem,
  updatePubSubItem,
  removePubSubItem,
  getPubSubValues,
};
