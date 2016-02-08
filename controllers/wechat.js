/**
 * @file 微信操作
 * @module wechat
 * @author r2space@gmail.com
 * @version 1.0.0
 */

"use strict";

var helper  = light.framework.helper
  , config  = light.framework.config
  , file    = light.model.file
  , rider   = light.model.rider
  , wechat  = require("light-wechat");


/**
 * @desc 验证服务器配置时使用
 * @param {Object} handler 请求对象
 */
exports.mp = function (handler) {
  if (handler.req.method == "GET") {
    return wechat.mp.verify(handler);
  }

  wechat.mp.listen(handler, function (message, callback) {
    callback({
      content: "你好, 欢迎光临字符科技服务号",
      toUsername: message.FromUserName,
      fromUsername: message.ToUserName
    });
  });
};

/**
 * @desc 验证企业号应用对应的服务器配置时使用
 * @param {Object} handler 请求对象
 */
exports.enterprise = function (handler) {
  if (handler.req.method == "GET") {
    return wechat.enterprise.verify(handler);
  }

  wechat.enterprise.listen(handler, function (message, callback) {
    callback({
      content: "你好, 欢迎光临字符科技企业号",
      toUsername: message.FromUserName
    });
  });
};

/**
 * 获取JS用设定内容
 * @param {Object} handler
 *  url: 当前网页的URL
 *  api: 申请使用的JSAPI
 * @param {Function} callback
 */
exports.setting = function (handler, callback) {

  var api = new wechat.mpAPI()
    , param = {debug: false, jsApiList: handler.params.api, url: handler.params.url};

  api.getJsConfig(param, callback);
};

/**
 * 获取微信图片
 * @param handler
 * @param callback
 */
exports.image = function (handler, callback) {

  var api = new wechat.mpAPI();

  api.getMedia(handler.params.imageId, function (err, result) {

    // 保存文件
    handler.addParams("files", [result]);
    file.add(handler, function (err, data) {
      if (err) {
        return callback(err);
      }

      // 获取卡片数据
      rider.card.get(handler, function (err, result) {
        if (err) {
          return callback(err);
        }

        // 设定图片，并保存
        delete result._id;
        result.content.image.final = [data[0]._id];

        rider.card.update(handler, {data: result}, callback);
      });
    });
  });

};
