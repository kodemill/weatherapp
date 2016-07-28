const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const config = require('./config');

const srcRoot = path.resolve(__dirname, 'src');
const outRoot = path.resolve(__dirname, 'dist');
const webpackDevServerUrl = `http://${config.devHost}:${config.devPort}`;

module.exports = {
  entry: [
    'babel-polyfill',
    'whatwg-fetch',
    `webpack-dev-server/client?${webpackDevServerUrl}/`,
    'webpack/hot/only-dev-server',
    `${srcRoot}/index.js`,
  ],
  output: {
    path: outRoot,
    filename: 'bundle.js',
    publicPath: '/',
  },
  module: {
    loaders: [{
      test: /\.js$/,
      include: [srcRoot],
      loaders: ['react-hot', 'babel-loader'],
    }, {
      test: /\.scss$/,
      include: [srcRoot],
      loaders: ['style', 'css', 'sass'],
    }, {
      test: /\.css$/,
      include: [srcRoot],
      loaders: ['style', 'css'],
    }, {
      test: /\.(eot|svg|ttf|woff|woff2)$/,
      loader: 'file?name=[name].[ext]',
      include: [srcRoot],
    }, {
      test: /\.png$/,
      loader: 'url?limit=11111',
      include: [srcRoot],
    }],
  },
  devtool: 'cheap-module-eval-source-map',
  plugins: [
    new webpack.optimize.CommonsChunkPlugin('common.bundle.js'),
    new HtmlWebpackPlugin({
      title: 'WeatherApp',
      template: 'src/index.ejs',
    }),
    new webpack.HotModuleReplacementPlugin(),
  ],
};
