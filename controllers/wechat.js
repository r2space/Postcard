/**
 * @file 微信操作
 * @module wechat
 * @author r2space@gmail.com
 * @version 1.0.0
 */

'use strict';

var mq = light.framework.mq
  , config = light.framework.config.wechat;

/**
 * 注册
 * @param {Object} handler
 * @param {Function} callback
 */
exports.setting = function (handler, callback) {

  //wechat.mp.getJsConfig(handler.params.url, callback);

  var body = {
    url: handler.params.url,
    tag: "postcard.poke",
    uid: handler.params.uid,
    appid: config.mp.appid,
    secret: config.mp.secret
  };

  mq.publish("send.wx", body, callback);
};
