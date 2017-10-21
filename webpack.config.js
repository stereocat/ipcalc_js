const path = require('path');
const webpack = require("webpack");

const DEBUG = process.argv.includes('--debug'); // `webpack --debug` or NOT
const plugins = [
    new webpack.optimize.OccurrenceOrderPlugin(),
];
if (!DEBUG) {
    plugins.push(
        new webpack.optimize.UglifyJsPlugin(),
        new webpack.optimize.AggressiveMergingPlugin()
    );
}

module.exports = {
    entry: "./src/js/ipcalc.js",
    output: {
        filename: "bundle.js",
        path: path.join(__dirname, "public/js")
    },
    plugins: plugins,
    devtool: DEBUG ? "#cheap-module-eval-source-map" : "#cheap-module-source-map",
    resolve: {
        alias: {
            vue: 'vue/dist/vue.js'
        }
    }
}
