"use strict";

function resetSession() {
  $.ajax({
    url: "/debugger/reset-session",
    method: "GET",
    headers: { "X-API-KEY": "47e4995e-eec2-4796-a87b-5459a5750db2" },
    success: function (result) {
      document.cookie = "debugsess=" + result;
    },
  });
}
