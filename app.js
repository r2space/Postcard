/**
 * Module dependencies.
 */

"use strict";


var args   = process.argv
  , config = require('./config');

if (args && args.length > 2 && args[2] == '-local') {
  process.env.LIGHTDB_HOST = config.db_host;
  process.env.LIGHTDB_PORT = config.db_port;
  process.env.PORT         = config.app_port;
  process.env.LIGHTDB_USER = config.db_user;
  process.env.LIGHTDB_PASS = config.db_pass;
  process.env.APPNAME      = config.app_domain;
}


global.light        = require("light-core");
global.light.model  = require("light-core").model;
global.light.rider  = require("light-core").model.rider;


/**
 * 初始化light模块
 */
light.framework.loader.initialize(light.util.express(), process.env.APPNAME, function (app) {

  var middleware = light.framework.middleware;

  /**
   * 设定过滤器
   */
  app.use(middleware.multipart);    // 对应文件上传
  app.use(middleware.lang);         // 设定语言
  app.use(middleware.authenticate); // 认证
  app.use(middleware.csrfcheck);    // 校验CsrfToken
  app.use(middleware.csrftoken);    // 生成CsrfToken
  app.use(middleware.timeout);      // 设定超时
  app.use(middleware.urlstamp);     // 设定URL变更标识
  app.use(middleware.error);        // 错误处理
  app.use(middleware.validator);    // 校验规则

  /**
   * 设定URL路由
   */
  light.model.dispatcher.dispatch(app);

  /**
   * 启动web服务
   */
  light.framework.loader.start(app);
});
