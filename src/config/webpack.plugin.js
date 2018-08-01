/**
 * webpack打包默认的插件
 * 
 * author: wukong
 */

const path = require('path');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const WebpackHotMiddleware = require('webpack-hot-middleware');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const ENV = process.env.NODE_ENV;
const webpack = require('webpack');

let cwd = process.cwd();

let plusgins = [
    new VueLoaderPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.optimize.SplitChunksPlugin({
        chunks: "all",
        minSize: 20000,
        minChunks: 1,
        maxAsyncRequests: 5,
        maxInitialRequests: 3,
        name: true,
        cacheGroups: {
            vendors: {
                test: /[\\/]node_modules[\\/]/,
                name: "vendor",
                chunks: "all"
            },
            manifest: {
                name: "manifest",
                chunks: "initial",
                minChunks: 2    
            }
        }    
    })
]

/**
 * 生产环境加入 mini-css-extract-plugin 插件
 */
if (ENV === 'production') {
    plusgins.push(
        new MiniCssExtractPlugin({
            filename: 'css/[name].[hash].css'
        })
    )
}

/**
 * 支持多个模版渲染
 * @param {Object} webpackConfig 
 */
exports.getWebpackPlugin = (webpackConfig) => {

    if (webpackConfig && webpackConfig.plugin) {
        if (webpackConfig.plugin.templatePath) {
            let templatePath = webpackConfig.plugin.templatePath;
            if (Array.isArray(templatePath)) {
                templatePath.forEach(item => {
                    plusgins.push(
                        new HtmlWebpackPlugin({
                            template: path.resolve(cwd, item),
                            chunksSortMode: 'none',
                            inject: true,
                            minify: {
                                removeComments: true,
                                collapseWhitespace: true,
                                removeAttributeQuotes: true
                            }
                        })
                    )
                })
            } else {
                throw new Error('项目 wksin.config.js 中配置模版路径格式不正确，必须是数组')
            }
        } else {
            throw new Error('没有在项目 wksin.config.js 中配置模版路径')
        }
    }

    return plusgins;
}