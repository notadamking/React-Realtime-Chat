import path from 'path';
import { SubscriptionServer } from 'subscriptions-transport-ws';
import express from 'express';
import compression from 'compression';
import morgan from 'morgan';

import config from '../config';
import { subscriptionManager } from './graphql/utils/subscriptions';
import setupApi from './graphql/api';
import reactMiddleware from './middleware/reactMiddleware';

const app = express();

app.use(compression());
app.use(express.static(path.resolve(__dirname, '../build')));
app.use(morgan(config.isDevelopment ? 'dev' : 'combined'));

setupApi(app);

app.use(reactMiddleware);

const server = app.listen(config.server.port, () =>
  console.info(`Server running in ${app.get('env')} on port ${config.server.port}`) // eslint-disable-line no-console
);

// eslint-disable-next-line
new SubscriptionServer({ subscriptionManager }, server);
