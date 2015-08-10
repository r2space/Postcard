$(function () {
  "use strict";

  /**
   * 校验规则
   */
  $.validator.addMethod(
      "regex"
      , function (value, element, regexp) {
        var re = new RegExp(regexp);
        return this.optional(element) || re.test(value);
      }
      , "邮箱信息格式错误，请确认。"
  );
  $("#register-form").validate({
    rules: {
      "register-username": {
        required: true
        , minlength: 4
      }
      , email: {
        required: true
        , regex: /^\s*([-a-z0-9+._']{1,64})@((?:[-a-z0-9]+\.)+[a-z]{2,})\s*$/i
      }
      , "register-password": {
        required: true
        , rangelength: [8, 18]
      }
      , "confirm-password": {
        required: true
        , rangelength: [8, 18]
        , equalTo: "#register-password"
      }
    },

    // Messages for form validation
    messages: {
      "register-username": {
        required: '请输入用户ID'
        , minlength: '用户ID不能少于4个字符，请确认'
      }
      , email: {
        required: '请输入邮箱信息'
        , email: '邮箱信息格式错误，请确认'
      }
      , "register-password": {
        required: '请输入密码'
        , rangelength: '密码请输入8～18个字符'
      }
      , "confirm-password": {
        required: '请输入确认密码'
        , rangelength: '确认密码请输入8～18个字符'
        , equalTo: '密码不一致'
      }
    },

    // Do not change code below
    errorPlacement: function (error, element) {
      error.insertAfter(element.parent());
    }
  });

  var events = function () {

    $('#login-form-link').click(function (e) {
      $("#login-form").delay(100).fadeIn(100);
      $("#register-form").fadeOut(100);
      $('#register-form-link').removeClass('active');
      $(this).addClass('active');
      e.preventDefault();
    });
    $('#register-form-link').click(function (e) {
      $("#register-form").delay(100).fadeIn(100);
      $("#login-form").fadeOut(100);
      $('#login-form-link').removeClass('active');
      $(this).addClass('active');
      e.preventDefault();
    });

    $("#login-submit").bind("click", function () {

      var username = $("#username").val()
        , password = $("#password").val();

      if (username.length <= 0 || password.length <= 0) {
        alertify.error("请输入用户名和密码");
      } else {
        light.doget("/api/account/login", {
          id: username
          , password: password
        }, function (err) {
          if (err) {
            return alertify.error("用户名或密码不正确");
          }

          alertify.success("登录成功");
          window.setTimeout(function () {
            window.location = "/account/list";
          }, 4000);

        });
      }

      return false;
    });

    /**
     * 注册
     */
    $("#register-submit").bind("click", function () {

      if ($("#register-form").valid()) {

        var data = {
          data: {
            id: $("#register-username").val()
            , password: $("#register-password").val()
            , email: $("#email").val()
          }
        };

        light.dopost("/api/account/register", data, function (err, data) {
          if (err) {
            if (data.message) {
              return light.error(data, data.message, false);
            } else {
              return alertify.error("注册失败");
            }
          }

          alertify.success("注册成功");
          window.setTimeout(function () {
            window.location = "/login";
          }, 4000);
        });
      }
    });
  };

  var render = function () {

  };

  // 注册事件
  events();
  render();
});
