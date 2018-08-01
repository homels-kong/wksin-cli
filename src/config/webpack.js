/**
 * webpack配置
 * 
 * author: wukong
 */

let cwd = process.cwd();
let path = require('path');
let _ = require('lodash');

const { getWebpackConfig } = require('../common/util');
const { getLoaders, getResolveLoader} = require('./webpack.base');
const { getWebpackPlugin } = require('./webpack.plugin');
const NODE_ENV = process.env.NODE_ENV;

const hotModuleJs = 'webpack-hot-middleware/client?path=/__webpack_hmr&timeout=10000&reload=true';

let defaultConfig = {
    mode: NODE_ENV,
    /**
     * 打包入口
     */
    entry: {},
    /**
     * 编译之后的输出文件
     */
    output: {
        filename: 'js/[name].[hash].js',
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
        rules: []
    },
    /**
     * 插件配置
     */
    plugins: [],
    /**
     * 脚手架编译项目的话，这儿可能是坑
     */
    resolveLoader: getResolveLoader(),
    /**
     * 根目录为@
     */
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './')
        },
    },
    optimization: {
        splitChunks: {
          cacheGroups: {
            commons: {
              name: 'commons',
              chunks: 'initial',
              minChunks: 2
            }
          }
        }
    }
};

/**
 * 获取webpack默认配置
 */
async function getDefaultConfig () {
    let loaders = await getLoaders();

    defaultConfig.module.rules = loaders;
    return defaultConfig;
}

/**
 * 合并项目与默认的webapcck配置
 */
async function mergeWebpackConfig () {
    try {
        let defaultConfig = await getDefaultConfig();
        let projectWebpackConfig = await getWebpackConfig(cwd);
        let plugins = getWebpackPlugin(projectWebpackConfig);

        if (plugins) {
            defaultConfig.plugins = plugins;
        }
        /**
         * development 环境下启用HMR
         */
        if (projectWebpackConfig && NODE_ENV === 'development') {
            Object.keys(projectWebpackConfig.base.entry || {}).forEach(key => {
                if (Array.isArray(projectWebpackConfig.base.entry[key])) {
                    projectWebpackConfig.base.entry[key] = projectWebpackConfig.base.entry[key].concat(
                        [hotModuleJs]
                    )
                } else {
                    projectWebpackConfig.base.entry[key] = [projectWebpackConfig.base.entry[key]].concat(
                        [hotModuleJs]
                    )
                }
            })
        }
        return _.merge(defaultConfig, projectWebpackConfig.base)
    } catch (e) {
        throw new Error(e);
    }
}

module.exports = mergeWebpackConfig