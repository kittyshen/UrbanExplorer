
var foodArray = ["drink", "coffee", "fastfood", "vegan", "asia", "steak"];
var foodIconArray =["assets/images/00.png","assets/images/01.png","assets/images/02.png","assets/images/03.png","assets/images/04.png","assets/images/05.png"];

var buttonHooker = $("#foodButtonWrapper");  // create a variable to hook all buttons ad future user input append

function renderButtons(arr){             // create a function to render current game array as  buttons
    for (var i = 0; i <arr.length; i++){

        var newDiv =$("<div>").attr("class","imgWrap jumbotron col-md-3 col-sm-4 col-xs-6");
        var newImg = $("<img>").attr("src", foodIconArray[i]);
        newImg.attr("class","imgButtons");
        // newImg.attr("data-hover",foodIconArrayHover[i]);
        newImg.attr("data-foodtype",foodArray[i]);
        var newP = $("<p>").text(foodArray[i]);
        newP.attr("class","text-center");
        newDiv.append(newImg,newP);
        buttonHooker.append(newDiv);
    }
}
// renderButtons(foodArray);   //render game array button to html page



// function renderImg(obj){
//     $("#gifContainer").html("");  // empty the container for new content;
//     for(var i =0; i<obj.data.length; i++ ){
//         // console.log(obj.data[i].images.original_still.url);
//         var imgRatio = obj.data[i].images.original_still.width/obj.data[i].images.original_still.height;
//         // console.log(imgRatio);
//         // adding this to filter out the image that has ratio not fit the layout
//         if(imgRatio<2.3&& imgRatio>1.4 && obj.data[i].images.original_still.width >200){    
//             // console.log("right size");
//             var newDiv =$("<div>").attr("class","imgWrap jumbotron col-md-3 col-sm-4 col-xs-6");
//             var newImg = $("<img>").attr("src", obj.data[i].images.original_still.url);
//             newImg.attr("class","images");
//             newImg.attr("data-still",obj.data[i].images.original.url);
//             newImg.attr("data-animate",obj.data[i].images.original_still.url);
//             newImg.attr("data-state","still");
//             var newP = $("<p>").text(obj.data[i].title);
//             newP.attr("class","text-center");
//             newP.append("<br> Rating: "+obj.data[i].rating);
//             newDiv.append(newImg,newP);
//             $("#gifContainer").append(newDiv);
//         }
//     } 
// }

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
        // console.log("the formatted address is: " + response.results[0].formatted_address)
        //address geometry
        var addressGeometryLat = response.results[0].geometry.location.lat
        console.log("the geometry of location latitude is: " + response.results[0].geometry.location.lat)
        var addressGeometryLong = response.results[0].geometry.location.lng
        console.log("the geometry of location longitude is: " + response.results[0].geometry.location.lng)
        //we are going to use the cityName variable to use in weather API AJAX
        var cityName = response.results[0].address_components[3].long_name
        console.log("the name of the city is: " + response.results[0].address_components[3].long_name)
    
        //call weather api to extract weather information using cityname as parameter
        var APIKey = "abbf303e9278b19a5d3d88db00f23d48";
        // Here we are building the URL we need to query the database
        var queryURL = "https://api.openweathermap.org/data/2.5/weather?q="+cityName+"&units=imperial&appid=" + APIKey;
        
        //*************  OpenWeatherMap API ***************
        //inner ajax call
        $.ajax({
            url:queryURL,
            method:"GET"
        }).then(function(response){
            console.log(queryURL);
            // Log the resulting object
            console.log(response);
            // Transfer content to HTML
            var weatherHooker = $("#cityWeather"); // get hold of the cityweaher class container prepare to append to this div
            weatherHooker.empty();  // empty the contents inside this container to avoid overlapping append
            var newCity = $("<div>").attr("class", "city text-center");  // create city div
            var newTemp = $("<div>").attr("class", "temp text-center");    // create temp div
            var newThermo = $("<img>").attr("src", "assets/images/thermo.png");
            newThermo.attr("width","25px");
            newTemp.append(newThermo);
            weatherHooker.append(newCity,newTemp);


            $(".city").html("<h5>" + response.name + " Weather </h5>");
            // $(".wind").text("Wind Speed: " + response.wind.speed);
            // $(".humidity").text("Humidity: " + response.main.humidity);
            $(".temp").prepend($("<span>").text("Temperature (F) " + response.main.temp));
          
        });
        //*************  OpenWeatherMap API ends here ***************

        // Render food type buttons to allow user to choose food
        $("#foodButtonWrapper").empty();
        renderButtons(foodArray);   //render food array button to html page
    
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

$(document).on("click", ".imgButtons", function(){
    foodQueryVar = $(this).attr("data-foodtype");
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

