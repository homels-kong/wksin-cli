/**
 * 对外暴露的方法
 * 
 * author: wukong
 */

const runtime = require('./build/index');
const server = require('./build/app')

module.exports = {
    /**
     * 允许第三方触发编译
     */
    runtime: runtime,
    /**
     * 允许第三方启动服务器
     */
    server: server
}