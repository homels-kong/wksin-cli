/**
 * 初始化项目
 * 
 * author: wukong
 */

'use strict'
const { WKSIN_TEMPLATE_PC_GIT, WKSIN_TEMPLATE_MOBILE_GIT, PROJECT_PACKAGE_JSON, getQuestionList, getCoverList } = require('../config/global');
const { checkVersion, hasCommand, fsExists, deleteFiles, copyFiles, mergePackageJson } = require('../common/util');
const { exec } = require('mz/child_process');
const ora = require('ora'); 
const inquirer = require('inquirer');
const Log = require('../common/log')

class ProjectInit {
    constructor () {
        this.init();
        this.templateName = '';
        this.projectName = '';
        this.packageConfig = {};
        this.spinner = ora();
        /**
         * 模版先下载到临时目录
         */
        this.tempPath = '.temp';
    }
    async init () {
        let gitInstalled = await hasCommand('git');
        if (gitInstalled) {
            checkVersion().then(() => {
                this.downProjectFromGit();
            })
        } else {
            Log.error('错误提示：本机没有安装 Git 不能初始化项目')
        }
    }
    /**
     * 获取问题列表
     */
    async prompQuestions () {
        const QUESTION_LIST = await getQuestionList();
        return await inquirer.prompt(QUESTION_LIST);
    }
    /**
     * 是否覆盖原有项目
     */
    async prompCover () {
        const COVER_LIST = await getCoverList();
        return await inquirer.prompt(COVER_LIST);
    }
    /**
     * 回填用户init时填的参数
     */
    async mergePackageInfo () {
        return await mergePackageJson(process.cwd(), this.projectName, this.packageConfig)
    }
    /**
     * 从Git服务器上拉取模版
     */
    async downProjectFromGit () {
        let anwers = await this.prompQuestions();
        if (anwers && anwers.templateName) {
            Log.space(2);

            this.templateName = anwers.templateName;
            this.projectName = anwers.name;
            delete anwers['templateName'];
            this.packageConfig = anwers;
            
            /**
             * 如果当前目录下存在项目，则提示是否覆盖
             */
            let exists = await fsExists(`./${this.projectName}`);
            if (exists) {
                let coverAnswer = await this.prompCover();
                if (coverAnswer && coverAnswer.isCover === 'y') {
                    await deleteFiles(`./${this.projectName}`)
                } else {
                    this.projectName = anwers.name + '-bak'
                }
            }

            this.spinner = ora({
                spinner: 'dots',
                text: `开始下载 ${this.templateName} 框架模版，请耐心等待......`
            });
            this.spinner.start();

            let sourceURL = this.templateName.toLowerCase() === 'pc' ? WKSIN_TEMPLATE_PC_GIT : WKSIN_TEMPLATE_MOBILE_GIT;
            if (sourceURL) {
                try {
                    fsExists(this.tempPath) && deleteFiles(this.tempPath)

                    let result = await exec(`git clone ${sourceURL} ${this.tempPath}`);
                    if (result) {

                        /**
                         * 模版拷贝到真正目录
                         */
                        await copyFiles(this.tempPath, this.projectName);
                        /**
                         * 删除临时目录
                         */
                        await deleteFiles(this.tempPath);
                        /**
                         * 回填package.json信息
                         */
                        await this.mergePackageInfo();

                        this.spinner.stop();
                        Log.info('模版下载成功，执行以下命令启动程序：');
                        Log.info(' cd ' + this.projectName + ' \n npm install \n npm run start')
                    }
                } catch (e) {
                    console.log(e)
                    this.spinner.stop();
                    Log.error('错误提示：模版下载失败，联系开发者（362381574@qq.com）')
                }
            } else {
                Log.error('错误提示：模版仓库地址获取失败')
            }
        } else {
            Log.error('错误提示：模版信息获取异常')
        }
    }
}

module.exports = new ProjectInit()
