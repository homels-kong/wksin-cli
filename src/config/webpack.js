
let cwd = process.cwd();
let path = require('path');
let _ = require('lodash');
const { getWebpackConfig } = require('../common/util');

let defaultConfig = {
    entry: {
        main: './dist'
    },
    output: {
        filename: '[name].js',
        path: path.resolve(cwd, './dist')
    }
};
/**
 * 合并项目与默认的webapcck配置
 */
async function mergeWebpackConfig() {
    let projectWebpackConfig = await getWebpackConfig(cwd);
    if (projectWebpackConfig) {
        return _.merge(defaultConfig, projectWebpackConfig)
    }

    return defaultConfig;
}

module.exports = mergeWebpackConfig