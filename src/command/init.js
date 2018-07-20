'use strict'

const { WKSIN_TEMPLATE_PC_GIT, WKSIN_TEMPLATE_MOBILE_GIT, getQuestionList} = require('../config/global');
const { checkVersion, hasCommand } = require('../common/util');
const exec = require('child_process').exec;
const ora = require('ora'); 
const inquirer = require('inquirer');
const Log = require('../common/log')

class ProjectInit {
    constructor () {
        this.init();
    }
    async init () {
        let gitInstalled = await hasCommand('git');
        if (gitInstalled) {
            checkVersion().then(() => {
                this.getQuestions();
            })
        } else {
            Log.error('错误提示：本机没有安装 Git 不能初始化项目')
        }
    }
    async getQuestions () {
        const QUESTION_LIST = await getQuestionList();
        inquirer.prompt(QUESTION_LIST).then((answers) => {
            console.log('结果为:')
            console.log(answers)
        })
    }
    downProjectFromGit () {}
}

module.exports = new ProjectInit()
