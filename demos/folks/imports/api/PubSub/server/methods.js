import moment from 'moment';
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

function valuesFromLastMod({ lastMod }) {
  const res = PubSub.find({ lastMod: { $gte: lastMod } }).fetch();
  logger.info(
    'PubSub get values from lastMod', moment(lastMod).format('DD/MM/YY - HH:mm:ss'),
    res.length, 'items',
  );
  return res;
}

export {
  insertRandomPubSubItem,
  updatePubSubItem,
  removePubSubItem,
  valuesFromLastMod,
};
