var books = ["PHP", "Java", "MySql", "Python", "jQuery", "HTML"];
var currentPage = 1;
var currentBookName = books[0];
var dataForModal;
const MAX_LIMIT = 10;

$("document").ready(function() {
  createBooksList();
  $.ajaxSetup({
    beforeSend:function(){
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
    $(".page-anchor").parent().removeClass("active");
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
  $.get(url, function(data, status) {
    addDataOnCall(data);
  });
}

function addDataOnCall(data) {
  if (!data || !data.Books.length) { return; }
  var booksDetailsSub = $("<div></div>");
  dataForModal = data;
  for (var i = 0; i < data.Books.length; i++) {
    var id = data.Books[i].ID;
    var bookTile = '<div class="col-xs-6 col-sm-4 col-md-3 book-tile"><div class="book-tile-sub"><img class="book-image img-responsive" src="'+ data.Books[i].Image +'"></img><div class="book-tile-content"><div class="book-title">'+ data.Books[i].Title +'</div><div class="book-description">'+ data.Books[i].Description +'</div>'
    var favsRow = addFavRow();
    bookTile += favsRow + "<div class='details-div'><button data-info= '"+ i +"' data-toggle= 'modal' data-target='#myModal' class='show-details'>Details</button></div></div>";
    booksDetailsSub.append(bookTile);
  }
  $(".books-details").html(booksDetailsSub);
  bindTileEvents();
}

function addFavRow() {
  var favsRow = '<div class="row favs"><div class="col-xs-8 col-sm-8 stars">';
  for(var k = 0; k < 5; k++) {
    favsRow += '<span class="fa fa-star single-star"></span>';
  }
  favsRow += '</div><div class="col-xs-4 col-sm-4"><span class="fa fa-heart like-button"><span></div></div>';
  return favsRow;
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
  for (var i = 0; i <= MAX_LIMIT + 1; i++) {
    if (i == 0) {
      list += '<li><a id="previous" class="page-detail" onclick="onPrevNext(false, true)">&laquo;</a></li>'
    } else if ( i == MAX_LIMIT + 1) {
      list += '<li><a id="next" class="page-detail" onclick="onPrevNext(true, false)">&raquo;</a></li>'
    } else {
      list += '<li><a data-page="'+ i +'" class="page-anchor page-detail" onclick="changePage('+ i +')">'+ i +'</a></li>'
    }
  }
  list += '</ul>'
  return list;
}

function changePage(pageNo) {
  if (pageNo == currentPage) { return; }
  $(".page-anchor").parent().removeClass("active");
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
  $(".page-anchor").parent().removeClass("active");
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
  data = dataForModal;
  var content = $("<div></div>").addClass("row");
  var contentImage = $("<div></div").addClass("col-sm-4").appendTo(content);
  var image = $("<img></img>").attr({"src": data.Books[id].Image}).appendTo(contentImage);
  var contentDetails = $("<div></div>").addClass("col-sm-8 details").appendTo(content);
  var title = $("<div></div>").html("<h3>"+ data.Books[id].Title +"</h3>").appendTo(contentDetails);
  var description = $("<p></p>").text(data.Books[id].Description).appendTo(contentDetails);
  $(".modal-body").html(content);
}
