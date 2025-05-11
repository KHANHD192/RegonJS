"use strict";

function labelRegisterAccordionErrors() {
  if ($("#basic-container input:invalid").length != 0) {
    $("#basic-error").removeClass("d-none");
  } else {
    $("#basic-error").addClass("d-none");
  }

  if ($("#appearance-container input:invalid").length != 0) {
    $("#appearance-error").removeClass("d-none");
  } else {
    $("#appearance-error").addClass("d-none");
  }

  if ($("#premium-container input:invalid").length != 0) {
    $("#premium-error").removeClass("d-none");
  } else {
    $("#premium-error").addClass("d-none");
  }

  if ($("#finish-container input:invalid").length != 0) {
    $("#finish-error").removeClass("d-none");
  } else {
    $("#finish-error").addClass("d-none");
  }
}

function getHashValue(key) {
  var matches = location.hash.match(new RegExp(key + "=([^&]*)"));
  return matches ? matches[1] : null;
}

function likePost(button) {
  if ($('meta[name="authenticated"]').attr("content") !== "1") {
    top.location.href = "/login";
    return;
  }

  $.ajax({
    url: button.data("target"),
    method: "POST",
    data: { _method: button.data("action") == "like" ? "post" : "delete" },
    success: function (result) {
      var i = button.find("i");
      button.next("strong").text(result.likes);

      if (button.data("action") == "like") {
        button.data("action", "unlike");
        i.removeClass("far");
        i.addClass("fas");
      } else {
        button.data("action", "like");
        i.removeClass("fas");
        i.addClass("far");
      }
    },
  });
}

function deletePost(post) {
  $.ajax({
    url: post.data("delete"),
    method: "POST",
    data: { _method: "delete" },
    success: function (result) {
      post.fadeOut(400, function () {
        post.remove();
      });
    },
  });
}

$(window).on("load", function () {
  // old code for handling errors, due to be deprecated
  var errorCode = decodeURIComponent(getHashValue("error"));

  var uri = window.location.toString();

  if (uri.indexOf("#") > 0) {
    var clean_uri = uri.substring(0, uri.indexOf("#"));
    window.history.replaceState({}, document.title, clean_uri);
  }

  if (errorCode != "null") {
    if (errorCode == "2") {
      // invalid password!
      document.getElementById("errorMsg").innerHTML =
        "<div class='alert alert-danger mt-3 d-inline-block' role='alert'> <span class='badge badge-secondary'>Error " +
        errorCode +
        "</span> - These credentials do not match our records.</div>";
    } else if (errorCode == "1") {
      // invalid email ?
      document.getElementById("errorMsg").innerHTML =
        "<div class='alert alert-danger mt-3 d-inline-block' role='alert'> <span class='badge badge-secondary'>Error " +
        errorCode +
        "</span> - The email must be a valid email address. </div>";
    } else {
      document.getElementById("errorMsg").innerHTML =
        "<div class='alert alert-danger mt-3 d-inline-block' role='alert'> Error " +
        errorCode +
        " - An unexpected error occured. </div>";
    }
  }

  var forms = document.getElementsByClassName("needs-validation");

  var validation = Array.prototype.filter.call(forms, function (form) {
    form.addEventListener(
      "submit",
      function (event) {
        if (form.checkValidity() === false) {
          if (form.id == "register") {
            labelRegisterAccordionErrors();
          }

          event.preventDefault();
          event.stopPropagation();
        }

        form.classList.add("was-validated");
      },
      false,
    );
  });

  $.ajaxSetup({
    headers: {
      "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr("content"),
    },
  });

  $("textarea.autoresize").autoResize();

  $("#root-container").on("click", ".like", function (e) {
    e.stopPropagation();
    likePost($(e.target).parents(".like"));
  });

  $("#root-container").on("click", "a[data-cmd='click']", function (e) {
    e.preventDefault();
    $("#" + $(e.target).parents("a[data-cmd='click']").data("target")).click();
  });

  $("#root-container").on("click", "div.clickable", function (e) {
    location.href = $(e.target).parents(".clickable").data("target");
  });

  $("#root-container").on("click", "button.delete-post", function (e) {
    e.stopPropagation();
    var post = $(e.target).parents(".card");

    $("#confirm-delete").dialog({
      autoOpen: true,
      resizeable: false,
      width: "auto",
      height: "auto",
      modal: true,
      buttons: {
        "Delete Post": function () {
          deletePost(post);
          $(this).dialog("close");
        },
        Cancel: function () {
          $(this).dialog("close");
        },
      },
    });
  });
});
