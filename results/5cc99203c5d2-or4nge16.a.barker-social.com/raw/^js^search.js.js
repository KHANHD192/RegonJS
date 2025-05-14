function searchForPosts(username) {
  // Got the basics working, but needs to support more search criteria
  // before its worth hooking up and rolling out

  $.ajax({
    contentType: "application/json",
    url: "http://barker.test/search",
    method: "POST",
    data: '{"username":"' + username + '"}',
    success: function (result) {
      console.log(result);
    },
  });
}
