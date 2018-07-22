
const Runtime = require('./index');
const devMiddleware = require('webpack-dev-middleware');
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
                stats: false,
                logLevel: 'info'
            });
            /**
             * 执行中间件
             */
            app.use(devMiddlewareIntance);
            /**
             * 监听变化
             */
            devMiddlewareIntance.waitUntilValid(() => {
                Log.info('[wksin] App热启动成功');
                Log.warn('[wksin] 开始监控文件变化......')
            })

            app.listen(3000, () => console.log('App listening on port 3000!'))
        }
    }
}

module.exports = new WksinCore()