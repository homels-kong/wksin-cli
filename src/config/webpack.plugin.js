/**
 * webpack打包默认的插件
 */
const VueLoaderPlugin = require('vue-loader/lib/plugin');

module.exports = [
    new VueLoaderPlugin()
]