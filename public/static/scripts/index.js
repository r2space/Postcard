
jQuery(document).ready(function($) {

  $("#content").on("click", "img", function() {

    var type = $(this).attr("alt");

    if (type == "Blog") {
      window.location = "/blog.html";
    }

    if (type == "Calendar") {
      window.location = "/calendar.html";
    }

    if (type == "Card") {
      window.location = "/draft.html?type=card";
    }

    if (type == "Contact") {
      window.location = "/contact.html";
    }

    if (type == "Gallery") {
      window.location = "/gallery.html";
    }

    if (type == "Portfolio") {
      window.location = "/portfolio.html";
    }

    if (type == "Soon") {
      window.location = "/soon.html";
    }
  });

});