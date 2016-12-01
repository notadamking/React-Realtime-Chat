import path from 'path';
import express from 'express';
import compression from 'compression';
import morgan from 'morgan';

import config from '../config';
import setupApi from './graphql/api';
import reactMiddleware from './middleware/reactMiddleware';

const app = express();

app.use(compression());
app.use(express.static(path.resolve(__dirname, '../build')));
app.use(morgan(config.isDevelopment ? 'dev' : 'combined'));

setupApi(app);

app.use(reactMiddleware);

app.listen(config.server.port, () =>
  console.info(`Server running in ${app.get('env')} on port ${config.server.port}`) // eslint-disable-line no-console
);
