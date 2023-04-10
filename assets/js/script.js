$(document).ready(function () {
  // define links to document
  var searchForm = $("#search-form");
  var cityNameInput = $("#city-input");
  var travelFacts = $("#facts-list");
  var weatherFacts = $("#weather-facts");
  var streetView = $("#streetview");
  var searchDiv = $(".searchbar");
  var contentDiv = $("#hideFirst");

  // create event for search submit
  searchForm.on("submit", function (event) {
    event.preventDefault();

    // prepares the container for next search by deleting existing elements
    travelFacts.empty();
    weatherFacts.empty();

    // handles state and country inputs
    cityName = cityNameInput.val().split(",");
    commaId = cityName[1];
    getCoordinates(cityName[0]);
    
    localStorage.setItem(cityName[0], JSON.stringify(cityName));
  });

  // function for converting string of city into latitude and longitude
  var getCoordinates = function (cityName) {
    let apiCoord =
      "https://api.openweathermap.org/geo/1.0/direct?q=" +
      cityName +
      "&appid=b87e30ca575aaba2c00121e487cdcd6c";

    fetch(apiCoord).then(function (response) {
      if (response.ok) {
        response.json().then(function (data) {
          contentDiv.css("visibility: visible;");
          // saves coordinate values from API response to variables for use in weather functions

          cityLat = data[0].lat;
          cityLon = data[0].lon;

          // execute api call functions
          getCurrentWeather(cityLat, cityLon);
          getCityDetails(cityLat, cityLon);
          getStreetView(cityLat, cityLon);

          // store city name for previous search button
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
      // concatenate url with latitude and longitude values
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

    $.ajax(cityDetails).done(function (response) {
      console.log(response);

      // create elements for response data
      let regionFact = $("<p>");
      let countryFact = $("<p>");
      let popFact = $("<p>");

      // set element text to response data
      regionFact.text("Region: " + response.data[0].region);
      countryFact.text("Country: " + response.data[0].country);
      popFact.text("Population: " + response.data[0].population);

      travelFacts.append(regionFact);
      travelFacts.append(countryFact);
      travelFacts.append(popFact);
    });
  };

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

          // convert unix value from api response to formatted HH:MM for sunrise
          var sunriseUnix = data.sys.sunrise;
          let date = new Date(sunriseUnix * 1000);
          var sunriseTime = date.getHours() + ":" + date.getMinutes();

          let feelsBlurb = $("<p>");
          let humidBlurb = $("<p>");
          let maxBlurb = $("<p>");
          let minBlurb = $("<p>");
          let sunriseBlurb = $("<p>");
          // icon has to be image with src url
          let iconBlurb = $("<img>");

          // round temperatures to whole numbers and add Fahrenheit
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
          // sets img src to url from openweather api concatenated with icon response
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
    // allows for streetview render to be dynamic based on search
    let source =
      "https://www.google.com/maps/embed/v1/streetview?key=AIzaSyAn0ozTNUpeqnCrcTGwY1mYqKprIt24XvE&location=" +
      cityLat +
      "," +
      cityLon +
      "&heading=210&pitch=10&fov=35";

    streetView.attr("src", source);
  };

  var slideIndex = 1;
  showSlides(slideIndex);

  $(".prev").click(function () {
    changeSlide(-1);
  });
  $(".next").click(function () {
    changeSlide(1);
  });

  // handles next and previous slides
  function changeSlide(n) {
    showSlides((slideIndex += n));
  }

  function showSlides(n) {
    let i;
    let slides = $(".imgCarousel");
    if (n > slides.length) {
      slideIndex = 1;
    } else if (n < 1) {
      slideIndex = slides.length;
    }
    for (i = 0; i < slides.length; i++) {
      $(slides[i]).attr("style", "display: none");
    }
    $(slides[slideIndex - 1]).attr("style", "display: block");
  }

  var setHistoryButtons = function () {
    for (i = 0; i < localStorage.length; i++) {
      let historyBtn = $("<button>");
      historyBtn.addClass("cityBtn");
      let savedData = JSON.parse(localStorage.getItem(localStorage.key(i)));
      savedData = savedData.charAt(0).toUpperCase() + savedData.slice(1);
      historyBtn.text(savedData);

      searchDiv.append(historyBtn);
    }
  };

  setHistoryButtons();

  $(document).on("click", ".cityBtn", function () {
    console.log($(this).text());
    travelFacts.empty();
    weatherFacts.empty();
    getCoordinates($(this).text());
  });
});
