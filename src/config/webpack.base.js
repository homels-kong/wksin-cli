/**
 * webpack基本配置
 * 
 * author: wukong
 */

const path = require('path');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const { getWebpackConfig } = require('../common/util');
const cwd = process.cwd();
/**
 * webpack打包默认的loader
 */
exports.getLoaders = async function () {
    let webpackConfig = await getWebpackConfig(cwd);

    let loaders = [
        {
          test: /\.vue$/,
          exclude: /node_modules/,
          loader: 'vue-loader'
        },
        {
          test: /\.js$/,
          exclude: /node_modules/,
          loader: 'babel-loader'
        },
        {
          test: /\.css$/,
          exclude: /node_modules/,
          use: [
    　　  　　  MiniCssExtractPlugin.loader,
    　　 　　   "css-loader"
    　　   ]
        }];
    
    if (webpackConfig && webpackConfig.eslint == true) {
        /**
         * 添加到babel-loader的前面
         */
        loaders.unshift({
            enforce: "pre",
            test: /\.js$/,
            exclude: /node_modules/,
            loader: "eslint-loader",
            options: {
                formatter: require("eslint/lib/formatters/stylish")
            }
        });
    }

    return loaders;
 } 

/**
 * 解析webapck的loader
 */
exports.getResolveLoader = function () {
    return {
        modules: [
            path.resolve(__dirname, '../../node_modules'), 
            path.resolve(cwd, './node_modules')
        ],
        moduleExtensions: ['-loader']
    }
 }