(function ($) {
  "use strict";

  var id = $("#id").val()
    , type = $("#type")
    , error = $("#error")
    , errorMsg = $("#errorMsg");

  if (id) {
    light.doget("/api/card/get", {id: id}, function(err, result) {
      if (err) {
        errorMessage.html("卡片加载出错，请稍后再试");
        error.fadeIn(300);
        return console.log(err);
      }

      $("#title").val(result.content.title);
      $("#sub").val(result.content.sub);
      $("#message").val(result.content.message);
      $("#copyright").val(result.content.copyright);
      type.val(result.type)
    });
  }

  // 预览
  $('#preview').click(function () {

    var title = $("#title")
      , sub = $("#sub")
      , message = $("#message")
      , copyright = $("#copyright")
      ;

    error.hide();

    if (!title.val()) {
      errorMsg.html("请输入标题");
      title.focus();
      error.fadeIn(300);
      return;
    }

    if (!message.val()) {
      errorMsg.html("请输入内容");
      message.focus();
      error.fadeIn(300);
      return;
    }

    var data = {
      type: type.val(),
      content: {
        title: title.val(),
        sub: sub.val(),
        message: message.val(),
        copyright: copyright.val()
      }
    };

    save(data);
    return false;
  });

  /**
   * 保存数据
   * @param data
   * @returns {*}
   */
  function save(data) {

    // 更新
    if (id) {
      return light.doput("/api/card/update", {id: id, data: data}, function(err) {
        if (err) {
          errorMessage.html("保存卡片出错，请稍后再试");
          error.fadeIn(300);
          return console.log(err);
        }

        window.location = "/" + type.val() + ".html?view=draft&id=" + id;
      });
    }

    // 添加
    light.dopost("/api/card/add", {data: data}, function(err, result) {
      if (err) {
        errorMessage.html("保存卡片出错，请稍后再试");
        error.fadeIn(300);
        return console.log(err);
      }

      window.location = "/" + type.val() + ".html?view=draft&id=" + result.data._id;
    });

  }
}(jQuery));
