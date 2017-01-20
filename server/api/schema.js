import { makeExecutableSchema } from 'graphql-tools';

import { RoomSchema, MessageSchema, UserSchema } from './schemas';

const typeDefs = [`
  ${UserSchema.types}
  ${MessageSchema.types()}
  ${RoomSchema.types()}

  type Query {
    ${UserSchema.queries}
    ${MessageSchema.queries}
    ${RoomSchema.queries}
  }

  type Mutation {
    ${UserSchema.mutations}
    ${MessageSchema.mutations}
  }

  type Subscription {
    ${MessageSchema.subscriptions}
    ${RoomSchema.subscriptions}
  }

  schema {
    query: Query
    mutation: Mutation
    subscription: Subscription
  }
`];

const resolvers = {
  Query: {
    ...UserSchema.resolvers.Query,
    ...MessageSchema.resolvers.Query,
    ...RoomSchema.resolvers.Query,
  },
  Mutation: {
    ...UserSchema.resolvers.Mutation,
    ...MessageSchema.resolvers.Mutation,
  },
  Subscription: {
    ...MessageSchema.resolvers.Subscription,
    ...RoomSchema.resolvers.Subscription,
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
