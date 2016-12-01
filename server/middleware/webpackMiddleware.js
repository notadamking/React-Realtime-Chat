import devMiddleware from 'webpack-dev-middleware';
import hotMiddleware from 'webpack-hot-middleware';
import webpack from 'webpack';

import webpackConfig from '../../webpack/config.babel';

const compiler = webpack(webpackConfig);

export const webpackMiddleware = devMiddleware(compiler, {
  historyApiFallback: true,
  hot: true,
  // quiet: true,
  // noInfo: true,
  inline: true,
  lazy: false,
  publicPath: webpackConfig.output.publicPath,
  headers: {'Access-Control-Allow-Origin': '*'},
  stats: {colors: true}
});

export const webpackHotMiddleware = hotMiddleware(compiler);
