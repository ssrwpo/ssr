import { logger } from 'meteor/ssrwpo:ssr';
import faker from 'faker';
import PubSub from '..';

if (PubSub.find().count() === 0) {
  // Create 5 fake items
  Array.from(Array(5).keys(), () =>
    PubSub.insert({
      avatar: faker.internet.avatar(),
      email: faker.internet.email(),
      lastMod: (new Date()).valueOf(),
    }),
  );
  logger.info('Fixtures created for PubSub');
}
