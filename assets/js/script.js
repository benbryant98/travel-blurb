$(document).ready(function () {
  const settings = {
    async: true,
    crossDomain: true,
    url: "https://wft-geo-db.p.rapidapi.com/v1/geo/cities?types=CITY&location=%2B37.5361-77.3209&limit=1",
    method: "GET",
    headers: {
      "X-RapidAPI-Key": "77be6e29a1mshf3307506b41c4c1p17afd7jsnde21a1d5a09d",
      "X-RapidAPI-Host": "wft-geo-db.p.rapidapi.com",
    },
  };

  $.ajax(settings).done(function (response) {
    console.log(response);
  });
});
