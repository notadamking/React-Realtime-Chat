import { PubSub, SubscriptionManager } from 'graphql-subscriptions';
import schema from '../schema';

const pubsub = new PubSub();
const subscriptionManager = new SubscriptionManager({
  schema,
  pubsub,
  setupFunctions: {
    messageAdded: () => ({
      messageAdded: (message) => message.id !== '0',
    }),
    messageDeleted: () => ({
      messageDeleted: (message) => message.id !== '0',
    }),
  },
});

export { subscriptionManager, pubsub };
