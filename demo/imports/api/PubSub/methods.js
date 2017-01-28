import { Meteor } from 'meteor/meteor';
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
  run(content) {
    if (Meteor.isServer) {
      serverMethods.insertRandomPubSubItem.call(this, content);
    }
  },
});

export {
  // eslint-disable-next-line import/prefer-default-export
  insertRandomPubSubItem,
};
