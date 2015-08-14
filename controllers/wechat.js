/**
 * @file 微信操作
 * @module wechat
 * @author r2space@gmail.com
 * @version 1.0.0
 */

'use strict';

var wechat = require("light-wechat");

/**
 * 注册
 * @param {Object} handler
 * @param {Function} callback
 */
exports.setting = function (handler, callback) {
  wechat.mp.getJsConfig(handler.params.url, callback);
};
