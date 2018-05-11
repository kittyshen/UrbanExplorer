
var foodArray = ["drink", "coffee", "fastfood", "vegan", "asia", "steak"];

var buttonHooker = $("#buttonGroup");  // create a variable to hook all buttons ad future user input append

function renderButtons(arr){             // create a function to render current game array as  buttons
    for (var i = 0; i <arr.length; i++){
        var newButton = $("<button>");
        newButton.text(arr[i]);
        newButton.attr("class","buttons text-center badge badge-pill badge-secondary");
        newButton.attr("value",arr[i]);
        buttonHooker.append(newButton);
    }
}
renderButtons(foodArray);   //render game array button to html page



function renderImg(obj){
    $("#gifContainer").html("");  // empty the container for new content;
    for(var i =0; i<obj.data.length; i++ ){
        // console.log(obj.data[i].images.original_still.url);
        var imgRatio = obj.data[i].images.original_still.width/obj.data[i].images.original_still.height;
        // console.log(imgRatio);
        // adding this to filter out the image that has ratio not fit the layout
        if(imgRatio<2.3&& imgRatio>1.4 && obj.data[i].images.original_still.width >200){    
            // console.log("right size");
            var newDiv =$("<div>").attr("class","imgWrap jumbotron col-md-3 col-sm-4 col-xs-6");
            var newImg = $("<img>").attr("src", obj.data[i].images.original_still.url);
            newImg.attr("class","images");
            newImg.attr("data-still",obj.data[i].images.original.url);
            newImg.attr("data-animate",obj.data[i].images.original_still.url);
            newImg.attr("data-state","still");
            var newP = $("<p>").text(obj.data[i].title);
            newP.attr("class","text-center");
            newP.append("<br> Rating: "+obj.data[i].rating);
            newDiv.append(newImg,newP);
            $("#gifContainer").append(newDiv);
        }
    } 
}

//define a variable to capture user click and store button's value into the var
var currentQueryVar;
$(document).on("click", "#searchButton", function(event){
    event.preventDefault();

    currentQueryVar = $("#searchField").val();
    console.log(currentQueryVar);
    var currentURL = "https://maps.googleapis.com/maps/api/geocode/json?address=" + currentQueryVar +"key=AIzaSyBGnYxlsr-8atPpbWbMsM2crsD-kah9JAI";

    $.ajax({
        url:currentURL,
        method: "GET"
    }).then(function(response){
        console.log(response);
        // $("#contentContainer").text(JSON.stringify(response));
        // renderImg(response);
    });
});


// testing google own method
var map;
// var infowindow;

function initMap() {
  var pyrmont = {lat: 37.4228775, lng: -122.085133};

  map = new google.maps.Map(document.getElementById('map'), {
    center: pyrmont,
    zoom: 15
  });

//   infowindow = new google.maps.InfoWindow();
  var service = new google.maps.places.PlacesService(map);
  service.nearbySearch({
    location: pyrmont,
    radius: 3500,
    type: ['restaurant'],
    keyword:'steak',
  }, callback);
}



function callback(results, status) {
  if (status == google.maps.places.PlacesServiceStatus.OK) {
    for (var i = 0; i < results.length; i++) {
        var place = results[i];
        console.log(place.name);
        // console.log(place.place_id);
        console.log(place.rating);
        console.log(place.vicinity);
        console.log("lat = " +place.geometry.location.lat());
        console.log("lon = " +place.geometry.location.lng());
        var types = String(place.types);
        types = types.split(",");
        console.log(types[0]);
    }
  }
}

////******/

//user click the imgButtons calling google place api

var foodQueryVar;
var lat =37.4228775;  // need to pass in those parameters by parsing data from google geo coding api
var lon = -122.085133;      // for now testing purpose just assign some value
$(document).on("click", ".imgButtons", function(){

    foodQueryVar = $(this).attr("data-type");
    console.log(foodQueryVar);
    initMap();

});


// change image src after click event happening on the images
$(document).on("click",".images",function(){
    if($(this).attr("data-state") == "still"){
        console.log("hello");
        $(this).attr("src",$(this).attr("data-animate"));
        $(this).attr("data-state","animate");
    }
    else{
        $(this).attr("src",$(this).attr("data-still"));
        $(this).attr("data-state","still");
    }

});

