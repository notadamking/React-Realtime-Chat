const types = `
  type User {
    id: ID!
    email: Email!
    createdAt: String!
    updatedAt: String!
    authToken: String
  }
`;

const queries = `
  user(id: ID!): User
  currentUser: User
`;

const mutations = `
  loginAsUser(email: Email!, password: String!): User
  createUser(email: Email!, password: String!): User
`;

const resolvers = {
  Query: {
    user: async (root, { id }, context) => await context.User.getById(id),
    currentUser: (__, ___, context) => context.user,
  },
  Mutation: {
    loginAsUser: async (__, { email, password }, context) => {
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
