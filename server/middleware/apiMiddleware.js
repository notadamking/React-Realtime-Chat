import { graphqlExpress, graphiqlExpress } from 'graphql-server-express';

import config from '../../config';
import { User, Message } from '../api/models';
import schema from '../api/schema';

export const graphqlMiddleware = graphqlExpress(async (req) => {
  const currentUser = await User.getCurrentUser(req.headers.authorization);
  return {
    schema,
    context: {
      user: currentUser,
      Message,
      User,
    }
  };
});

export const graphiqlMiddleware = graphiqlExpress({
  endpointURL: config.graphqlEndpoint,
});
