import { makeExecutableSchema } from 'graphql-tools';
import { EmailScalar, UrlScalar, DateScalar } from './types';
import { UserSchema } from './schemas';

const typeDefs = [`
  scalar Email
  scalar Url
  scalar Date

  ${UserSchema.types}

  type RootQuery {
    ${UserSchema.queries}
  }

  type RootMutation {
    ${UserSchema.mutations}
  }

  schema {
    query: RootQuery
    mutation: RootMutation
  }
`];

const resolvers = {
  Email: EmailScalar,
  Date: DateScalar,
  Url: UrlScalar,
  RootQuery: {
    ...UserSchema.resolvers.Query,
  },
  RootMutation: {
    ...UserSchema.resolvers.Mutation,
  }
};

const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
  logger: { log: (err) => console.log(err) },
  allowUndefinedInResolve: true, // set to false for debugging
  resolverValidationOptions: {
    requireResolversForArgs: false, // set to true for debugging
    requireResolversForNonScalar: false, // set to true for debugging
  },
});

export default schema;
