var component = function(data) {
  var op = {};

  op.addDataOnCall = function(data) {
    if (!data || !data.Books.length) { return; }
    data["rating"] = ["first","second", "third", "fourth", "fifth"];
    $.get('../mustache/tile-mustache.mustache', function(template) {
      var info = Mustache.to_html(template, data);
      $('.books-details').html(info);
      eventOnDetail(data);
    });
    addRating(data);
  }

  var addRating = function(data) {
    $.get('../mustache/rating.mustache', function(template) {
      var info = Mustache.to_html(template, data);
      $('.favs').html(info);
    });
  }

  var eventOnDetail = function(data) {
    $(".show-details").on("click", function() {
      var id = $(this).data("info");
      var selectedBook = data.Books.filter(function(obj) {
        return (obj.ID == id);
      })[0];
      $.get('../mustache/modal.mustache', function(template) {
        var info = Mustache.to_html(template, selectedBook);
        $('.modal').html(info);
      });
    })
  }

  return op;
}
