import { logger } from 'meteor/ssrwpo:ssr';
import { fake } from 'faker';
import Folks from '..';

if (Folks.find().count() === 0) {
  // Create 10 fake items
  Array.from(Array(10).keys(), order =>
    Folks.insert({
      name: fake('{{name.lastName}} {{name.firstName}}'),
      order,
      lastMod: new Date(),
    }),
  );
  logger.info('Fixtures created for Folks');
}
