"use strict";

$(window).on("load", function () {
  $.ajaxSetup({
    headers: {
      "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr("content"),
    },
  });

  $("#loginButton").click(function (e) {
    e.preventDefault();
    e.stopPropagation();

    var username = $("#username").val();
    var password = $("#password").val();

    $.ajax({
      url: "/debugger",
      method: "POST",
      data: { username: username, password: password },
      success: function (result) {
        window.location = "/debugger/home";
      },
    });
  });
});
