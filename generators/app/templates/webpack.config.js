const path = require('path');
const HtmlWebPackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const FixStyleOnlyEntriesPlugin = require("webpack-fix-style-only-entries");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const ImageminPlugin = require("imagemin-webpack");

module.exports = env => {
    // Workaround for having two config trees depending on input. Uses impossible to match regex to avoid errors
    let devExclusion = (env.build==="y" ? /dev/ : /^ $/);
    let entryPoint = (env.build==="y" ? './src/app/index.js' : './src/dev/index.js');
    let config = {
        entry: entryPoint,
        module: {
            rules: [
                {
                    test: /\.css$/,
                    exclude: devExclusion,
                    use: [
                        {
                            loader: MiniCssExtractPlugin.loader,
                            options: {
                                publicPath: path.resolve(__dirname, "dist")
                            }
                        },
                        'css-loader'
                        ]
                },
                {
                    test: /\.js$/,
                    exclude: [/node_modules/, devExclusion],
                    use: {
                        loader: "babel-loader",
                        options: {
                            presets: ["@babel/preset-env"]
                        }
                    },
                },
                {
                    test: /\.html$/,
                    exclude: devExclusion,
                    use: [
                        {
                            loader: "html-loader",
                            options: { minimize: true }
                        }
                    ]
                },
                {
                    test: /\.(png|svg|jpg|gif)$/,
                    exclude: devExclusion,
                    use: [
                        "file-loader"
                    ]
                }
            ]
        },
        output: {
            path: path.resolve(__dirname, "dist"),
            filename: "<%= name%>.js"
        },
        plugins: [
            new HtmlWebPackPlugin({
                template: "./src/app/<%= name%>.html",
                filename: "./index.html"
            }),
            new MiniCssExtractPlugin({
                name: '[name].css',
                chunkFilename: '[id].css'
            }),
            new FixStyleOnlyEntriesPlugin(),
            new OptimizeCSSAssetsPlugin({}),
            new UglifyJsPlugin({
                test: /\.js(\?.*)?$/i,
            }),
            new ImageminPlugin({
                exclude: /dev/
            })
        ],
        devServer: {
            contentBase: path.join(__dirname),
            compress: true,
            port: 9000
        }
    }
    return config;
}