import path from 'path';
import AssetsPlugin from 'assets-webpack-plugin';
import ExtractTextPlugin from 'extract-text-webpack-plugin';
import cssnext from 'postcss-cssnext';
import webpack from 'webpack';

import config from './config';

const isProduction = config.env !== 'development';

export default {
  entry: isProduction ? [
    './index.js'
  ] : [
    'webpack-hot-middleware/client',
    'react-hot-loader/patch',
    './index.js'
  ],
  context: path.resolve(__dirname, './client'),
  output: {
    filename: '[name].[hash:7].js',
    path: path.resolve(__dirname, './build'),
    publicPath: '/'
  },
  module: {
    loaders: [
      {
        test: /\.css$/,
        exclude: /node_modules/,
        loaders: isProduction
        ? [ExtractTextPlugin.extract('style', 'css?modules&importLoaders=1&localIdentName=[name]__[local]-[hash:base64:4]', 'postcss')]
        : ['style', 'css?modules&importLoaders=1&localIdentName=[name]__[local]-[hash:base64:4]', 'postcss']
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel',
        query: {
          cacheDirectory: !isProduction
        }
      },
      {
        test: /\.(eot|gif|jpe?g|otf|png|svg|webp|woff|woff2?|ttf)$/,
        exclude: /node_modules/,
        loader: 'url',
        query: {
          limit: 10000,
          name: '[name].[hash:7].[ext]'
        }
      }
    ]
  },
  plugins: [
    new AssetsPlugin({
      filename: 'assets.json',
      path: 'build'
    }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
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
      })
    ] : [
      new webpack.HotModuleReplacementPlugin()
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
