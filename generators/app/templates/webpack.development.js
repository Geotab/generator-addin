const path = require('path');
const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");

module.exports = merge(common, {
    entry: './src/.dev/index.js',
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                    },
                    'css-loader'
                ]
            },
            {
                enforce: 'pre',
                test: /\.js$/,
                exclude: [/node_modules/, /\.dev/],
                use: [
                    {
                        loader: 'eslint-loader',
                        options: {
                        formatter: require('eslint/lib/cli-engine/formatters/stylish')
                        },
                    },
                ],
            },
            {
                test: /\.js$/,
                exclude: [/node_modules/],
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env']
                    }
                },
            },
            {
                test: /\.html$/,
                use: [
                    {
                        loader: 'html-loader',
                        options: { minimize: true }
                    }
                ]
            },
            {
                test: /\.(png|svg|jpg|gif)$/,
                use: [
                    'file-loader'
                ]
    },
    optimization: {
        minimizer: [
            new CssMinimizerPlugin()
        ]
    },
    plugins: [
        new CopyWebpackPlugin([
            { from: './src/app/images/icon.svg', to: 'images/'},
            { from: './src/app/config.json'}
        new MiniCssExtractPlugin(),
    ],
    devServer: {
        contentBase: path.join(__dirname),
        compress: true,
        port: 9000,
        index: '<%= name%>.html'
    }
});