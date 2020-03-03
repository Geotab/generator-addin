const path = require('path');
const FixStyleOnlyEntriesPlugin = require('webpack-fix-style-only-entries');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const ImageminPlugin = require('imagemin-webpack');
const ImageminMozjpeg = require('imagemin-mozjpeg');
const ImageminPngquant = require('imagemin-pngquant');
const ImageminGiflossy = require('imagemin-giflossy');
const ImageminSvgo = require('imagemin-svgo');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const config = require('./src/app/config.json');

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
    // Appending the host to all item's url and icon
    for(let i=0;i<len;i++){
        config.items[i].url = host + config.items[i].url;
        config.items[i].icon = host + config.items[i].icon; 
    }

    delete config['dev'];
    let response = JSON.stringify(config, null, 2);
    // Returned string is written to file
    return response;
}

module.exports = merge(common, {
    devtool: '',
    entry: './src/app/index.js',
    module: {
        rules: [
            {
                test: /\.css$/,
                exclude: /\.dev/,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            publicPath: path.resolve(__dirname, 'dist')
                        }
                    },
                    'css-loader',
                    {
                        loader: './src/.dev/loaders/css-sandbox/css-sandbox.js',
                        options: { prefix: '#<%= name%>' }
                    }
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
        new FixStyleOnlyEntriesPlugin(),
        new OptimizeCSSAssetsPlugin({}),
        new UglifyJsPlugin({
            test: /\.js(\?.*)?$/i
        }),
        new ImageminPlugin({
            exclude: /dev/,
            test: /\.(jpe?g|png|gif|svg)$/,
            plugins: [
                ImageminMozjpeg(),
                ImageminPngquant(),
                ImageminGiflossy(),
                ImageminSvgo({ cleanupIDs: false})
            ]
        }),
        new CopyWebpackPlugin([
            { from: './src/app/images/icon.svg', to: 'images/'},
            { 
                from: './src/app/config.json',
                transform: transform
            }
        ])
    ],
    output: {
        publicPath: config.dev.dist.host
    }
});