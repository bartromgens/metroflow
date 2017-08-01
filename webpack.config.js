const path = require("path");
var ManifestPlugin = require('webpack-manifest-plugin');
var WebpackCleanupPlugin = require('webpack-cleanup-plugin');
var ExtractTextPlugin = require("extract-text-webpack-plugin");


module.exports = {
    context: __dirname,
    entry: {
        core: "./src/js/core.js",
        map: "./src/js/map.js",
        track: "./src/js/track.js",
        segment: "./src/js/segment.js",
        station: "./src/js/station.js",
        connection: "./src/js/connection.js",
        styles: "./src/js/styles.js",
        snap: "./src/js/snap.js",
        serialize: "./src/js/serialize.js",
        revision: "./src/js/revision.js",
        interaction: "./src/js/interaction.js",
        sidebar: "./src/js/sketcher/sidebar.js",
        toolbar: "./src/js/sketcher/toolbar.js",
        contextmenu: "./src/js/sketcher/contextmenu.js",
        sketcher: "./src/js/sketcher/sketcher.js",
        css: ["./src/css/basic.css"]
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
        ],
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
         ]
    },
    externals: {
        paper: "paper"
    },
    plugins: [
        new ManifestPlugin(),
//        new ExtractTextPlugin("metro.[contenthash].css"),
        new ExtractTextPlugin("metroflow-basic.css"),
        new WebpackCleanupPlugin(),
    ],
};
