import { Mongo } from 'meteor/mongo';

const PubSub = new Mongo.Collection('PubSub');
const PubSubPublicationName = 'PubSub.public';

export default PubSub;
export {
  PubSubPublicationName,
};
