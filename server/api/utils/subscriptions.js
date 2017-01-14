import { PubSub, SubscriptionManager } from 'graphql-subscriptions';
import schema from '../schema';

const pubsub = new PubSub();
const subscriptionManager = new SubscriptionManager({
  schema,
  pubsub,
  setupFunctions: {
    channelsInRoomChanged: (options, args) => ({
      channelsInRoomChanged: {
        filter: (update) => update.room === args.room,
      },
    }),
    messageAdded: (options, args) => ({
      messageAdded: {
        filter: (message) => message.room === args.room && message.channel === args.channel,
      },
    }),
    messageDeleted: (options, args) => ({
      messageDeleted: {
        filter: (message) => message.room === args.room && message.channel === args.channel,
      },
    }),
    usersInRoomChanged: (options, args) => ({
      usersInRoomChanged: {
        filter: (update) => update.room === args.room,
      },
    }),
  },
});

export { subscriptionManager, pubsub };
