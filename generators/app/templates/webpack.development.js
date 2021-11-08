const path = require('path');
const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const ESLintPlugin = require('eslint-webpack-plugin');

module.exports = merge(common, {
    mode: 'development',
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
        new ESLintPlugin({
            extensions: ['js'],
            exclude: ['/node_modules/', '/\.dev/'],
            formatter: 'stylish'
        }),
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