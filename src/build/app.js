/**
 * 服务启动封装
 * 
 * author: wukong
 */

const Runtime = require('./index');
const CWD = process.cwd();
const devMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require("webpack-hot-middleware");
const historyMiddleware = require('connect-history-api-fallback');
const express = require('express');
const path = require('path');
const app = express();
const opn = require('opn');
const Log = require('../common/log');
const PORT = 3001;
const PAGE_URI = `http://localhost:${PORT}`;

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
                noInfo: false,
                stats: {
                    colors: true
                },
                hot: true,
                logLevel: 'silent'
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
                disableDotRule: true
            }));

            // 必须在 historyMiddleware 插件之后
            app.use(express.static('./dist'));
            /**
             * 监听变化
             */
            devMiddlewareIntance.waitUntilValid(async () => {
                Log.info('[wksin] App热启动成功');
                Log.warn('[wksin] 开始监控文件变化......');
                opn(PAGE_URI);
            })
            
            /**
             * 热启动
             */
            let hotMiddleware = webpackHotMiddleware(complier, {
                log: async (msg) => {
                    Log.space(1);
                    Log.info(msg.replace(/^webpack/, '[wksin]'));

                    if (msg.indexOf('built') > 0) {
                       // await this.runtime.run(complier)
                    }
                },
                heartbeat: 10 * 1000
            });

            app.use(hotMiddleware);
            /**
             * 更改模版重启站点
             * 这儿有坑，貌似不起作用
             */
            complier.plugin('compilation', compilation => {
                compilation.plugin('html-webpack-plugin-after-emit', (data, cb) => {
                    hotMiddleware.publish({
                        action: 'reload'
                    });
                    // cb();
                })
            })

            app.listen(PORT, () => console.log(`App listening on port ${PORT}!`))
        }
    }
}

module.exports = new WksinCore()