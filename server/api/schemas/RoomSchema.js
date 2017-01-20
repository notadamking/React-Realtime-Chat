import { UserSchema } from './';

const types = `
  type User {
    id: ID!
    username: String!
    avatarUrl: String!
    createdAt: String!
    updatedAt: String!
    authToken: String
    currentRoom: String
  }

  type OnlineUsersUpdate {
    room: String!
    users: [User]!
  }
`;

const queries = `
  onlineUsersForRoom(room: String!): [User]
  usersForRoom(room: String!): [User]
`;

const subscriptions = `
  onlineUsersChanged(room: String!): OnlineUsersUpdate
`;

const resolvers = {
  Query: {
    onlineUsersForRoom: async (root, { room }, context) => {
      return await context.Room.getOnlineUsersForRoom(room);
    },
    usersForRoom: async (root, { room }, context) => {
      return await context.Room.getAllUsersForRoom(room);
    },
  },
  Subscription: {
    onlineUsersChanged: (users) => users,
  },
};

export default {
  types: () => [types, UserSchema.types],
  queries,
  subscriptions,
  resolvers,
};
