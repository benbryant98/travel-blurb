$(document).ready(function () {
  var searchForm = $("#search-form");
  var cityNameInput = $("#city-input");

  searchForm.on("submit", function (event) {
    event.preventDefault();
    cityName = cityNameInput.val();
    getCoordinates(cityName);
  });

  var getCoordinates = function (cityName) {
    let apiCoord =
      "http://api.openweathermap.org/geo/1.0/direct?q=" +
      cityName +
      "&appid=b87e30ca575aaba2c00121e487cdcd6c";

    fetch(apiCoord).then(function (response) {
      if (response.ok) {
        response.json().then(function (data) {
          // saves coordinate values from API response to variables for use in weather functions
          cityLat = data[0].lat;
          cityLon = data[0].lon;
          // getCurrentWeather(cityLat, cityLon, cityName);
          getCityDetails(cityLat, cityLon);
          localStorage.setItem(cityName, JSON.stringify(cityName));
        });
      } else {
        alert("Error: " + response.statusText);
      }
    });
  };

  var getCityDetails = function (cityLat, cityLon) {
    const cityDetails = {
      async: true,
      crossDomain: true,
      url:
        "https://wft-geo-db.p.rapidapi.com/v1/geo/cities?types=CITY&location=%2B" +
        cityLat +
        cityLon +
        "&limit=1",
      method: "GET",
      headers: {
        "X-RapidAPI-Key": "77be6e29a1mshf3307506b41c4c1p17afd7jsnde21a1d5a09d",
        "X-RapidAPI-Host": "wft-geo-db.p.rapidapi.com",
      },
    };

    var countryCode = "";

    $.ajax(cityDetails).done(function (response) {
      console.log(response);
      countryCode = response.data[0].countryCode;
      console.log(countryCode);
    });

    // setTimeout(getCountryDetails(countryCode), 10000);
  };

  var getCountryDetails = function (countryCode) {
    const countryDetails = {
      async: true,
      crossDomain: true,
      url: "https://wft-geo-db.p.rapidapi.com/v1/geo/countries/" + countryCode,
      method: "GET",
      headers: {
        "X-RapidAPI-Key": "77be6e29a1mshf3307506b41c4c1p17afd7jsnde21a1d5a09d",
        "X-RapidAPI-Host": "wft-geo-db.p.rapidapi.com",
      },
    };

    $.ajax(countryDetails).done(function (response) {
      console.log(response);
    });
  };
});
