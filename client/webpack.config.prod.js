const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const srcRoot = path.resolve(__dirname, 'src');
const outRoot = path.resolve(__dirname, 'dist');

module.exports = {
  entry: [
    'babel-polyfill',
    'whatwg-fetch',
    `${srcRoot}/index.js`,
  ],
  output: {
    path: outRoot,
    filename: 'js/[chunkhash].js',
    publicPath: '/',
    chunkFilename: 'js/[chunkhash].js',
  },
  module: {
    loaders: [{
      test: /\.js$/,
      include: [srcRoot],
      loader: 'babel-loader',
    }, {
      test: /\.css$/,
      include: [srcRoot],
      loaders: [
        'style-loader/url',
        'file?name=css/[hash].css!extract',
        'css-loader'],
    }, {
      test: /\.scss$/,
      include: [srcRoot],
      loaders: [
        'style-loader/url',
        'file?name=css/[hash].css!extract',
        'css-loader',
        'sass-loader'],
    }, {
      test: /\.(eot|svg|ttf|woff|woff2)$/,
      include: [srcRoot],
      loader: 'file?name=font/[name].[ext]',
    }, {
      test: /\.png$/,
      loader: 'url?limit=11111',
      include: [srcRoot],
    }],
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production'),
      },
    }),
    new webpack.optimize.CommonsChunkPlugin('js/[hash].js'),
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.UglifyJsPlugin({ compress: { warnings: false } }),
    new webpack.optimize.AggressiveMergingPlugin(),
    new HtmlWebpackPlugin({
      title: 'WeatherApp',
      template: 'src/index.ejs',
    }),
  ],
};
