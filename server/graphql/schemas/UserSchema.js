const types = `
  type User {
    id: ID!
    email: Email!
    name: String
    nickname: String
    createdAt: String!
    updatedAt: String!
  }

  type AuthenticatedUser {
    user: User
    authToken: String
    error: String
  }
`;

const queries = `
  user(id: ID!): User
  currentUser: AuthenticatedUser
`;

const mutations = `
  login(email: Email!, password: String!): AuthenticatedUser
  createUser(name: String, email: Email!, password: String!): AuthenticatedUser
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
    createUser: async (__, { name, email, password }, context) => {
      return await context.User.createNewUser({ name, email, password });
    },
  },
};

export default {
  types,
  queries,
  mutations,
  resolvers
};
