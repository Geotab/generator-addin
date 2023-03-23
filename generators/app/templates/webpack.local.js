/* eslint-disable */
const path = require('path');
// const FixStyleOnlyEntriesPlugin = require('webpack-fix-style-only-entries');
// const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
// const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
// const ImageminPlugin = require('imagemin-webpack');
// const ImageminMozjpeg = require('imagemin-mozjpeg');
// const ImageminPngquant = require('imagemin-pngquant');
// const ImageminGiflossy = require('imagemin-giflossy');
// const ImageminSvgo = require('imagemin-svgo');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const config = require('./src/app/config.json');
const ESLintPlugin = require('eslint-webpack-plugin');

/**
 * Removes "dev" element of the config tree on production build
 * 
 * @param {Buffer} content content of file
 * @param {string} path path to file
 */
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

module.exports = merge(common, {
    // devtool: '',
    entry: {
        driverProductivity: './src/app/index.js'
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                exclude: /\.dev/,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            publicPath: ''
                        }
                    },
                    'css-loader',
                    {
                        loader: './src/.dev/loaders/css-sandbox/css-sandbox.js',
                        options: { prefix: '#driverProductivity' }
                    }
                ]
            },
            {
                test: /\.js$/,
                exclude: [/node_modules/, /\.dev/],
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env']
                    }
                },
            },
            {
                test: /\.html$/,
                exclude: /\.dev/,
                use: [
                    {
                        loader: 'html-loader',
                        options: { minimize: true }
                    }
                ]
            },
            {
                test: /\.(png|svg|jpg|gif)$/,
                exclude: /\.dev/,
                use: [
                    'file-loader'
                ]
            }
        ]
    },
    plugins: [
        // new FixStyleOnlyEntriesPlugin(),
        new ESLintPlugin({
            exclude: ['node_modules', '.dev'],
        }),
        // new OptimizeCSSAssetsPlugin({}),
        // new UglifyJsPlugin({
        //     test: /\.js(\?.*)?$/i
        // }),
        // new ImageminPlugin({
        //     exclude: /dev/,
        //     test: /\.(jpe?g|png|gif|svg)$/,
        //     plugins: [
        //         ImageminMozjpeg(),
        //         ImageminPngquant(),
        //         ImageminGiflossy(),
        //         ImageminSvgo({ cleanupIDs: false })
        //     ]
        // }),
        new CopyWebpackPlugin({
            patterns: [
                { from: './src/app/images/icon.svg', to: 'images/' },
                {
                    from: './src/app/config.json',
                    transform: transform,
                    to: 'configuration.json'
                },
                { from: './src/app/translations/', to: 'translations/' }
            ]
        })
    ],
    output: {
        publicPath: ''
    }
});