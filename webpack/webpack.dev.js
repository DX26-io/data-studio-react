const webpack = require('webpack');
const writeFilePlugin = require('write-file-webpack-plugin');
const webpackMerge = require('webpack-merge');
const BrowserSyncPlugin = require('browser-sync-webpack-plugin');
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');
const SimpleProgressWebpackPlugin = require('simple-progress-webpack-plugin');
const WebpackNotifierPlugin = require('webpack-notifier');
const path = require('path');
const sass = require('sass');

const utils = require('./utils.js');
const commonConfig = require('./webpack.common.js');

const ENV = 'development';

module.exports = options =>
  webpackMerge(commonConfig({ env: ENV }), {
    devtool: 'cheap-module-source-map', // https://reactjs.org/docs/cross-origin-errors.html
    mode: ENV,
    entry: ['./src/main/webapp/app/index'],
    output: {
      path: utils.root('build/resources/main/static/'),
      filename: 'app/[name].bundle.js',
      chunkFilename: 'app/[id].chunk.js',
    },
    module: {
      rules: [
        {
          test: /\.(sa|sc|c)ss$/,
          use: [
            'style-loader',
            'css-loader',
            'postcss-loader',
          ],
        },
        {
          test: /\.(sa|sc|c)ss$/,
          exclude: /node_modules/,
          use: [
            {
              loader: 'sass-loader',
              options: { implementation: sass },
            },
          ],
        },
      ],
    },
    devServer: {
      stats: options.stats,
      hot: true,
      contentBase: './build/resources/main/static/',
      proxy: [
        {
          context: ['/login', '/api', '/services', '/management', '/swagger-resources', '/v2/api-docs', '/h2-console', '/auth','/dx26io-ws'],
          target: `http${options.tls ? 's' : ''}://localhost:8002`,
          // keep below code commented for the time being
          // bypass: function(req, res, proxyOptions) {
          //   console.log("req.url=="+req.url);
          //   let isWebsocket = req.url.indexOf('chat') != -1 || req.url.indexOf('socket.io') != -1;
          //   proxyOptions.target = isWebsocket ? 'http://localhost:8085' : proxyOptions.target;
          // },
          secure: false,
          changeOrigin: options.tls,
          ws: true,
        },
      ],
      watchOptions: {
        // comment below line of code when you are working on flair-visualisation
        // ignored: /node_modules/,
      },
      https: options.tls,
      historyApiFallback: true,
    },
    stats: process.env.JHI_DISABLE_WEBPACK_LOGS ? 'none' : options.stats,
    plugins: [
      process.env.JHI_DISABLE_WEBPACK_LOGS
        ? null
        : new SimpleProgressWebpackPlugin({
            format: options.stats === 'minimal' ? 'compact' : 'expanded',
          }),
      new FriendlyErrorsWebpackPlugin(),
      new BrowserSyncPlugin(
        {
          https: options.tls,
          host: 'localhost',
          port: 9000,
          proxy: {
            target: `http${options.tls ? 's' : ''}://localhost:9060`,
            proxyOptions: {
              changeOrigin: false, //pass the Host header to the backend unchanged  https://github.com/Browsersync/browser-sync/issues/430
            },
          },
          socket: {
            clients: {
              heartbeatTimeout: 60000,
            },
          },
          /*
      ,ghostMode: { // uncomment this part to disable BrowserSync ghostMode; https://github.com/jhipster/generator-jhipster/issues/11116
        clicks: false,
        location: false,
        forms: false,
        scroll: false
      } */
        },
        {
          reload: false,
        }
      ),
      new webpack.NamedModulesPlugin(),
      new webpack.HotModuleReplacementPlugin(),
      new writeFilePlugin(),
      new webpack.WatchIgnorePlugin([utils.root('src/test')]),
      new WebpackNotifierPlugin({
        title: 'JHipster',
        contentImage: path.join(__dirname, 'logo-jhipster.png'),
      }),
    ].filter(Boolean),
  });
