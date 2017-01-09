import { graphqlExpress, graphiqlExpress } from 'graphql-server-express';

import config from '../../config';
import { User, Comment } from '../api/models';
import schema from '../api/schema';

export const graphqlMiddleware = graphqlExpress(async (req) => {
  const currentUser = await User.getCurrentUser(req.headers.authorization);
  return {
    schema,
    context: {
      user: currentUser,
      Comment,
      User,
    }
  };
});

export const graphiqlMiddleware = graphiqlExpress({
  endpointURL: config.graphqlEndpoint,
});
