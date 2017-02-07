import { Meteor } from 'meteor/meteor';
import { logger } from 'meteor/ssrwpo:ssr';
import PubSub, { PubSubPublicationName } from '..';

function pubSubPublic() {
  try {
    return PubSub.find();
  } catch (err) {
    logger.warn('Error while PubSub publishing', err.toString());
    return this.ready();
  }
}
Meteor.publish(PubSubPublicationName, pubSubPublic);
