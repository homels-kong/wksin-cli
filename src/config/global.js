/**
 * wksin框架项目全局配置
 * 
 * author: wukong
 */

const { execSync } = require('child_process');
const LOG = require('../common/log')

/**
 * PC模版git仓库地址
 */
exports.WKSIN_TEMPLATE_PC_GIT = `https://github.com/homels-kong/wksin-core-pc.git`;

/**
 * H5模版git仓库地址
 */
exports.WKSIN_TEMPLATE_MOBILE_GIT = `https://github.com/homels-kong/wksin-core-pc.git`;

/**
 * 本项目的npm包地址
 */
exports.WKSIN_NPM_REGISTRY = 'http://registry.npmjs.org/wksin';

/**
 * 项目默认的webpack配置文件
 */
exports.WEBPACK_DEFAULT_CONFIG = 'wksin.config.js';

/**
 * 项目根目录package
 */
exports.PROJECT_PACKAGE_JSON = 'package.json'
/**
 * 获取Git配置
 */
async function getGitConfig(){
    let gitInfo = {
        author: 'xxx',
        email: 'xxx@qq.com'
    };
    try {
        let author = await execSync('git config --get user.name');
        let email = await execSync('git config --get user.email');

        gitInfo = {
            author: author && author.toString().trim(),
            email: email && email.toString().trim()
        }
    } catch (e) {
        LOG.warn('警告：获取Git配置异常，请检查是否安装了Git')
    }

    return gitInfo;
}

/**
 * 获取问题列表
 */
exports.getQuestionList = async () => {
    let gitInfo = await getGitConfig();
    return [
        {
            'type': 'list',
            'name': 'templateName',
            'message': '请选择要下载的模版',
            'choices': ['PC', 'Mobile'],
            'default': 'PC',
            'pageSize': 1000
        }, {
            'type': 'input',
            'name': 'name',
            'message': '请输入项目名称：',
            'default': 'wksin-project'
        }, {
            'type': 'input',
            'name': 'author',
            'message': '请输入项目作者：',
            'default': gitInfo.author
        }, {
            'type': 'input',
            'name': 'email',
            'message': '请输入email：',
            'default': gitInfo.email
        }, {
            'type': 'input',
            'name': 'description',
            'message': '请输入项目描述：',
            'default': ''
        }
    ]
}
/**
 * 获取是否覆盖提问列表
 */
exports.getCoverList = async () => {
    return [{
        'type': 'list',
        'name': 'isCover',
        'message': '是否覆盖已有项目？',
        'choices': ['y', 'n'],
        'default': 'y',
        'pageSize': 1000
    }]
}

