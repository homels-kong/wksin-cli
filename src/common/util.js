/**
 * 公共类库
 */
const axios = require('axios');
const ora = require('ora');
const Log = require('../common/log');
const shell = require('shelljs');
const dns = require('dns');
const { WKSIN_NPM_REGISTRY } = require('../config/global');

module.exports = {
    /**
     * 检查wksin线上版本
     */
    checkVersion: async () => {
        let packageInfo = await axios.get(WKSIN_NPM_REGISTRY);
        if (packageInfo) {
            let lastVersion = packageInfo.data['dist-tags'].latest;

            Log.info(`当前wksin最新版本号为${lastVersion},请及时更新`)
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
    }
}