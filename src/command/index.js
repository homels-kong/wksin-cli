'use strict'
const { checkVersion, checkGitInstalled, isOnline } = require('../common/util');
const program = require('commander');
const LOG = require('../common/log');

process.env.NODE_PATH = __dirname + '/../node_modules/'

isOnline().then(() => { 
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
        .alias('b')
        .action(() => {
           let Runtime = require('../build');
           new Runtime().run();
        })
    
    program
        .command('start')
        .description('启动本地 wksin 项目')
        .alias('s')
        .action(() => {
            require('../build/app')
        })

    program.parse(process.argv)

    if(!program.args.length){
        program.help()
    }
}, () => {
    LOG.error('错误提示：使用wksin初始化项目必须在有网络状态下')
})
