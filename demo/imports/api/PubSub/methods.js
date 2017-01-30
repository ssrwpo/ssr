import { Meteor } from 'meteor/meteor';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { CallPromiseMixin } from 'meteor/didericis:callpromise-mixin';

let serverMethods = null;
if (Meteor.isServer) {
  // eslint-disable-next-line global-require
  serverMethods = require('./server/methods');
}

const insertRandomPubSubItem = new ValidatedMethod({
  name: 'PubSub.methods.insertRandom',
  validate: null,
  mixins: [CallPromiseMixin],
  run() {
    if (Meteor.isServer) {
      serverMethods.insertRandomPubSubItem.call(this);
    }
  },
});

const updatePubSubItem = new ValidatedMethod({
  name: 'PubSub.methods.update',
  validate: new SimpleSchema({ id: { type: String } }).validator(),
  mixins: [CallPromiseMixin],
  run(content) {
    if (Meteor.isServer) {
      serverMethods.updatePubSubItem.call(this, content);
    }
  },
});

const removePubSubItem = new ValidatedMethod({
  name: 'PubSub.methods.remove',
  validate: new SimpleSchema({ id: { type: String } }).validator(),
  mixins: [CallPromiseMixin],
  run(content) {
    if (Meteor.isServer) {
      serverMethods.removePubSubItem.call(this, content);
    }
  },
});

const valuesFromLastMod = new ValidatedMethod({
  name: 'PubSub.methods.valuesFromLastMod',
  validate: new SimpleSchema({ lastMod: { type: Number } }).validator(),
  mixins: [CallPromiseMixin],
  run(content) {
    if (Meteor.isServer) {
      return serverMethods.valuesFromLastMod.call(this, content);
    }
    return [];
  },
});

export {
  insertRandomPubSubItem,
  updatePubSubItem,
  removePubSubItem,
  valuesFromLastMod,
};
