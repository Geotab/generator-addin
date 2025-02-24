const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
  mode: 'development',
  entry: {
    bundle: path.resolve(__dirname, 'src/.dev/index.js'),
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
  <% if(isTypeScriptBased) {%>
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
  },
  <%}%>
  module: {
    rules: [
      {
        test: /\.scss$/i,
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
            <% if(isReactBased) {%>
            presets: ['@babel/preset-env', ["@babel/preset-react", {
              "runtime": "automatic"
            }]]
            <% } else {%>
            presets: ['@babel/preset-env']
            <%}%>
          }
        }
      },
      <% if(isTypeScriptBased) {%>
      {
        test: /\.(ts|tsx)$/,
        exclude: /node_modules/,
        use: 'ts-loader',
      },
      <%}%>
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
      filename: 'index.html',
      template: 'src/app/<%= name%>.html',
      inject: 'body'
    }),
    new HtmlWebpackPlugin({  // Also generate a test.html
      filename: 'style-guide.html',
      template: 'src/.dev/styles/styleGuideMyGeotab.html',
      inject: false
    })
  ]
}