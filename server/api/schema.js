import { makeExecutableSchema } from 'graphql-tools';

import { EmailScalar, UrlScalar, DateScalar } from './types';
import { UserSchema, MessageSchema } from './schemas';

const typeDefs = [`
  scalar Email
  scalar Url
  scalar Date

  ${UserSchema.types}
  ${MessageSchema.types()}

  type Query {
    ${UserSchema.queries}
    ${MessageSchema.queries}
  }

  type Mutation {
    ${UserSchema.mutations}
    ${MessageSchema.mutations}
  }

  type Subscription {
    ${UserSchema.subscriptions}
    ${MessageSchema.subscriptions}
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
    ...MessageSchema.resolvers.Query,
  },
  Mutation: {
    ...UserSchema.resolvers.Mutation,
    ...MessageSchema.resolvers.Mutation,
  },
  Subscription: {
    ...UserSchema.resolvers.Subscription,
    ...MessageSchema.resolvers.Subscription,
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
