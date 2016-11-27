import { graphqlExpress, graphiqlExpress } from 'graphql-server-express';
import bodyParser from 'body-parser';

import config from '../../config';
import { User } from './models';
import schema from './schema';

export default (app) => {
  app.use(config.graphqlEndpoint, bodyParser.json(), graphqlExpress(async (req) => {
    const userWithToken = await User.getCurrentUser(req.headers.authorization);
    return {
      schema,
      context: {
        user: userWithToken && userWithToken.user,
        userWithToken,
        User,
      }
    };
  }));

  app.use('/graphiql', graphiqlExpress({
    endpointURL: config.graphql,
  }));
};
