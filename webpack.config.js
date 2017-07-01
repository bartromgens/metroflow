const path = require("path");
var ManifestPlugin = require('webpack-manifest-plugin');
var WebpackCleanupPlugin = require('webpack-cleanup-plugin');
var ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = {
    context: __dirname,
    entry: {
        paperexample: "./src/js/paperexample.js",
        css: ["./src/css/custom.css"]
    },
    output: {
        library: ["MetroFlow", "[name]"],
        libraryTarget: "var",
        path: path.join(__dirname, "/dist/"),
        //filename: "metroflow.[name].[chunkhash].js"
        filename: "metroflow.[name].js"
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: ExtractTextPlugin.extract({
                    fallback: "style-loader",
                    use: "css-loader"
                })
            }
        ]
    },
    externals: {
        paper: "paper.js"
    },
    plugins: [
        new ManifestPlugin(),
//        new ExtractTextPlugin("paperexample.[contenthash].css"),
        new ExtractTextPlugin("paperexample.css"),
        new WebpackCleanupPlugin(),
    ],
};
