const path = require('path');

module.exports = {
    entry: "./src/js/ipcalc.js",
    output: {
        filename: "bundle.js",
        path: path.join(__dirname, "public/js")
    },
    resolve: {
        alias: {
            vue: 'vue/dist/vue.js'
        }
    }
}
