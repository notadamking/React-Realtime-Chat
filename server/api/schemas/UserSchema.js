/* I temporarily removed the !'s from definition until
   errors have been handled
*/
const types = `
  type User {
    id: ID
    username: String
    avatarUrl: String
    createdAt: String
    updatedAt: String
    authToken: String
    currentRoom: String
  }

  type UsersInRoomUpdate {
    room: String!
    users: [User]!
  }
`;

const queries = `
  currentUser: User
  usersInRoom(room: String!): [User]
`;

const mutations = `
  updateCurrentRoom(room: String): User
  loginAsUser(username: String!, password: String!): User
  createUser(username: String!, password: String!): User
`;

const subscriptions = `
  usersInRoomChanged(room: String!): UsersInRoomUpdate
`;

const resolvers = {
  Query: {
    currentUser: (__, ___, context) => context.user,
    usersInRoom: async (__, { room }, context) => {
      return await context.User.getUsersInRoom(room);
    },
  },
  Mutation: {
    updateCurrentRoom: async (__, { room }, context) => {
      if (!context.user || !context.user.id) {
        throw new Error('You must be logged in to update the current room.');
      }
      return await context.User.updateCurrentRoom({ room, userId: context.user && context.user.id });
    },
    loginAsUser: async (__, { username, password }, context) => {
      return await context.User.login({ username, password });
    },
    createUser: async (__, { username, password }, context) => {
      return await context.User.createNewUser({ username, password });
    },
  },
  Subscription: {
    usersInRoomChanged: (users) => users,
  },
};

export default {
  types,
  queries,
  mutations,
  subscriptions,
  resolvers
};
