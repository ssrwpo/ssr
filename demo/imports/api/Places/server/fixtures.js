import { logger } from 'meteor/ssrwpo:ssr';
import { fake } from 'faker';
import Places from '..';

if (Places.find().count() === 0) {
  // Create 20 fake items
  Array.from(Array(20).keys(), order =>
    Places.insert({
      address: fake('{{address.streetAddress}} - {{address.city}} - {{address.country}}'),
      order,
      lastMod: (new Date()).valueOf(),
    }),
  );
  logger.info('Fixtures created for Places');
}
