const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
    entry: './src/app.js',
    mode: 'development',
    output: {
        filename: 'main.js',
        path: path.resolve(__dirname, 'dist'),
        //пересобирается папка dist (удаляется и заново устанавливается)
        // clean: true,
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: "./index.html"
        }),
        new CopyPlugin({
            patterns: [
                {from: "templates", to: "templates"},
                // {from: "static/fonts", to: "fonts"},
                // {from: "static/images", to: "images"},
                // {from: "styles", to: "styles"},
            ],
        }),
    ],
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        targets: "defaults",
                        presets: [
                            ['@babel/preset-env']
                        ]
                    }
                }
            }
        ]
    },
    devServer: {
        static: './dist',
        compress: true,
        port: 9000,
    },
};
