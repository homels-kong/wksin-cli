'use strict'
let { checkVersion } = require('../common/checkVersion')

process.env.NODE_PATH = __dirname + '/../node_modules/'

const program = require('commander')

checkVersion().then(async () => {
    program
    .version(require('../../package').version )

    program
        .usage('<command>')

    program
        .command('init')
        .description('初始化项目')
        .alias('i')
        .action(() => {
            require('./init')
        })
    program
        .command('build')
        .description('构建生产环境 wksin 项目')
        .alias('i')
        .action(() => {
            require('../build')
        })

    program.parse(process.argv)

    if(!program.args.length){
        program.help()
    }
})