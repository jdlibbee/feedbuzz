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
  $('.parallax').parallax();
 });