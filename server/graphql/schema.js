import { makeExecutableSchema } from 'graphql-tools';

import { EmailScalar, UrlScalar, DateScalar } from './types';
import { UserSchema, CommentSchema } from './schemas';

const typeDefs = [`
  scalar Email
  scalar Url
  scalar Date

  ${UserSchema.types}
  ${CommentSchema.types()}

  type RootQuery {
    ${UserSchema.queries}
    ${CommentSchema.queries}
  }

  type RootMutation {
    ${UserSchema.mutations}
    ${CommentSchema.mutations}
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
    ...CommentSchema.resolvers.Query,
  },
  RootMutation: {
    ...UserSchema.resolvers.Mutation,
    ...CommentSchema.resolvers.Mutation,
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
