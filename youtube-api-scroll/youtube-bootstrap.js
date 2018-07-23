var maxResults = 15;
var pageToken;
search();

function search(change) {
  var q = document.getElementById("query").value;
  console.log(q);
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      //console.log(responseText);
      var response = JSON.parse(this.responseText);
      console.log(response);
      pageToken = response.nextPageToken;
      //console.log(p);
      var content = document.getElementById("content");
      var innerContent = appendContent(response, maxResults);
      //console.log(appen);
      if (innerContent) {
        // console.log(appen);
        if(change==1) {
          content.innerHTML = innerContent;
        }
        else {
          content.innerHTML += innerContent;
        }
      }
    }
  };
  if(pageToken) {
    xhttp.open("GET", "https://www.googleapis.com/youtube/v3/search?key=AIzaSyBV3LC5W0l8joz6LTo25SKHR59Qtoaif7w&pageToken="+ pageToken +"&part=snippet&q="+q+"&maxResults="+maxResults+"", true);
    xhttp.send();
  }
  else {
    xhttp.open("GET", "https://www.googleapis.com/youtube/v3/search?key=AIzaSyBV3LC5W0l8joz6LTo25SKHR59Qtoaif7w&part=snippet&q=" + q + "&maxResults="+maxResults+"", true);
    xhttp.send();
  }
}

 function appendContent(response, maxResults) {
   // console.log(response);
   // console.log(maxResults);
  var result = '';
   for (var i = 0; i < response.items.length; i++) {
    // console.log(response.items[i].snippet.title);
     vidTitle = response.items[i].snippet.title;
     vidDescription = response.items[i].snippet.description;
     vidThumburl = response.items[i].snippet.thumbnails.medium.url;
     vidThumbImg = '<img class="img-responsive image1" src= "' + vidThumburl + '"alt = "No Image Available.">';
     result += '<div class="col-sm-4"><div class="block"><div class="container-fluid contain-img">' + vidThumbImg + '</div><div class="container-fluid contain-title">' + vidTitle + '</div><div class="container-fluid description">'+ vidDescription +'</div></div></div>';
   }
   return result;
 };

 pagination();

 function pagination() {
   var divPaginated = document.getElementById("div-paginated");
   var paginatedContent = paginatedContentCreation();
   divPaginated.innerHTML = paginatedContent;
 };

 function paginatedContentCreation() {
   var divPaginated = document.getElementById("div-paginated");
   list = '<ul class="pagination pagination-lg">';
   for(var i = 1;i <= 10; i++)
   {
     list += '<li id='+ i +'><a onclick=selectedPage('+ i +')>'+ i +'</a></li>'
   }
   list += '</ul>'
   return list;
 }
 function selectedPage(id) {
   var page = document.getElementById(''+ id +'');
   page.innerHTML = '<a class="action" onclick=selectedPage('+ id +')>' + id + '</a>'
   search(1);
 }
