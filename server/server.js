import path from 'path';
import { SubscriptionServer } from 'subscriptions-transport-ws';
import express from 'express';
import bodyParser from 'body-parser';
import compression from 'compression';
import morgan from 'morgan';

import config from '../config';
import { subscriptionManager } from './api/utils/subscriptions';
import { graphqlMiddleware, graphiqlMiddleware } from './middleware/apiMiddleware';
import reactMiddleware from './middleware/reactMiddleware';

const app = express();

app.disable('x-powered-by');
app.use(compression());
app.use(express.static(path.resolve(__dirname, '../build')));
app.use(morgan(config.isDevelopment ? 'dev' : 'combined'));

if (__DEVELOPMENT__) {
  app.use('/graphiql', graphiqlMiddleware);
}

app.use(config.graphqlEndpoint, bodyParser.json(), graphqlMiddleware);
app.use(reactMiddleware);

const server = app.listen(config.server.port, () => {
  console.info(
    `🔌  HTTP and Websocket Server running in ${app.get('env')}`
    + ` on port ${config.server.port}`
  );
});

// eslint-disable-next-line
new SubscriptionServer({ subscriptionManager }, server);
