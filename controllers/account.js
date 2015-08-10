/**
 * @file 账户
 * @module account
 * @author sloanlee
 * @version 1.0.0
 */

'use strict';

var rider = light.model.rider
  , async = light.util.async
  , _ = light.util.underscore
  , security = light.model.security
  , helper = light.framework.helper
  , log = light.framework.log
  , errors = light.framework.error;

var BlackList = [
  'admin'
  , ''
];


/**
 * 注册
 * @param {object} data user数据
 * @param {string} data.id userid
 * @param {string} data.email useremail
 * @param {string} data.password userpassword
 */
exports.register = function (handler, callback) {
  var data = handler.params.data
    , email = data.email
    , id = data.id
    , password = handler.params.data.password;

  var checkValid = function (done) {
    if (_.contains(BlackList, id)) {
      return done(new errors.parameter.ParamError('user id can not be used'));
    }
    done();
  };

  var checkUnique = function (done) {
    rider.user.get(handler.copy({
      free: {
        $or: [{
          email: email
        }, {
          id: id
        }]
        , valid: 1
      }
    }), done);
  };

  var addUser = function (d, done) {
    if (d && d._id) {
      return done(new errors.db.Add('repeated user'));
    }

    handler.params.data.password = security.sha256(data.password);
    rider.user.add(handler, done);
  };

  async.waterfall([checkValid, checkUnique, addUser], callback);
};


/**
 * 登录
 * @param {string} id userid
 * @param {string} password userpassword
 */
exports.login = function (handler, callback) {

  var password = handler.params.password
    , id = handler.params.id;
  userVerify(handler, function (err, result) {
    if (result && result._id)
      handler.req.session.user = result; // 当前用户
    callback(err, result);
  });
};

function userVerify(handler, callback) {

  rider.user.get(handler, {
    condition: {
      id: handler.params.id
    }
  }, function (err, result) {

    if (err) {
      log.debug('Unable to retrieve the user.');
      return callback(new errors.db.Find());
    }

    if (!result || !result._id) {
      log.debug('User does not exist.');
      return callback(new errors.db.NotExist());
    }

    if (!result.password || result.password !== security.sha256(handler.params.password)) {
      log.debug('The user password is not correct.');
      return callback(new errors.db.NotCorrect());
    }

    // if (result.status !== 1) {
    //   log.debug('The user hasn't been actived.');
    //   return callback(new errors.db.NotCorrect());
    // };

    delete result.password;
    return callback(err, result);
  });
}
