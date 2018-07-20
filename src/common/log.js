/**
 * log打印的封装
 * 
 */
const chalk = require('chalk');

class Log {
    /**
     * 打印空格
     * 
     * @param {number} num 空格数量
     */
    space (num = 1) {
       if (num <= 0) {
           num = 1
       }
       for (let i = 0;i < num; i++) {
           console.log()
       }
    }
    info (msg) {
        console.log(chalk.green(msg))
    }
    warn (msg) {
        console.log(chalk.yellow(msg))
    }
    error (msg) {
        console.log(chalk.red(msg))
    }
}

module.exports = new Log()