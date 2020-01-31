const path = require('path');
const HtmlWebPackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const fs = require('fs');

module.exports = env => {
    // Workaround for having two config trees depending on input. Uses impossible to match regex to avoid errors
    let devExclusion = (env.build==="y" ? /dev/ : /^ $/);
    let config = {
        entry: './src/dev/index.js',
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
        ],
        devServer: {
            contentBase: path.join(__dirname),
            compress: true,
            port: 9000
        }
    }
    return config;
}