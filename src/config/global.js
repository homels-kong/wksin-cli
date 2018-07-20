/**
 * wksin框架项目全局配置
 */

 /**
  * PC模版git仓库地址
  */
exports.WKSIN_TEMPLATE_PC_GIT = `https://github.com/homels-kong/wksin-core-pc.git`;
 /**
  * H5模版git仓库地址
  */
exports.WKSIN_TEMPLATE_MOBILE_GIT = `https://github.com/homels-kong/wksin-core-pc.git`;
/**
 * 问题列表
 */
exports.QUESTION_LIST = [
    {
        'type': 'list',
        'name': 'templateName',
        'message': '请选择要下载的模版',
        'choices': ['PC', 'Mobile'],
        'default': 'PC',
        'pageSize': 1000
    },
    {
        'type': 'input',
        'name': 'name',
        'message': '请输入项目名称：',
        'default': 'wksin-project'
    },
    {
        'type': 'input',
        'name': 'email',
        'message': '请输入email',
        'default': 'xxx@qq.com'
    },
]