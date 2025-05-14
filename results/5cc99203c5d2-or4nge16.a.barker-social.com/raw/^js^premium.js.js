"use strict";

function showLikes(button) {
  console.log(button);
  $.ajax({
    url: button.data("viewlikes"),
    method: "GET",
    success: function (result) {
      $("#show-likes > p").html(result.join("<br />"));
      $("#show-likes").dialog({
        autoOpen: false,
        position: { my: "left top", at: "right bottom", of: button },
        show: true,
        hide: true,
        open: function (event, ui) {
          $(".ui-dialog-titlebar-close", ui.dialog).hide();
        },
      });
      $("#show-likes").dialog("open");
    },
  });
}

// Server fills this
var bannerImage = $("#banner_image_url").text();

// Server fills this
var userStatus = $("meta[name=user-type]").attr("content");

if (userStatus == "premium") {
  $("#root-container").on("mouseenter", "button.like", function (e) {
    e.stopPropagation();
    showLikes($(e.currentTarget));
  });

  $("#root-container").on("mouseleave", "button.like", function (e) {
    e.stopPropagation();
    $("#show-likes").dialog("close");
  });
}

$(document).ready(function () {
  $("#banner_image > img").attr("src", bannerImage);
});
