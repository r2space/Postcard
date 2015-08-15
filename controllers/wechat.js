/**
 * @file 微信操作
 * @module wechat
 * @author r2space@gmail.com
 * @version 1.0.0
 */

'use strict';

var mq = light.framework.mq
  , helper = light.framework.helper
  , config = light.framework.config
  , file = light.model.file
  , rider = light.model.rider;

/**
 * 获取JS用设定内容
 * @param {Object} handler
 * @param {Function} callback
 */
exports.setting = function (handler, callback) {

  var queue = helper.randomGUID4() + helper.randomGUID4();

  mq.listener(queue, function (err, result) {
    if (err || result.error) {
      return callback(err || result.error);
    }

    callback(undefined, result.data);
  });

  mq.publish("send.wx", {
    method: "getJsConfig",
    args: [{
      url: handler.params.url,
      appid: config.wechat.mp.appid,
      secret: config.wechat.mp.secret
    }],
    callback: queue
  });
};

/**
 * 获取微信图片
 * @param handler
 * @param callback
 */
exports.image = function (handler, callback) {

  var queue = helper.randomGUID4() + helper.randomGUID4();

  mq.listener(queue, function (err, result) {
    if (err || result.error) {
      return callback(err || result.error);
    }

    // 保存文件
    handler.addParams("files", [new Buffer(result.data.data)]);
    file.add(handler, function(err, data) {
      if (err) {
        return callback(err);
      }

      // 获取卡片数据
      rider.card.get(handler, function(err, result) {
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

  mq.publish("send.wx", {
    method: "getMedia",
    args: [{
      id: handler.params.imageId,
      appid: config.wechat.mp.appid,
      secret: config.wechat.mp.secret
    }],
    callback: queue
  });

};
