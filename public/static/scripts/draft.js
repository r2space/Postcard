(function ($) {
  "use strict";

  var id = $("#id").val()
    , type = $("#type")
    , error = $("#error")
    , errorMsg = $("#errorMsg")
    , image = {};

  /**
   * 初始化
   */
  function init() {

    error.hide();

    // 步骤2，异步获取微信调用设定，结果通过socket通知到步骤1里
    light.doget("/api/wechat/setting", {
      url: window.location.href, api: ["chooseImage", "uploadImage"]
    }, function (err, setting) {

      wx.config(setting);

      // 步骤3，如果是修改，获取详细内容
      if (id) {
        light.doget("/api/card/get", {id: id}, function (err, result) {
          if (err) {
            errorMsg.html("卡片加载出错，请稍后再试");
            error.fadeIn(300);
            return console.log(err);
          }

          $("#title").val(result.content.title);
          $("#sub").val(result.content.sub);
          $("#message").val(result.content.message);
          $("#copyright").val(result.content.copyright);
          type.val(result.type);

          image = result.content.image;
          if (image.final) {
            $("#image").attr("src", "/api/file/image?id=" + image.final[0]);
          } else if (image.localId) {
            $("#image").attr("src", image.localId);
          }
        });
      }
    });
  }

  /**
   * 保存数据
   * @param data
   * @returns {*}
   */
  function save(data) {

    // 更新
    if (id) {
      return light.doput("/api/card/update", {id: id, data: data}, function (err) {
        if (err) {
          errorMsg.html("保存卡片出错，请稍后再试");
          error.fadeIn(300);
          return console.log(err);
        }

        window.location = "/" + type.val() + ".html?view=draft&id=" + id;
      });
    }

    // 添加
    light.dopost("/api/card/add", {data: data}, function (err, result) {
      if (err) {
        errorMsg.html("保存卡片出错，请稍后再试");
        error.fadeIn(300);
        return console.log(err);
      }

      window.location = "/" + type.val() + ".html?view=draft&id=" + result.data._id;
    });
  }

  // 预览
  $("#preview").click(function () {

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
        copyright: copyright.val(),
        image: image
      }
    };

    save(data);
    return false;
  });

  $("#image").click(function () {
    wx.chooseImage({
      count: 1,                       // 默认9
      sizeType: ["compressed"],       // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ["album"],          // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {

        var localIds = res.localIds;  // 返回选定照片的本地ID列表，localId可以作为img标签的src属性显示图片

        $("#image").attr("src", localIds[0]);
        wx.uploadImage({
          localId: localIds[0],       // 需要上传的图片的本地ID，由chooseImage接口获得
          isShowProgressTips: 1,      // 默认为1，显示进度提示
          success: function (res) {
            image.localId = localIds[0];
            image.serverId = res.serverId;
          }
        });
      }
    });
  });

  init();

}(jQuery));
