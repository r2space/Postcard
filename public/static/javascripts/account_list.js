$(function () {
  "use strict";

  var self = this;
  var pageSize = Number.MAX_VALUE;
  self.uid = $("#uid").val();
  self.option = {
    skip: 0
    , limit: pageSize
    , condition: {
      type: undefined
      , keyword: undefined
    }
  };

  function render() {
    light.doget("/api/user/list", self.option, function (err, result) {
      if (err) {
        return alertify.error("列表加载失败");
      }

      light.paginationMore.displayTotalCount(result.totalItems);
      var template = _.template($("#tmplUser").html())
        , container = $("#user-container");

      _.each(result.items, function (user) {
        var current = user._id === self.uid ? true : false;
        $("#current").val(current);
        container.append(template({
          id: user.id
          , email: user.email
          , createAt: moment(user.createAt).format("YYYY/MM/DD HH:mm:ss")
          , current: current ? "<i class='fa fa-user'></i>" + " 当前用户" : ""
          , selected: current ? "info" : ""
        }));
      });
    });
  }

  function events() {

  }

  // 画面表示
  render();

  // 注册事件
  events();
});
