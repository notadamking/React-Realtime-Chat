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
`;

const queries = `
  messages(room: String!, channel: String!, offset: Int, limit: Int): [Message]
`;

const mutations = `
  postMessage(room: String!, channel: String!, content: String!): Message
  deleteMessage(id: ID!): Message
`;

const subscriptions = `
  messageAdded: Message
  messageDeleted: Message
`;

const resolvers = {
  Query: {
    messages: async (root, { room, channel, offset, limit }, context) => {
      return await context.Message.getMessages({ room, channel, offset, limit });
    },
  },
  Mutation: {
    postMessage: async (__, { room, channel, content }, context) => {
      return await context.Message.postNewMessage({ room, channel, content, user: context.user });
    },
    deleteMessage: async (__, { id }, context) => {
      return await context.Message.deleteMessage({ id, user: context.user });
    }
  },
  Subscription: {
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
