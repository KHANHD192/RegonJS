// 2019-08-15: Patrice wrote this but I don't think it's needed anymore? -S

"use strict";

/*
    Loads the view for a post using the details we have in JSON
*/

function RenderPost(
  profileName,
  username,
  profileImage,
  createdAt,
  body,
  replies,
  likes,
) {
  $.ajax({
    url: "/renderpost",
    method: "GET",
    data: {
      profileName: profileName,
      username: username,
      profileImage: profileImage,
      createdAt: createdAt,
      body: body,
      replies: replies,
      likes: likes,
    },
  });
}
