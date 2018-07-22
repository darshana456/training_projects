var books = ["PHP", "Java", "MySql", "Python", "jQuery", "HTML"];
var currentPage = 1;
var currentBookName = books[0];
var dataForModal;
const MAX_LIMIT = 10;
var historyObj = window.history;
var stateObject;

$("document").ready(function() {
  createBooksList();
  console.log(historyObj);
  $.ajaxSetup({
    beforeSend: function() {
        $(".loading").show();
        $("#div-paginated").hide();
        $(".books-details").hide();
    },
    complete:function(){
        $(".loading").hide();
        $("#div-paginated").show();
        $(".books-details").show();
    }
  });
  pagination();
  sendRequest(currentBookName);
  bindEvents();

  window.onpopstate = function(event) {
  console.log(history.state);
  console.log(historyObj);
  stateObject = history.state;
  sendRequest(stateObject.bookName, stateObject.pageNo);
  };
});

function createBooksList() {
  for(var i = 0; i < books.length; i++) {
    var book =  $("<div></div>").text(books[i]).addClass("book-name").attr({"data-book": books[i]});
    $(".books-list").append(book);
  }
}

function sendRequest(bookName, pageNo) {
  currentBookName = bookName ? bookName : currentBookName;
  currentPage = pageNo ? pageNo : 1;
  if (currentPage == 1) {
    $('[data-book = "'+ bookName +'"]').addClass("active");
    $(".page-no").parent().removeClass("active");
    $('[data-page = '+ currentPage +']').parent().addClass("active");
  }
  callApi(currentBookName, currentPage);
  alterPrevNext(currentPage);
}

function alterPrevNext(pageNo) {
  var $next = $("#next");
  var $previous = $("#previous");
  if (pageNo == MAX_LIMIT) {
    $next.parent().addClass("disabled");
    $previous.parent().removeClass("disabled");
  } else if (pageNo == 1) {
    $previous.parent().addClass("disabled");
    $next.parent().removeClass("disabled");
  } else {
    $next.parent().removeClass("disabled");
    $previous.parent().removeClass("disabled");
  }
}

function callApi(bookName, pageNo) {
  var url = "http://it-ebooks-api.info/v1/search/";
  url += bookName + "/page/" + pageNo;
  var stateObj = { bookName: bookName, pageNo: pageNo };
  history.pushState(stateObj, null, bookName);
  console.log(history.state);
  console.log(historyObj);
  $.get(url, function(data, status) {
    var c = new component();
    c.addDataOnCall(data);
  });
  bindTileEvents();
}

function pagination() {
  var divPaginated = '<div class="container" id="div-paginated">';
  var paginatedContent = paginatedContentCreation();
  divPaginated += paginatedContent;
  divPaginated += '</div>';
  $(".pagination-container").html(divPaginated);
}

function paginatedContentCreation() {
  var list = '<ul class="pagination pagination-lg">';
  list += '<li><a id="previous" class="page-detail" onclick="onPrevNext(false, true)">&laquo;</a></li>';
  for (var i = 1; i <= MAX_LIMIT; i++) {
    list += '<li><a data-page="'+ i +'" class="page-no page-detail" onclick="changePage('+ i +')">'+ i +'</a></li>'
  }
  list += '<li><a id="next" class="page-detail" onclick="onPrevNext(true, false)">&raquo;</a></li>';
  list += '</ul>'
  return list;
}

function changePage(pageNo) {
  if (pageNo == currentPage) { return; }
  $(".page-no").parent().removeClass("active");
  $('[data-page = ' + pageNo + ']').parent().addClass("active");
  sendRequest(false, pageNo);
  currentPage = pageNo;
}

function onPrevNext(next, previous) {
  if (next && currentPage < MAX_LIMIT) {
    currentPage = currentPage + 1;
  } else if (previous && currentPage > 1) {
    currentPage = currentPage - 1;
  } else {
    return;
  }
  onChangeRequest(currentPage);
}

function onChangeRequest(currentPage) {
  $(".page-no").parent().removeClass("active");
  $('[data-page = ' + currentPage + ']').parent().addClass("active");
  sendRequest(currentBookName, currentPage);
}

function bindTileEvents() {
  $(".like-button").on("click", function() {
    if (!$(this).hasClass('like-enabled')) {
      $(this).addClass("like-enabled");
    } else {
      $(this).removeClass('like-enabled');
    }
   });

   $(".single-star").on("click", function() {
     if (!$(this).hasClass('checked')) {
       $(this).addClass("checked");
       $(this).prevAll().addClass("checked");
     } else {
       if ($(this).parent().first() && !$(this).nextAll().hasClass('checked')) {
         $(this).removeClass("checked");
       }
       $(this).nextAll().removeClass("checked");
     }
   });
   $(".show-details").on("click", function() {
     creationOfModal($(this).data("info"));
   });
}

function bindEvents() {
  $(".book-name").click(function() {
    $('.books-list div.active').removeClass('active');
    if (!$(this).hasClass('active')) {
        $(this).addClass('active');
    }
    sendRequest($(this).data("book"));
  });
}

function creationOfModal(id) {
   var selectedBook = dataForModal.Books.filter(function(obj){
     return (obj.ID == id);
   })[0];
  data = dataForModal;
  var content = $("<div></div>").addClass("row");
  var contentImage = $("<div></div").addClass("col-sm-4").appendTo(content);
  var image = $("<img></img>").attr({"src": selectedBook.Image}).appendTo(contentImage);
  var contentDetails = $("<div></div>").addClass("col-sm-8 details").appendTo(content);
  var title = $("<div></div>").html("<h3>"+ selectedBook.Title +"</h3>").appendTo(contentDetails);
  var description = $("<p></p>").text(selectedBook.Description).appendTo(contentDetails);
  $(".modal-body").html(content);
}
