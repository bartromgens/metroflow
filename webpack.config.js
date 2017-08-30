var path = require("path");
var webpack = require('webpack');
var ManifestPlugin = require('webpack-manifest-plugin');
var WebpackCleanupPlugin = require('webpack-cleanup-plugin');
var ExtractTextPlugin = require("extract-text-webpack-plugin");


module.exports = {
    context: __dirname,
    entry: {
        metroflow: "./src/js/metroflow.js",
        editor: ["./src/js/editor/editor.js"],
        viewer: ["./src/js/viewer/viewer.js"],
        example_basic: ["./examples/basic/basic.js"],
        css: ["./src/css/editor.css", "./src/css/viewer.css"],
    },
    output: {
        library: "MetroFlow",
        libraryTarget: "umd",
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
        rules: [
            {
                test: /\.css$/,
                use: ExtractTextPlugin.extract({
                    fallback: "style-loader",
                    use: "css-loader"
                })
            }
        ],
    },
    externals: {
        paper: "paper"
    },
    plugins: [
        new ManifestPlugin(),
        new ExtractTextPlugin("metroflow-editor.css"),
        new ExtractTextPlugin("metroflow-viewer.css"),
        new WebpackCleanupPlugin(),
    ],
};
