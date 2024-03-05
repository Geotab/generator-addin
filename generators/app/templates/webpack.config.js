const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CopyWebpackPlugin = require('copy-webpack-plugin');
const config = require('./src/config.json');

const { name: appName } = config;

const transform = function (content, path) {
  let config = JSON.parse(content);
  let host = config.dev.dist.host;
  let len = config.items.length;
  const { name } = config;

  for (let i = 0; i < len; i++) {
    config.items[i].url = `${name}/` + config.items[i].url;
  }

  delete config['dev'];
  let response = JSON.stringify(config, null, 2);
  // Returned string is written to file
  return response;
}

module.exports = {
  mode: 'production',
  entry: {
    bundle: path.resolve(__dirname, 'src/app/index.js'),
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name]-[contenthash].js',
    assetModuleFilename: '[name][ext]',
    clean: true
  },
  devServer: {
    static: {
      directory: path.resolve(__dirname, 'dist')
    },
    port: 3000,
    open: true,
    hot: true,
    compress: true,
    historyApiFallback: true
  },
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.scss/,
        use: [
          'style-loader',
          'css-loader',
          'sass-loader'
        ]
      },
      {
        test: /\.css$/i,
        use: [
          MiniCssExtractPlugin.loader,
          "css-loader", "postcss-loader",
        ]
      },
      {
        test: /\.(js|jsx)$/,
        exclude: [/node_modules/],
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: 'asset/resource'
      }
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: "styles.css",
      chunkFilename: "styles.css"
    }),
    new HtmlWebpackPlugin({
      title: '<%= name%>',
      filename: `<%= name%>.html`,
      template: 'src/app/<%= name%>.html',
      inject: 'body'
    }),
    new CopyWebpackPlugin({
      patterns: [
        { from: './src/app/images/icon.svg', to: 'images/' },
        {
          from: './src/config.json',
          transform: transform,
          to: 'configuration.json'
        },
      ]
    })
  ]
}