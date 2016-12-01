const types = `
  type User {
    id: ID!
    email: Email!
    createdAt: String!
    updatedAt: String!
    authToken: String
  }

  type AuthenticatedUser {
    id: ID
    user: User
    error: String
  }
`;

const queries = `
  user(id: ID!): User
  currentUser: AuthenticatedUser
`;

const mutations = `
  login(email: Email!, password: String!): AuthenticatedUser
  createUser(email: Email!, password: String!): AuthenticatedUser
`;

const resolvers = {
  Query: {
    user: async (root, { id }, context) => await context.User.getById(id),
    currentUser: (__, ___, context) => context.userWithToken,
  },
  Mutation: {
    login: async (__, { email, password }, context) => {
      return await context.User.login({ email, password });
    },
    createUser: async (__, { email, password }, context) => {
      return await context.User.createNewUser({ email, password });
    },
  },
};

export default {
  types,
  queries,
  mutations,
  resolvers
};
