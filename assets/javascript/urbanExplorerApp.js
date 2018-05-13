
var foodArray = ["drink", "coffee", "fastfood", "vegan", "asia", "steak"];
var foodIconArray =["assets/images/00.png","assets/images/01.png","assets/images/02.png","assets/images/03.png","assets/images/04.png","assets/images/05.png"];
// var foodIconArrayHover =["assets/images/00i.png","assets/images/01i.png","assets/images/02i.png","assets/images/03i.png","assets/images/04i.png","assets/images/05i.png"];  //added

var buttonHooker = $("#foodButtonWrapper");  // create a variable to hook all buttons ad future user input append

function renderButtons(arr){             // create a function to render current game array as  buttons
    for (var i = 0; i <arr.length; i++){

        var newDiv =$("<div>").attr("class","imgWrap jumbotron col-md-3 col-sm-4 col-xs-6");
        var newImg = $("<img>").attr("src", foodIconArray[i]);
        newImg.attr("class","imgButtons");
        // newImg.attr("data-hover",foodIconArrayHover[i]);
        newImg.attr("data-foodtype",foodArray[i]);  
        newImg.attr("data-foodindex",i);        // added
        var newP = $("<p>").text(foodArray[i]);
        newP.attr("class","text-center");
        newDiv.append(newImg,newP);
        buttonHooker.append(newDiv);
    }
}
// renderButtons(foodArray);   //render game array button to html page

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
        renderButtons(foodArray);   //render food array button to html page

// testing google own method
var map;
// var infowindow;

function initMap(x) {   //modded
  var pyrmont = {lat: 37.4228775, lng: -122.085133};

  map = new google.maps.Map(document.getElementById('map'), {
    center: pyrmont,
    zoom: 15
  });

//   infowindow = new google.maps.InfoWindow();
  var service = new google.maps.places.PlacesService(map);
  service.nearbySearch({
    location: pyrmont,
    radius: 2500,
    type: ['restaurant'],
    keyword: x, //modded
  }, callback);
}


function callback(results, status) {

  if (status == google.maps.places.PlacesServiceStatus.OK) {
    
    var arrayRestaurantInfo =[];  // define array to capture the google place info store multiple restarunt
    for (var i = 0; i < results.length; i++) {
        var place = results[i];
        var Info =[];  // define array to capture the info of one restaurant
        //push into info array data we filtered out
        Info.push(place.name, place.vicinity, "3", place.rating, place.opening_hours.open_now)
        console.log(place.name);
        // console.log(place.place_id);
        console.log(place.rating);
        console.log(place.vicinity);
        console.log("lat = " +place.geometry.location.lat());
        console.log("lon = " +place.geometry.location.lng());
        console.log("Open? "+place.opening_hours.open_now);  // modded
        // var types = String(place.types);
        // types = types.split(",");
        // console.log(types[0]);
        console.log(Info);
        arrayRestaurantInfo.push(Info);  // push one restaurant into restaurant array
    }
    console.log(arrayRestaurantInfo);

    return arrayRestaurantInfo;  // return the array after capture all data
    // localStorage.setItem("restaurantArray",JSON.stringfy(arrayRestaurantInfo));
    // console.log(localStorage.getItem("restaurantArray"));
    
  }
}

////******/

//user click the imgButtons calling google place api

var foodQueryVar;

$(document).on("click", ".imgButtons", function(){

    foodQueryVar = $(this).attr("data-foodtype");
    console.log(foodQueryVar);
    setTimeout(f(),3000)
    var arrayBackFromPlaceApi =  initMap(foodQueryVar);  // JSON.parse(localStorage.getItem("restaurantArray")) ;
//["ded","deded"]//
    //testing render
    console.log(arrayBackFromPlaceApi);

    renderTableHeader();
    for(var i = 0; i<arrayBackFromPlaceApi.length ; i++){
        renderTableData(i,arrayBackFromPlaceApi[i][0],arrayBackFromPlaceApi[i][1],arrayBackFromPlaceApi[i][2],arrayBackFromPlaceApi[i][3],arrayBackFromPlaceApi[i][4]);
    }
});

//add hover effect  //added
$(document).on("mouseover", ".imgButtons", function(){
    $(this).hover(function(){$(this).attr("src","assets/images/0"+$(this).attr("data-foodindex") +"i.png")},
                  function(){$(this).attr("src","assets/images/0"+$(this).attr("data-foodindex") +".png")});
});


//added
// separate table header render from tbody data.
function renderTableHeader(){
    var tableHooker = $("#contentContainer");
    var table = $("<table>").attr("class","table table-striped table-dark");
    var thead = $("<thead>").html("<tr><th scope=\"col\"></th><th scope=\"col\">Name of Place</th><th scope=\"col\">Address</th><th scope=\"col\">Appx Distance(Miles)</th><th scope=\"col\">Rating(Max 5.0)</th><th scope=\"col\">Open</th></tr>");
    var tbody = $("<tbody>").attr("id","table-content"); // define tbody id hooker to make future data append easier
    table.append(thead,tbody);
    tableHooker.append(table);
}

// define a recallable table body render to fill in the table data
function renderTableData(a,b,c,d,e,f){
    var tableContentHooker = $("#table-content");
    var tdata = $("<tr>").html("<td scope=\"row\">"+a+"</td><td scope=\"col\">"+b+"</td><td scope=\"col\">"+c+"</td><td scope=\"col\">"+d+"</td><td scope=\"col\">"+e+"</td><td scope=\"col\">"+f+"</td >");
    tableContentHooker.append(tdata);
}
