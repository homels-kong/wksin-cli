
let cwd = process.cwd();
let path = require('path');
let _ = require('lodash');
const { getWebpackConfig } = require('../common/util');
const { getLoaders, getResolveLoader} = require('./webpack.base');
const webpackPlugins = require('./webpack.plugin')

let defaultConfig = {
    mode: 'development',
    /**
     * 打包入口
     */
    entry: {},
    /**
     * 编译之后的输出文件
     */
    output: {
        filename: 'js/[name].js',
        path: path.resolve(cwd, './dist'),
        /**
         * 静态资源前缀
         */
        publicPath: '/'
    },
    /**
     * loader配置
     */
    module: {
        rules: getLoaders()
    },
    /**
     * 插件配置
     */
    plugins: webpackPlugins,
    /**
     * 脚手架编译项目的话，这儿可能是坑
     */
    resolveLoader: getResolveLoader()
};
/**
 * 合并项目与默认的webapcck配置
 */
async function mergeWebpackConfig() {
    try {
        let projectWebpackConfig = await getWebpackConfig(cwd);
        if (projectWebpackConfig) {
            return _.merge(defaultConfig, projectWebpackConfig)
        }
        return defaultConfig;
    } catch (e) {
        throw new Error(e);
    }
}

module.exports = mergeWebpackConfig