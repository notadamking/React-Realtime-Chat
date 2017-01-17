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
  updateCurrentRoom(room: String, authToken: String): User
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
    updateCurrentRoom: async (__, { room, authToken }, context) => {
      const authedUser = await context.User.getCurrentUser(authToken);
      if (!authedUser && !context.user) {
        throw new Error('You must be logged in to update the current room.');
      }
      const userId = (authedUser && authedUser.id) || (context.user && context.user.id);
      return await context.User.updateCurrentRoom({ room, userId });
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
