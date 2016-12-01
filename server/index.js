/* eslint-disable import/no-commonjs */

const path = require('path');
const WebpackIsomorphicTools = require('webpack-isomorphic-tools');
const cssNext = require('postcss-cssnext');
const requireHook = require('css-modules-require-hook');
const toolsConfig = require('../webpack/webpack-isomorphic-tools');
require('babel-register');

global.__CLIENT__ = false;
global.__SERVER__ = true;
global.__DEVELOPMENT__ = process.env.NODE_ENV === 'development';

requireHook({
  generateScopedName: __DEVELOPMENT__ ? '[name]__[local]___[hash:base64:5]' : '[hash:base64:4]',
  rootDir: './client',
  prepend: [
    cssNext(),
  ],
});

const basePath = path.resolve(__dirname, '../client');
global.webpackIsomorphicTools = new WebpackIsomorphicTools(toolsConfig)
  .server(basePath, () => {
    require('./server'); // eslint-disable-line global-require
  });

process.on('uncaughtException', (err) => {
  console.log('Uncaught exception: ', err);
});
