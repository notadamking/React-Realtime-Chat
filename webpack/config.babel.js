/* eslint-disable import/no-commonjs */

const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const WebpackIsomorphicToolsPlugin = require('webpack-isomorphic-tools/plugin');
const cssnext = require('postcss-cssnext');
const webpack = require('webpack');

const config = require('../config');
const toolsConfig = require('./webpack-isomorphic-tools');

const webpackIsomorphicToolsPlugin = new WebpackIsomorphicToolsPlugin(toolsConfig).development();

const isProduction = config.env !== 'development';

module.exports = {
  devtool: isProduction ? 'source-map' : 'eval',
  entry: isProduction ? [
    './index.js'
  ] : [
    `webpack-hot-middleware/client?path=http://${config.server.host}:${config.devServerPort}/__webpack_hmr`,
    'react-hot-loader/patch',
    './index.js'
  ],
  context: path.resolve(__dirname, '../client'),
  output: {
    filename: '[name]-[hash].js',
    chunkFilename: '[name]-[chunkhash].js',
    path: path.resolve(__dirname, './build'),
    publicPath: `http://${config.server.host}:${config.devServerPort}/`,
  },
  module: {
    loaders: [
      {
        test: /\.(graphql|gql)$/,
        exclude: /node_modules/,
        loader: 'graphql-tag/loader'
      },
      {
        test: /\.css$/,
        exclude: /node_modules/,
        loader: isProduction
        ? ExtractTextPlugin.extract('style-loader', 'css-loader?modules&importLoaders=1&localIdentName=[hash:base64:4]!postcss-loader')
        : 'style-loader!css-loader?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]!postcss-loader'
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel',
        query: {
          cacheDirectory: !isProduction
        }
      },
      { test: /\.json$/, loader: 'json-loader' },
      { test: /\.woff(\?v=\d+\.\d+\.\d+)?$/, loader: 'url-loader?limit=10000&mimetype=application/font-woff' },
      { test: /\.woff2(\?v=\d+\.\d+\.\d+)?$/, loader: 'url-loader?limit=10000&mimetype=application/font-woff' },
      { test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/, loader: 'url-loader?limit=10000&mimetype=application/octet-stream' },
      { test: /\.eot(\?v=\d+\.\d+\.\d+)?$/, loader: 'file-loader' },
      { test: /\.svg(\?v=\d+\.\d+\.\d+)?$/, loader: 'url-loader?limit=10000&mimetype=image/svg+xml' },
      { test: webpackIsomorphicToolsPlugin.regular_expression('images'), loader: 'url-loader?limit=10240' }
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': isProduction ? JSON.stringify('production') : JSON.stringify('development'),
      __CLIENT__: true,
      __SERVER__: false,
      __DEVELOPMENT__: !isProduction,
    }),
    ...isProduction ? [
      new ExtractTextPlugin('[name]-[chunkhash].css', { allChunks: true }),
      new webpack.optimize.DedupePlugin(),
      new webpack.optimize.OccurenceOrderPlugin(),
      new webpack.optimize.UglifyJsPlugin({
        compress: {
          warnings: false
        },
        output: {
          comments: false
        }
      }),
      webpackIsomorphicToolsPlugin
    ] : [
      new webpack.HotModuleReplacementPlugin(),
      new webpack.IgnorePlugin(/webpack-stats\.json$/),
      webpackIsomorphicToolsPlugin.development()
    ]
  ],
  postcss: [
    cssnext(),
  ],
  bail: isProduction,
  cache: !isProduction,
  stats: {
    children: false
  }
};
