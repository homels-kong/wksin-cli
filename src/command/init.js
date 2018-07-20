'use strict'
const { WKSIN_TEMPLATE_PC_GIT, WKSIN_TEMPLATE_MOBILE_GIT, getQuestionList} = require('../config/global');
const { checkVersion } = require('../common/util');
const exec = require('child_process').exec;
const chalk = require('chalk');
const ora = require('ora'); 
const inquirer = require('inquirer');
const Log = require('../common/log')

class ProjectInit {
    constructor () {
        this.init();
    }
    init () {
        checkVersion().then(() => {
            this.getQuestions();
        })
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
