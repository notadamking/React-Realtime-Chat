/* I temporarily removed the !'s from definition until
   errors have been handled
*/
const types = `
  type User {
    id: ID
    email: Email
    createdAt: String
    updatedAt: String
    authToken: String
  }
`;

const queries = `
  currentUser: User
`;

const mutations = `
  loginAsUser(email: Email!, password: String!): User
  createUser(email: Email!, password: String!): User
`;

const resolvers = {
  Query: {
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
