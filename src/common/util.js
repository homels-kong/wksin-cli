/**
 * 工具类封装
 * 
 * author: wukong
 */

const axios = require('axios');
const ora = require('ora');
const Log = require('../common/log');
const shell = require('shelljs');
const dns = require('dns');
const fs = require('fs');
const efs = require('fs-extra');
const path = require('path');
const _ = require('lodash');
const { WKSIN_NPM_REGISTRY, WEBPACK_DEFAULT_CONFIG, PROJECT_PACKAGE_JSON } = require('../config/global');

/**
 * 删除指定目录文件
 * 
 * @param {String} path 
 */
async function deleteFiles(path) {
    let files = [];

    if (fs.existsSync(path)) {
        files = fs.readdirSync(path);
        files.forEach((file, index) => {
            let curPath = path + "/" + file;
            if (fs.statSync(curPath).isDirectory()) {
                deleteFiles(curPath);
            } else {
                fs.unlinkSync(curPath);
            }
        });

        fs.rmdirSync(path);
    }
}

const tools = {
    /**
     * 检查wksin线上版本
     */
    checkVersion: async () => {
        let spinner = ora().start();
        spinner.color = 'red';
        spinner.text = '正在检查线上 wksin 包版本号.....'

        let packageInfo = await axios.get(WKSIN_NPM_REGISTRY);

        spinner.stop();
        if (packageInfo) {
            let lastVersion = packageInfo.data['dist-tags'].latest;

            Log.info(`当前 wksin 最新版本号为 ${lastVersion},请及时更新`)
            Log.info('欢迎使用 wksin 前端解决方案')
            Log.space(2)
        } else {}
    },
    /**
     * 检查是否支持命令
     */
    hasCommand: async (commandName) => {
        return shell.which(commandName)
    },
    /**
     * 检查是否联网, 我们测网速通常都是访问百度服务器吧，哈哈
     */
    isOnline: async () => {
        return new Promise((resolve, reject) => {
            dns.lookup('www.baidu.com', (err, address, family) => {
                if (err) {
                    reject();
                } else {
                    resolve();
                }
            })
        })
    },
    /**
     * 判断指定路径是否存在
     */
    fsExists: async path => {
        return await fs.existsSync(path)
    },
    /**
     * 删除指定路径文件
     */
    deleteFiles: async path => {
        deleteFiles(path);
    },
    /**
     * 复制指定文件目录
     */
    copyFiles: async (fromPath, toPath) => {
        try {
            if (!fs.existsSync(toPath)) {
                await fs.mkdirSync(toPath)
            }

            return await efs.copySync(fromPath, toPath)
        } catch (e) {
            throw new Error(e);
        }
    },
    /**
     * 获取项目默认生成的webpack配置文件
     */
    getWebpackConfig: async (cwd) => {
       let defaultConfig = {};
       let filePath = path.resolve(cwd, './' + WEBPACK_DEFAULT_CONFIG)

       if (fs.existsSync(filePath)) {
           defaultConfig = require(filePath)
       } else {
           throw new Error('错误提示：项目缺少配置文件 wksin.config.js ')
       }

       return defaultConfig;
    },
    /**
     * 合并package.json信息
     */
    mergePackageJson: async (cwd, projectName, answers) => {
        let filePath = path.resolve(cwd, `./${projectName}/` + PROJECT_PACKAGE_JSON);
        let packageInfo = null;

        if (fs.existsSync(filePath)) {
            packageInfo = require(filePath);
            if (packageInfo) {
                packageInfo = _.merge(packageInfo, answers);
                try {
                    let str = JSON.stringify(packageInfo, null, 4);
                    await efs.writeFileSync(filePath, str)
                } catch (e) {
                    throw new Error(e)
                }
            }
        }
    }
}

module.exports = tools