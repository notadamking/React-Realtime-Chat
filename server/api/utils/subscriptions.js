import { PubSub, SubscriptionManager } from 'graphql-subscriptions';
import schema from '../schema';

const pubsub = new PubSub();
const subscriptionManager = new SubscriptionManager({
  schema,
  pubsub,
  setupFunctions: {
    commentFeedUpdated: () => ({
      commentFeedChannel: (feedUpdate) => feedUpdate.comment.id !== '0',
    }),
  },
});

export { subscriptionManager, pubsub };
