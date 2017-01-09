import { PubSub, SubscriptionManager } from 'graphql-subscriptions';
import schema from '../schema';

const pubsub = new PubSub();
const subscriptionManager = new SubscriptionManager({
  schema,
  pubsub,
  setupFunctions: {
    messageFeedUpdated: () => ({
      messageFeedChannel: (feedUpdate) => feedUpdate.message.id !== '0',
    }),
  },
});

export { subscriptionManager, pubsub };
