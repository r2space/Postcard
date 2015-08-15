(function ($) {
  "use strict";

  var edit = $("#edit")
    , publish = $("#publish")
    , isPreview = $("#view").val()
    , id = $("#id").val()
    , image = undefined;

  /**
   * 初期显示
   */
  function init() {

    if (isPreview) {
      edit.show();
      publish.show();
    }

    light.doget("/api/card/get", {id: id}, function (err, result) {

      if (err) {
        return console.log(err);
      }

      $("#title").html(result.content.title);
      $("#sub").html(result.content.sub);
      $("#message").html(result.content.message.replace("\n", "<br>"));
      $("#copyright").html(result.content.copyright);

      image = result.content.image;
      if (isPreview && image && image.localId) {
        $("#image").attr("src", image.localId);
      }

      if (!isPreview && image && image.final) {
        $("#image").attr("src", "/api/file/image?id=" + image.final[0]);
      }
    });
  }

  // 编辑
  edit.click(function () {
    window.location = "/draft.html?id=" + $("#id").val();
  });

  // 发布
  publish.click(function () {

    if (image && image.serverId) {
      light.doput("/api/wechat/image", {id: id, imageId: image.serverId}, function (err, res) {
        window.location = "/card.html?id=" + $("#id").val();
      });
    } else {
      window.location = "/card.html?id=" + $("#id").val();
    }
  });

  init();

}(jQuery));
