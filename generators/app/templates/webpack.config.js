const path = require('path');
const HtmlWebPackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const FixStyleOnlyEntriesPlugin = require('webpack-fix-style-only-entries');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const ImageminPlugin = require('imagemin-webpack');
const ImageminMozjpeg = require('imagemin-mozjpeg');
const ImageminPngquant = require('imagemin-pngquant');
const ImageminGiflossy = require('imagemin-giflossy');
const ImageminSvgo = require('imagemin-svgo');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = env => {
    // Workaround for having two config trees depending on input. Uses impossible to match regex to avoid errors
    let devExclusion = env.build === 'y' ? /\.dev/ : /^ $/;
    let entryPoint = env.build === 'y' ? './src/app/index.js' : './src/.dev/index.js';
    let sourceMap = env.build === 'y' ? false : true;
    let config = {
        entry: entryPoint,
        devtool: sourceMap ? 'source-map' : '',
        module: {
            rules: [
                {
                    test: /\.css$/,
                    exclude: devExclusion,
                    use: [
                        {
                            loader: MiniCssExtractPlugin.loader,
                            options: {
                                publicPath: path.resolve(__dirname, 'dist')
                            }
                        },
                        'css-loader'
                    ]
                },
                {
                    enforce: 'pre',
                    test: /\.js$/,
                    exclude: [/node_modules/, /dev/],
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
                    exclude: [/node_modules/, devExclusion],
                    use: {
                        loader: 'babel-loader',
                        options: {
                            presets: ['@babel/preset-env']
                        }
                    },
                },
                {
                    test: /\.html$/,
                    exclude: devExclusion,
                    use: [
                        {
                            loader: 'html-loader',
                            options: { minimize: true }
                        }
                    ]
                },
                {
                    test: /\.(png|svg|jpg|gif)$/,
                    exclude: devExclusion,
                    use: [
                        'file-loader'
                    ]
                }
            ]
        },
        output: {
            path: path.resolve(__dirname, 'dist'),
            filename: '<%= name%>.js'
        },
        plugins: [
            new HtmlWebPackPlugin({
                <% if (isButton) { %>
                template: './src/dev/<%= name%>.html',
                <% } else { %>
                template: './src/app/<%= name%>.html',
                <% } %>
                filename: './<%= name%>.html'
            }),
            new MiniCssExtractPlugin({
                name: '[name].css',
                chunkFilename: '[id].css'
            }),
            new FixStyleOnlyEntriesPlugin(),
            new OptimizeCSSAssetsPlugin({}),
            new UglifyJsPlugin({
                test: /\.js(\?.*)?$/i,
                sourceMap
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
                { from: './src/app/config.json'}
            ])
        ],
        devServer: {
            contentBase: path.join(__dirname),
            compress: true,
            port: 9000,
            index: '<%= name%>.html'
        }
    }
    return config;
}