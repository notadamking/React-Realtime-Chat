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
        filter: (message) => {
          if (message.channel.charAt(0) === '@') {
            return message.room === args.room
              && ((message.channel === args.channel.slice(1)
                && message.author.username === args.username)
              || (args.channel.slice(1) === message.author.username
                && message.otherUser.username === args.username));
          }
          return message.room === args.room && message.channel === args.channel;
        },
      },
    }),
    messageDeleted: (options, args) => ({
      messageDeleted: {
        filter: (message) => {
          if (message.channel.charAt(0) === '@') {
            return message.room === args.room
              && ((message.channel === args.channel.slice(1)
                && message.author.username === args.username)
              || (args.channel.slice(1) === message.author.username
                && message.otherUser.username === args.username));
          }
          return message.room === args.room && message.channel === args.channel;
        },
      },
    }),
    onlineUsersChanged: (options, args) => ({
      onlineUsersChanged: {
        filter: (update) => update.room === args.room,
      },
    }),
  },
});

export { subscriptionManager, pubsub };
