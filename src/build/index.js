
const webpack = require('webpack');
const webpackDefaultConfig = require('../config/webpack');
const Log = require('../common/log');
const ora = require('ora'); 

class Runtime {
    constructor () {
        this.run();
        this.watching = null;
        this.spinner = null;
    }
    /**
     * 运行webpack
     */
    async run () {
        Log.info('[wksin] 开始读取配置文件');

        this.config = await webpackDefaultConfig();

        Log.info('[wksin] 读取配置文件成功');
        Log.info('[wksin] 开始构建项目');
        this.spinner = ora('[wksin] 正在构建构......').start()
        this.complier = webpack(this.config);

        this.complier.run((err, stats) => {
            this.spinner.stop();
            if (err) {
                if (err.details) {
                    Log.error(err.details);
                }
                return;
            }
        
            const info = stats.toJson();
        
            if (stats.hasErrors()) {
                Log.error(info.errors);
            }
        
            if (stats.hasWarnings()) {
                Log.warn(info.warnings);
            }

            if (!err && !stats.hasErrors()) {
                Log.info('[wksin] 项目构建完成');
            }
        });

        this.watch();
    }
    /**
     * 监听webpack
     */
    async watch () {
        this.watching = this.complier.watch({
            aggregateTimeout: 300,
            poll: undefined
        }, (err, stats) => {
            if (err) {
                if (err.details) {
                    Log.error(err.details);
                }
                return;
            }
        
            const info = stats.toJson();
        
            if (stats.hasErrors()) {
                Log.error(info.errors);
            }
        
            if (stats.hasWarnings()) {
                Log.warn(info.warnings);
            }
        });
    }
    /**
     * 关闭监听webpack
     */
    async close () {
        watching.close(() => {
            Log.info('关闭 Webpack 监听......')
        });
    }
}

module.exports = new Runtime()