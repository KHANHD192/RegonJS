// TEST TEST TEST

"use strict";

function getUser(username) {
  $.ajax({
    url: "/api/admin/getuser/" + username,
    method: "GET",
  });
}

function editUser(username, password, email, name, description, profilePic) {
  $.ajax({
    url: "/api/admin/edituser/" + username,
    method: "POST",
    data: {
      password: password,
      email: email,
      name: name,
      description: description,
      profilePic: profilePic,
    },
  });
}

function deleteUser(username) {
  $.ajax({
    url: "/api/admin/deleteuser/" + username,
    method: "POST",
  });
}

function uploadDogImage(dog, image) {
  // Image passed in from formData???

  $.ajax({
    url: "/api/dog/" + dog + "/upload-image",
    method: "POST",
    processData: false,
    contentType: false,
    data: { image },
  });
}

function GetWinners() {
  // Patrice modified the server code so we can pull
  // the winner using this API

  $.ajax({
    url: "/api/admin/showcasewinner",
    method: "GET",
    success: function (data) {
      // Just testing for now...
      console.log(data);
    },
  });
}
