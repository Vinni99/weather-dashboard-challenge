
var apiKey = "&appid=527dcf6e38939483d3ad43186117df6b";
var city = "";
var cityArr = JSON.parse(localStorage.getItem("searchedCity")) || [];

function displayCities(cityArr) {
  $("#previous-searches").empty();

  if (!cityArr) {
    return false;
  } else {

    for (var s = 0; s < cityArr.length; s++) {
      var pastSearch = $("<button>");
      pastSearch.val(cityArr[s])
        .text(cityArr[s])
        .attr("search-number", s)
        .addClass("btn btn-secondary btn-block")
        .appendTo("#previous-searches");
    }
  }
}


function storeCity(cityName) {
  cityArr = localStorage.setItem("searchedCity", JSON.stringify(cityName));

  console.log(JSON.parse(localStorage.getItem("searchedCity")));
}


$("#searchBtn").on("click", function (event) {
  event.preventDefault();
  city = $("#searchTerm").val().trim();
  cityArr.push(city);
  displayCities(cityArr);
  localStorage.setItem("searchedCity", JSON.stringify(cityArr));
  $("searchTerm").val("");
  fetchWeather(city);

});




$(document).on("click", ".btn-secondary", function () {
  var searchNumberButton = $(this).val();
  city = searchNumberButton;
  fetchWeather(city);
})

function fetchWeather(cityName) {


  var requestUrl = 'https://api.openweathermap.org/geo/1.0/direct?' + 'q=' + cityName + apiKey;

  fetch(requestUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function (response) {
      var cityLat = response[0].lat;
      var cityLong = response[0].lon;

      var requestUrl1 = 'https://api.openweathermap.org/data/2.5/onecall?' + '&lat=' + cityLat + '&lon=' + cityLong + '&exclude=minutely,hourly,alerts' + '&units=imperial' + apiKey;


      return fetch(requestUrl1);
    })
    .then(function (response) {
      return response.json();
    })
    .then(function (response) {
      console.log(response);
      var weatherDataArr = (response.daily);
      displayCurrentWeather(weatherDataArr);
      displayForecastWeather(weatherDataArr);
    });
}

function displayCurrentWeather(weatherData) {

  $("#city-stats-space").empty();
  var currentDate = moment.unix(weatherData[0].dt).format('dddd, MMMM Do, YYYY');
  $("#city-stats-space")
    .html("<h3>" + city + " - " + currentDate + "<img id='icon' src='' alt='Weather icon'></h3>")

  var currentIcon = weatherData[0].weather[0].icon;
  var iconImg = "https://openweathermap.org/img/w/" + currentIcon + ".png";
  $("#icon").attr("src", iconImg);

  var currentTemp = weatherData[0].temp.day;
  var currentWind = weatherData[0].wind_speed;
  var currentHumidity = weatherData[0].humidity;
  var currentUvi = weatherData[0].uvi;

  $("#current-stats-space")
    .html(
      "<p>Temperature:  " + currentTemp + "&deg;F</p>" +
      "<p>Wind Speed:  " + currentWind + " MPH</p>" +
      "<p>Humidity:  " + currentHumidity + "%</p>" +
      "<p>UV Index:  <span id='uv-style'>&nbsp;&nbsp;&nbsp;" + currentUvi + "&nbsp;&nbsp;&nbsp;</span></p>");

  if (currentUvi < 2.0) {
    $("#uv-style")
      .addClass("uv-favorable");
  } else if (currentUvi > 2.0 && currentUvi < 8.0) {
    $("#uv-style")
      .addClass("uv-moderate");
  } else if (currentUvi > 8.0) {
    $("#uv-style")
      .addClass("uv-severe");
  }
}


function displayForecastWeather(weatherData) {
  $("#forecast-boxes").empty();

  for (var i = 1; i < 6; i++) {
    var forecastDate = moment.unix(weatherData[i].dt).format('dddd, MMMM Do');
    var forecastTemp = weatherData[i].temp.day;
    var forecastIcon = weatherData[i].weather[0].icon;
    var forecastWind = weatherData[i].wind_speed;
    var forecastHumidity = weatherData[i].humidity;
    var iconFutureImg = "https://openweathermap.org/img/w/" + forecastIcon + ".png";


    var forecastDayEl = $("<div>")
      .addClass("box")
      .attr("data-id", i)
      .appendTo("#forecast-boxes");

    $(forecastDayEl).each(function () {
      $("<h4>").attr("data-id", $(this).append(forecastDate + "</br></br>"))
      $("<img>").attr("data-id", $(this).append("<img src=" + iconFutureImg + ">" + "</br>"))
      $("<p>").attr("data-id", $(this).append("Temperature: " + forecastTemp + "&deg;F" + "</br>"))
      $("<p>").attr("data-id", $(this).append("Wind: " + forecastWind + " MPH" + "</br>"))
      $("<p>").attr("data-id", $(this).append("Humidity: " + forecastHumidity + "%" + "</br>"))
    })
      .addClass("box-contents");
  }
}


displayCities(cityArr);

