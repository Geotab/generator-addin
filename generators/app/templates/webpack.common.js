const path = require('path');
const HtmlWebPackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
    plugins: [
        new HtmlWebPackPlugin({
            <% if (isButton) { %>
            template: './src/.dev/<%= name%>.html',
            <% } else { %>
            template: './src/app/<%= name%>.html',
            <% } %>            
            filename: './<%= name%>.html'
        }),
        new MiniCssExtractPlugin({
            filename: '[name].css',
            chunkFilename: '[id].css'
        }),
    ],
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '<%= name%>.js'
    }
}