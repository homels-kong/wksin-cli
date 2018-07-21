
const webpack = require('webpack');
const webpackDefaultConfig = require('../config/webpack');
const Log = require('../common/log');

class Runtime {
    constructor () {
        this.run();
        this.watching = null;
    }
    /**
     * 运行webpack
     */
    async run () {
        this.config = await webpackDefaultConfig();
        this.complier = webpack(this.config);

        this.complier.run((err, stats) => {
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