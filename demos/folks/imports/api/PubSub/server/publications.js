import { Meteor } from 'meteor/meteor';
import { logger } from 'meteor/ssrwpo:ssr';
import { check } from 'meteor/check';
import PubSub, { PubSubPublicationName } from '..';

function pubSubPublic({ lastMod }) {
  try {
    check(lastMod, Number);
    return PubSub.find({ lastMod: { $gte: lastMod } });
  } catch (err) {
    logger.warn('Error while PubSub publishing', err.toString());
    return this.ready();
  }
}
Meteor.publish(PubSubPublicationName, pubSubPublic);
