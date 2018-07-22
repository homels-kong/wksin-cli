
let cwd = process.cwd();
let path = require('path');
let _ = require('lodash');
const { getWebpackConfig } = require('../common/util');

let defaultConfig = {
    /**
     * 打包入口
     */
    entry: {},
    /**
     * 编译之后的输出文件
     */
    output: {
        filename: 'js/[name].[chunkhash:8].js',
        path: path.resolve(cwd, './dist'),
        /**
         * 静态资源前缀
         */
        publicPath: '/'
    },
    /**
     * loader配置
     */
    module: {},
    /**
     * 插件配置
     */
    plugins: []
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