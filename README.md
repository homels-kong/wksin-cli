## 基于vue的前端轻量级脚手架，轻松构建SPA项目，配置一下Json就搞定一个复杂的系统，维护性和可扩展性大大提高

------

### wksin有什么功能？

> * 轻量级脚手架，安装下载都很快
> * 可以在项目中引入wksin，扩展脚手架功能
> * 实现了HMR, 开发简便
> * 搭建了基于Vue的SPA解决方案
> * 基于json的配置化开发
> * 基于Webpack 4.0, 框架提供了灵活的配置

###  环境要求
- [ ] Node > 8.0
- [ ] NPM > 3.0


wksin 提供了命令行工具，可以通过以下命令进行安装

```bash
$ npm install -g wksin
```

再通过 `wksin init` 并填入项目基本信息新建一个项目

```bash
$ wksin init
```
通过 `cd wksin-project` 进入到默认项目

```bash
$ cd wksin-project
```

安装项目依赖

```bash
$ npm install
```

构建项目

```bash
$ wksin build | npm run build
```

启动项目

```bash
$ wksin start | npm run start
```