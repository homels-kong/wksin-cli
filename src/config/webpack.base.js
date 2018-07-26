/**
 * webpack基本配置
 * 
 * author: wukong
 */

const path = require('path');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const { getWebpackConfig } = require('../common/util');
const env = process.env.NODE_ENV;
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
    }];
    
    let cssLoader = {
        test: /\.css$/,
        exclude: /node_modules/,
        use: [
  　　 　　  "css-loader"
  　　   ]
    };
    /**
     * css-loader 单独处理，在dev环境下单独提取css文件的话，热更新有异常
     */
    if (env === 'production') {
        cssLoader.use.unshift(MiniCssExtractPlugin.loader);
    } else {
        cssLoader.use.unshift("style-loader");
    }

    loaders.push(cssLoader);

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