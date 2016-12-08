/* eslint-disable import/no-commonjs */

const express = require('express');
const webpack = require('webpack');

const config = require('../config');
const webpackConfig = require('./webpack.config');

const devServer = express();
const compiler = webpack(webpackConfig);
const host = config.server.host || 'localhost';
const port = config.devServerPort || 3001;

devServer.use(require('webpack-dev-middleware')(compiler, {
  historyApiFallback: true,
  contentBase: `http://${host}:${port}`,
  quiet: true,
  noInfo: true,
  hot: true,
  publicPath: webpackConfig.output.publicPath,
  headers: { 'Access-Control-Allow-Origin': '*' },
  stats: { colors: true },
}));
devServer.use(require('webpack-hot-middleware')(compiler));

devServer.listen(port, (err) => {
  if (err) {
    console.error(err);
  } else {
    console.info(`==> 🚧  Webpack development server listening on port ${port}`);
  }
});
