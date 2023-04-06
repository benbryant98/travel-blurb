$(document).ready(function () {
  var searchForm = $("#search-form");
  var cityNameInput = $("#city-input");
  var travelFacts = $("#facts-list");
  var weatherFacts = $("#weather-facts");
  var streetView = $("#streetview");

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
          getCurrentWeather(cityLat, cityLon);
          getCityDetails(cityLat, cityLon);
          getStreetView(cityLat, cityLon);
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

      let regionFact = $("<p>");
      let countryFact = $("<p>");
      let popFact = $("<p>");

      regionFact.text("Region: " + response.data[0].region);
      countryFact.text("Country: " + response.data[0].country);
      popFact.text("Population: " + response.data[0].population);

      travelFacts.append(regionFact);
      travelFacts.append(countryFact);
      travelFacts.append(popFact);
    });
  };

  var sunriseTime = "";

  var getCurrentWeather = function (cityLat, cityLon) {
    const weatherAPI =
      "https://api.openweathermap.org/data/2.5/weather?lat=" +
      cityLat +
      "&lon=" +
      cityLon +
      "&units=imperial&appid=b87e30ca575aaba2c00121e487cdcd6c";

    fetch(weatherAPI).then(function (response) {
      if (response.ok) {
        response.json().then(function (data) {
          console.log(data);

          var sunriseUnix = data.sys.sunrise;
          let date = new Date(sunriseUnix * 1000);
          var sunriseTime = date.getHours() + ":" + date.getMinutes();

          let feelsBlurb = $("<p>");
          let humidBlurb = $("<p>");
          let maxBlurb = $("<p>");
          let minBlurb = $("<p>");
          let sunriseBlurb = $("<p>");
          let iconBlurb = $("<img>");

          feelsBlurb.text(
            "Feels Like: " + Math.trunc(data.main.feels_like) + "\u00b0F"
          );
          humidBlurb.text("Humidity: " + data.main.humidity + "%");
          maxBlurb.text(
            "Today's High: " + Math.trunc(data.main.temp_max) + "\u00b0F"
          );
          minBlurb.text(
            "Today's Low: " + Math.trunc(data.main.temp_min) + "\u00b0F"
          );
          iconBlurb.attr(
            "src",
            "https://openweathermap.org/img/w/" + data.weather[0].icon + ".png"
          );
          sunriseBlurb.text("Sunrise: " + sunriseTime + " local time");

          weatherFacts.append(iconBlurb);
          weatherFacts.append(maxBlurb);
          weatherFacts.append(minBlurb);
          weatherFacts.append(feelsBlurb);
          weatherFacts.append(humidBlurb);
          weatherFacts.append(sunriseBlurb);
        });
      }
    });
  };

  var getStreetView = function (cityLat, cityLon) {
    let source =
      "https://www.google.com/maps/embed/v1/streetview?key=AIzaSyAn0ozTNUpeqnCrcTGwY1mYqKprIt24XvE&location=" +
      cityLat +
      "," +
      cityLon +
      "&heading=210&pitch=10&fov=35";
    streetView.attr("src", source);
  };
});
