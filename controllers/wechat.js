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

  var body = {
    method: "getJsConfig",
    args: [{
      url: handler.params.url,
      appid: config.mp.appid,
      secret: config.mp.secret
    }],
    callback: "postcard"
  };

  mq.listener("postcard", function(err, result) {
    if (err || result.error) {
      return callback(err || result.error);
    }

    callback(undefined, result.data);
  });

  mq.publish("send.wx", body);
};
