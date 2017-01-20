import { graphqlExpress, graphiqlExpress } from 'graphql-server-express';

import config from '../../config';
import { Message, Room, User } from '../api/models'; // eslint-disable-line import/named
import schema from '../api/schema';

export const graphqlMiddleware = graphqlExpress(async (req) => {
  const currentUser = await User.getCurrentUser(req.headers.authorization);
  return {
    schema,
    context: {
      user: currentUser,
      Message,
      Room,
      User,
    }
  };
});

export const graphiqlMiddleware = graphiqlExpress({
  endpointURL: config.graphqlEndpoint,
});
