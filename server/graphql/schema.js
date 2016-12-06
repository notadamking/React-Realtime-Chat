import { makeExecutableSchema } from 'graphql-tools';

import { EmailScalar, UrlScalar, DateScalar } from './types';
import { UserSchema, CommentSchema } from './schemas';

const typeDefs = [`
  scalar Email
  scalar Url
  scalar Date

  ${UserSchema.types}
  ${CommentSchema.types()}

  type Query {
    ${UserSchema.queries}
    ${CommentSchema.queries}
  }

  type Mutation {
    ${UserSchema.mutations}
    ${CommentSchema.mutations}
  }

  type Subscription {
    ${CommentSchema.subscriptions}
  }

  schema {
    query: Query
    mutation: Mutation
    subscription: Subscription
  }
`];

const resolvers = {
  Email: EmailScalar,
  Date: DateScalar,
  Url: UrlScalar,
  Query: {
    ...UserSchema.resolvers.Query,
    ...CommentSchema.resolvers.Query,
  },
  Mutation: {
    ...UserSchema.resolvers.Mutation,
    ...CommentSchema.resolvers.Mutation,
  },
  Subscription: {
    ...CommentSchema.resolvers.Subscription,
  },
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
