$(document).ready(function () {
  console.log("yo");
  $(".container").on("click", "#saveArticle", function (event) {
    event.preventDefault();

    var articleId = $(this).attr("data-id");
    console.log(articleId);

    $.ajax({
      url: "/submit",
      method: "PUT",
      data: {
        _id: articleId
      }
    })
  })

  $(".container").on("click", "#remove", function (event) {
    event.preventDefault();
    var articleId = $(this).attr("data-id");
    console.log(articleId);
    $("#" + articleId).empty()
    $.ajax({
      url: "/remove",
      method: "PUT",
      data: {
        _id: articleId
      }

    })
  })
  $("#new").on("click", function (event) {
    event.preventDefault();
    $.ajax({
      url: "/",
      method: "GET",
    })
  })

  $("#saveNote").on("click", function (event) {
    event.preventDefault();
    var articleId = $(this).attr("data-id");
    $.ajax({
      url: `/saved/${articleId}`,
      method: "POST"
    })
  })




  $('.parallax').parallax();
});
$(document).ready(function () {
  $('.modal').modal();
});
// $('#textarea1').val('New Text');
// M.textareaAutoResize($('#textarea1'));