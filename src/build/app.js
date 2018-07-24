/**
 * 服务启动封装
 * 
 * author: wukong
 */

const Runtime = require('./index');
const devMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require("webpack-hot-middleware");
const historyMiddleware = require('connect-history-api-fallback');
const express = require('express');
const app = express();
const Log = require('../common/log');

class WksinCore {
    constructor () {
        this.runtime = new Runtime();
        /**
         * 编译器
         */
        this.complier = null;
        this.startCompile();
    }
    /**
     * 先构建项目
     */
    async startCompile () {
        Log.warn('[wksin] 开始启动服务......')
        let complier = await this.runtime.getComplier();
        this.startServer(complier);
    }
    /**
     * 启动服务器
     */
    async startServer (complier) {
        if (complier) {
            /**
             * devMiddleware 实例
             */
            let devMiddlewareIntance = devMiddleware(complier, {
                publicPath: complier.options.output.publicPath,
                noInfo: true,
                stats: {
                    colors: true
                },
                hot: true,
                logLevel: 'info'
            });
            
            let clientMFS = devMiddlewareIntance.fileSystem;
            complier.outputFileSystem = clientMFS;

            /**
             * 执行中间件
             */
            app.use(devMiddlewareIntance);
            
            /**
             * Vue实现history方式
             */
            app.use(historyMiddleware({
                htmlAcceptHeaders: ['text/html', 'application/xhtml+xml'],
                rewrites: [
                    { from: /^\/abc$/, to: '/' }
                ]
            }));

            /**
             * 监听变化
             */
            devMiddlewareIntance.waitUntilValid(() => {
                Log.info('[wksin] App热启动成功');
                Log.warn('[wksin] 开始监控文件变化......')
            })
            
            /**
             * 热启动
             */
            let hotMiddleware = webpackHotMiddleware(complier, {
                log: console.log,
                heartbeat: 10 * 1000
            });

            app.use(hotMiddleware);
            /**
             * 更改模版重启站点
             */
            complier.plugin('compilation', compilation => {
                compilation.plugin('html-webpack-plugin-after-emit', (data, cb) => {

                    hotMiddleware.publish({
                        action: 'reload'
                    });

                    cb();
                })
            })

            app.listen(3000, () => console.log('App listening on port 3000!'))
        }
    }
}

module.exports = new WksinCore()