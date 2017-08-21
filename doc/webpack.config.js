var path = require("path");
var webpack = require('webpack');


module.exports = {
    context: __dirname,
    entry: {
        main: ["main.js"],
    },
    output: {
        path: path.join(__dirname, "/dist/"),
        filename: "[name].js"
    },
    module: {
        loaders: [
             // babel loader, testing for files that have a .js extension
             // (except for files in our node_modules folder!).
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: "babel-loader",
                query: {
                    presets: ['es2015'],
                    compact: false // because I want readable output
                }
            }
        ],
    },
    externals: {
        paper: "paper"
    },
};
