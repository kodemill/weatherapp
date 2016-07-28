const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const config = require('./config');
const webpackConfig = require('./webpack.config.dev');


new WebpackDevServer(webpack(webpackConfig), {
  contentBase: config.devUrl,
  headers: { 'Access-Control-Allow-Origin': '*' },
  publicPath: webpackConfig.output.publicPath,
  proxy: {
    '/api/*': config.apiUrl,
  },
  historyApiFallback: true,
  hot: true,
  inline: true,
  quiet: false,
  stats: {
    colors: true,
    chunks: false,
    chunkModules: true,
  },
}).listen(config.devPort, config.devHost, err => {
  if (err) {
    console.log(err);
    process.exit(42);
  }
  console.log(`Webpack Dev Server running at ${config.devUrl}`);
});
