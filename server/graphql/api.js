import { createServer } from 'http';
import { graphqlExpress, graphiqlExpress } from 'graphql-server-express';
import { SubscriptionServer } from 'subscriptions-transport-ws';
import bodyParser from 'body-parser';

import config from '../../config';
import { User, Comment } from './models';
import { subscriptionManager } from './utils/subscriptions';
import schema from './schema';

export default (app) => {
  app.use(config.graphqlEndpoint, bodyParser.json(), graphqlExpress(async (req) => {
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
  }));

  app.use('/graphiql', graphiqlExpress({
    endpointURL: config.graphqlEndpoint,
  }));

  // WebSocket server for subscriptions
  const websocketServer = createServer((request, response) => {
    response.writeHead(404);
    response.end();
  });

  websocketServer.listen(config.wsPort, () => console.log(
    `Websocket Server is now running on http://${config.server.host}:${config.wsPort}`
  ));

  // eslint-disable-next-line
  new SubscriptionServer({ subscriptionManager }, websocketServer);
};
