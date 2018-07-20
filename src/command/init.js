'use strict'
const { WKSIN_TEMPLATE_PC_GIT, WKSIN_TEMPLATE_MOBILE_GIT, QUESTION_LIST} = require('../config/global');
const exec = require('child_process').exec;
const chalk = require('chalk');
const ora = require('ora'); 
const inquirer = require('inquirer');
const Log = require('../common/log')

class ProjectInit {
    constructor () {
        this.getQuestions();
    }
    init () {}
    getQuestions () {
        inquirer.prompt(QUESTION_LIST).then((answers) => {
            console.log('结果为:')
            console.log(answers)
        })
    }
    downProjectFromGit () {}
}

module.exports = new ProjectInit()
