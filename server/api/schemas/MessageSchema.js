import { UserSchema } from './';

const types = `
  type Message {
    id: ID!
    room: String!
    channel: String!
    content: String!
    createdAt: String!
    updatedAt: String!
    author: User!
  }

  type ChannelsInRoomUpdate {
    room: String!
    channels: [String]!
  }
`;

const queries = `
  channelsForRoom(room: String!): [String]
  messages(room: String!, channel: String!, offset: Int, limit: Int): [Message]
`;

const mutations = `
  postMessage(room: String!, channel: String!, content: String!): Message
  deleteMessage(id: ID!): Message
`;

const subscriptions = `
  channelsInRoomChanged(room: String!): ChannelsInRoomUpdate
  messageAdded(room: String!, channel: String!): Message
  messageDeleted(room: String!, channel: String!): Message
`;

const resolvers = {
  Query: {
    channelsForRoom: async (root, { room }, context) => {
      return await context.Message.getChannelsForRoom(room);
    },
    messages: async (root, { room, channel, offset, limit }, context) => {
      return await context.Message.getMessages({ room, channel, offset, limit });
    },
  },
  Mutation: {
    postMessage: async (root, { room, channel, content }, context) => {
      return await context.Message.postNewMessage({ room, channel, content, user: context.user });
    },
    deleteMessage: async (root, { id }, context) => {
      return await context.Message.deleteMessage({ id, user: context.user });
    }
  },
  Subscription: {
    channelsInRoomChanged: (channels) => channels,
    messageAdded: (message) => message,
    messageDeleted: (message) => message,
  },
};

export default {
  types: () => [types, UserSchema.types],
  queries,
  mutations,
  subscriptions,
  resolvers,
};
