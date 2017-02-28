import { Meteor } from 'meteor/meteor';

const nextTick = Meteor.bindEnvironment(
  fct => Meteor.defer(() => fct()),
);
export default nextTick;
