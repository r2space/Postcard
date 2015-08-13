(function ($) {
  "use strict";

  var edit = $("#edit")
    , publish = $("#publish");

  if ($("#view").val()) {
    edit.show();
    publish.show();
  }

  light.doget("/api/card/get", {id: $("#id").val()}, function(err, result) {

    if (err) {
      return console.log(err);
    }

    $("#title").html(result.content.title);
    $("#sub").html(result.content.sub);
    $("#message").html(result.content.message.replace("\n", "<br>"));
    $("#copyright").html(result.content.copyright);
    if (result.content.image) {
      $("#image").attr("src", result.content.image.localId);
    }
  });

  edit.click(function() {
    window.location = "/draft.html?id=" + $("#id").val();
  });

  publish.click(function() {
    window.location = "/card.html?id=" + $("#id").val();
  });

}(jQuery));
