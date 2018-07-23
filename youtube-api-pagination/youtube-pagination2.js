var maxResults = 15;
var pageToken;
var paginationArray = [];

search(0);

function search(pageNo) {
  var q = document.getElementById("query").value; //query
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      var response = JSON.parse(this.responseText);
      pageToken = response.nextPageToken;  //stores pageToken
      console.log(paginationArray);
      var contentVideo = document.getElementById("content");
      var innerContent = appendContent(response, maxResults);
      if (innerContent) {
        contentVideo.innerHTML = innerContent;
      }
    }
  }
  var nextPageToken = null;
  for (var i = 0; i < paginationArray.length; i++) {
      if (paginationArray[i].pageNo == pageNo) {
          nextPageToken = paginationArray[i].token;
          break;
      }
  }
  if(nextPageToken) {
    xhttp.open("GET", "https://www.googleapis.com/youtube/v3/search?key=AIzaSyBV3LC5W0l8joz6LTo25SKHR59Qtoaif7w&pageToken="+ nextPageToken +"&part=snippet&q="+q+"&maxResults="+maxResults+"", true);
    xhttp.send();
  }
  else {
    xhttp.open("GET", "https://www.googleapis.com/youtube/v3/search?key=AIzaSyBV3LC5W0l8joz6LTo25SKHR59Qtoaif7w&part=snippet&q=" + q + "&maxResults="+maxResults+"", true);
    xhttp.send();
  }
}

 function appendContent(response, maxResults) {
  var result = '';
   for (var i = 0; i < response.items.length; i++) {
     vidTitle = response.items[i].snippet.title;
     vidDescription = response.items[i].snippet.description;
     vidThumburl = response.items[i].snippet.thumbnails.medium.url;
     vidThumbImg = '<img class="img-responsive image1" src= "' + vidThumburl + '"alt = "No Image Available.">';
     if(i % 4 == 0 || i % 4 == 3) {
       if(i % 4 == 0) {
         result += '<div class="row single-row margin-0"><div class="col-xs-6 col-sm-3 col-md-3 "><div class="contain-img">' + vidThumbImg + '</div><div class="contain-title">' + vidTitle + '</div><div class="description">'+ vidDescription +'</div></div>';
       }
       else {
         result += '<div class="col-xs-6 col-sm-3 col-md-3"><div class="contain-img">' + vidThumbImg + '</div><div class="contain-title">' + vidTitle + '</div><div class="description">'+ vidDescription +'</div></div></div>';
       }
     } else {
         result += '<div class="col-xs-6 col-sm-3 col-md-3"><div class="contain-img">' + vidThumbImg + '</div><div class="contain-title">' + vidTitle + '</div><div class="description">'+ vidDescription +'</div></div>';
     }
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
     list += '<li><a id='+ i +' onclick=selectedPage('+ i +')>'+ i +'</a></li>'
   }
   list += '</ul>'
   return list;
 }
 var previousPageId;
 function selectedPage(pageNo) {
   var page = document.getElementById(''+ pageNo +'');
   page.innerHTML = '<a onclick=selectedPage('+ pageNo +')>' + pageNo + '</a>';
   console.log(page.parentNode);
   page.parentNode.setAttribute('class','active');
   var flag = 0;

   for(var i = 0; i < paginationArray.length; i++)
   {
     if(paginationArray[i].pageNo == pageNo) {
       flag = 1;
       break;
     }
   }
   if(flag == 0) {
      paginationArray.push({pageNo: pageNo, token: pageToken});
   }
   search(pageNo);
 }
