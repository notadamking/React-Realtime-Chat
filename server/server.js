import path from 'path';
import express from 'express';
import compression from 'compression';
import morgan from 'morgan';

import config from '../config';
import setupApi from './graphql/api';
import reactMiddleware from './middleware/reactMiddleware';
import { webpackMiddleware, webpackHotMiddleware } from './middleware/webpackMiddleware';

const isProduction = config.env !== 'development';
const app = express();

if (!isProduction) {
  app.use(webpackMiddleware);
  app.use(webpackHotMiddleware);
}

app.use(compression());
app.use(express.static(path.resolve(__dirname, '../build')));
app.use(morgan(isProduction ? 'combined' : 'dev'));
app.use(reactMiddleware);

setupApi(app);

app.listen(config.server.port, () =>
  console.info(`Server running in ${app.get('env')} on port ${config.server.port}`) // eslint-disable-line no-console
);
