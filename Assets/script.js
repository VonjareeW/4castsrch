// array to hold the users search history
let priorSearch = []
let lastCitySearched = ""

// api call to openweathermap.org
let getCityWeather = function(city) {
    // format the OpenWeather api url
    let apiUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=0cf3764eff1a6054dc2b81ca7a50793a&units=imperial";

    