import { UserSchema } from './';

const types = `
  type Message {
    id: ID!
    content: String!
    createdAt: String!
    updatedAt: String!
    author: User!
  }
`;

const queries = `
  messages(offset: Int, limit: Int): [Message]
  message(id: ID!): Message
`;

const mutations = `
  postMessage(content: String!): Message
  deleteMessage(id: ID!): Message
`;

const subscriptions = `
  messageAdded: Message
  messageDeleted: Message
`;

const resolvers = {
  Query: {
    messages: async (root, { offset, limit }, context) => {
      return await context.Message.getMessages({ offset, limit });
    },
    message: async (root, { id }, context) => await context.Message.getById(id),
  },
  Mutation: {
    postMessage: async (__, { content }, context) => {
      return await context.Message.postNewMessage({ content, user: context.user });
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
