/**
 * 检查wksin线上最新版本号
 */
const axios = require('axios');
const ora = require('ora');
const chalk = require('chalk');

const WKSIN_NPM_REGISTRY = 'http://registry.npmjs.org/wksin';

module.exports = {
    checkVersion: async () => {
        let packageInfo = await axios.get(WKSIN_NPM_REGISTRY);
        if (packageInfo) {
            let lastVersion = packageInfo.data['dist-tags'].latest;
            console.log(chalk.blue(`当前wksin最新版本号为${lastVersion},请及时更新`))
        } else {
        }
    }
}