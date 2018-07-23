/**
 * webpack基本配置
 * 
 * author: wukong
 */

const path = require('path');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

/**
 * webpack打包默认的loader
 */
exports.getLoaders = function () {
     return  [
        {
          test: /\.vue$/,
          loader: 'vue-loader'
        },
        {
          test: /\.js$/,
          loader: 'babel-loader'
        },
        {
          test: /\.css$/,
          use: [
    　　  　　  MiniCssExtractPlugin.loader,
    　　 　　   "css-loader"
    　　   ]
        }
      ]
 } 

/**
 * 解析webapck的loader
 */
exports.getResolveLoader = function () {
    let cwd = process.cwd();
        return {
            modules: [
                path.resolve(__dirname, '../../node_modules'), 
                path.resolve(cwd, './node_modules')
            ],
            moduleExtensions: ['-loader']
        }
 }