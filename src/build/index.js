/**
 * 项目构建封装
 * 
 * author: wukong
 */

const webpack = require('webpack');
const webpackDefaultConfig = require('../config/webpack');
const Log = require('../common/log');
const ora = require('ora'); 

class Runtime {
    constructor () {
        this.watching = null;
        this.spinner = null;
    }
    /**
     * 运行webpack
     */
    async run (complier) {
        let self = this;
        Log.info('[wksin] 开始读取配置文件');

        this.config = await webpackDefaultConfig();

        Log.info('[wksin] 读取配置文件成功');
        Log.info('[wksin] 开始构建项目');

        this.spinner = ora('[wksin] 正在构建......').start()
        try {
            this.complier = complier || webpack(this.config);
        } catch (e) {
            this.spinner.stop();
            Log.error('[wksin] 项目构建失败');
            throw new Error(e);
        }

        return new Promise((resove, reject) => {
            self.complier.run((err, stats) => {
                self.spinner.stop();
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
                    resove(self.complier);
                    // self.watch();
                    Log.info('[wksin] 项目构建完成');
                } else {
                    reject();
                }
            });
        }).catch((e) => {
            Log.error('[wksin] 项目构建失败');
        })
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
        this.watching.close(() => {
            Log.info('关闭 Webpack 监听......')
        });
    }
    /**
     * 获取单个webpack实例
     */
    async getComplier () {
        this.config = await webpackDefaultConfig();
        return webpack(this.config);
    }
    /**
     * 重启编译
     */
    async rebuild () {
        this.close();
        return this.run();
    }
}

module.exports = Runtime