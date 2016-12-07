import { graphqlExpress, graphiqlExpress } from 'graphql-server-express';

import config from '../../config';
import { User, Comment } from '../api/models';
import schema from '../api/schema';

export const graphqlMiddleware = graphqlExpress(async (req) => {
  const userWithToken = await User.getCurrentUser(req.headers.authorization);
  return {
    schema,
    context: {
      user: userWithToken && userWithToken.user,
      userWithToken,
      Comment,
      User,
    }
  };
});

export const graphiqlMiddleware = graphiqlExpress({
  endpointURL: config.graphqlEndpoint,
});
