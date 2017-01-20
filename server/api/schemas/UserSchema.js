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
`;

const queries = `
  currentUser: User
`;

const mutations = `
  updateCurrentRoom(room: String, authToken: String): User
  loginAsUser(username: String!, password: String!): User
  createUser(username: String!, password: String!): User
`;

const resolvers = {
  Query: {
    currentUser: (__, ___, context) => context.user,
  },
  Mutation: {
    updateCurrentRoom: async (__, { room, authToken }, context) => {
      const authedUser = await context.User.getCurrentUser(authToken);
      return await context.User.updateCurrentRoom({ room, user: authedUser || context.user });
    },
    loginAsUser: async (__, { username, password }, context) => {
      return await context.User.login({ username, password });
    },
    createUser: async (__, { username, password }, context) => {
      return await context.User.createNewUser({ username, password });
    },
  },
};

export default {
  types,
  queries,
  mutations,
  resolvers
};
