/**
 * 检查wksin线上最新版本号
 */
const axios = require('axios');
const ora = require('ora');
const chalk = require('chalk');
const Log = require('../common/log')

const WKSIN_NPM_REGISTRY = 'http://registry.npmjs.org/wksin';

module.exports = {
    checkVersion: async () => {
        let packageInfo = await axios.get(WKSIN_NPM_REGISTRY);
        if (packageInfo) {
            let lastVersion = packageInfo.data['dist-tags'].latest;

            Log.info(chalk.green(`当前wksin最新版本号为${lastVersion},请及时更新`))
            Log.info(chalk.green('欢迎使用 wksin 前端解决方案'))
            Log.space(2)
        } else {
        }
    }
}