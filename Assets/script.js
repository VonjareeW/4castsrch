
let searchHistory = []
let previousCity = ""



// api link to openweather, format the OpenWeather api url with own apikey
let getCityWeather = function(city) {
    
    let apiUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=0cf3764eff1a6054dc2b81ca7a50793a&units=imperial";

    // make a fetch to the url Api
    fetch(apiUrl)
        
        .then(function(response) {
        
            if (response.ok) {
                response.json().then(function(data) {
                    displayWeather(data);
                });
            
            } else {
                alert("Error: " + response.statusText);
            }
        })  

        
        .catch(function(error) {
            alert("Cannot connect ");
        })
};

// function to handle city search form submit 
let searchSubmitHandler = function(event) {
    
    event.preventDefault();

    // get value from user and check to see if input has data
    let userCity = $("#userCity").val().trim();

    
    if(userCity) {
        
        getCityWeather(userCity);

        $("#userCity").val("");
    } else {
        
        alert("Enter a City");
    }
};


let displayWeather = function(weatherData) {

    // format and display the values for cards 
    $("#cityName").text(weatherData.name + " (" + dayjs(weatherData.dt * 1000).format("MM/DD/YYYY") + ") ").append(`<img src="https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png"></img>`);
    $("#cityTemp").text("Temperature: " + Math.round(weatherData.main.temp) + "°F");
    $("#cityHumidity").text("Humidity: " + weatherData.main.humidity + "%");
    $("#cityWind").text("Wind Speed: " + weatherData.wind.speed.toFixed(1) + " mph");

    
    fetch("https://api.openweathermap.org/data/2.5/uvi?lat=" + weatherData.coord.lat + "&lon="+ weatherData.coord.lon + "&appid=0cf3764eff1a6054dc2b81ca7a50793a")
        .then(function(response) {
            response.json().then(function(data) {

                
                $("#uv-box").text(data.value);

// color change based on uv index
                if(data.value >= 11) {
                    $("#uv-box").css("background-color", "#6c49cb")
                } else if (data.value < 11 && data.value >= 8) {
                    $("#uv-box").css("background-color", "#d90011")
                } else if (data.value < 8 && data.value >= 6) {
                    $("#uv-box").css("background-color", "#f95901")
                } else if (data.value < 6 && data.value >= 3) {
                    $("#uv-box").css("background-color", "#f7e401")
                } else {
                    $("#uv-box").css("background-color", "#299501")
                }      
            })
        });

    
    fetch("https://api.openweathermap.org/data/2.5/forecast?q=" + weatherData.name + "&appid=0cf3764eff1a6054dc2b81ca7a50793a&units=imperial")
        .then(function(response) {
            response.json().then(function(data) {

                
                $("#five-day").empty();

                // get every 8th value  from the api call
                for(i = 7; i <= data.list.length; i += 8){

                    // insert data into my day forecast card template
                    let fiveDayCard =`
                    <div class="col-md-2 m-2 py-3 card text-black bg-primary">
                        <div class="card-body p-1">
                            <h5 class="card-title">` + dayjs(data.list[i].dt * 1000).format("MM/DD/YYYY") + `</h5>
                            <img src="https://openweathermap.org/img/wn/` + data.list[i].weather[0].icon + `.png" alt="rain">
                            <p class="card-text">Temp: ` + Math.round(data.list[i].main.temp) + `  °F </p>
                            <p class="card-text">Humidity: ` + data.list[i].main.humidity + ` % </p>
                        </div>
                    </div>
                    `;

                    
                    $("#five-day").append(fiveDayCard);
               }
            })
        });

    // save the last city searched
    previousCity = weatherData.name;
    savepriorSearch(weatherData.name);
};

// function to save the city search history to local storage
let savepriorSearch = function (city) {
    if(!searchHistory.includes(city)){
        searchHistory.push(city);
        $("#search-history").append("<a href='#' class='list-group-item list-group-item-action' id='" + city + "'>" + city + "</a>")
    } 

    localStorage.setItem("weathersearchHistory", JSON.stringify(searchHistory));
    localStorage.setItem("previousCity", JSON.stringify(previousCity));

    loadsearchHistory();
};

// load prior searches from saved city search history from local storage
let loadsearchHistory = function() {
    searchHistory = JSON.parse(localStorage.getItem("weathersearchHistory"));
    previousCity = JSON.parse(localStorage.getItem("previousCity"));
  
    
    if (!searchHistory) {
        searchHistory = []
    }

    if (!previousCity) {
        previousCity = ""
    }

    $("#search-history").empty();

    for(i = 0 ; i < searchHistory.length ;i++) {

        
        $("#search-history").append("<a href='#' class='list-group-item list-group-item-action' id='" + searchHistory[i] + "'>" + searchHistory[i] + "</a>");
    }
  };

//  history from local storage
loadsearchHistory();

// start page with prior city searched 
if (previousCity != ""){
    getCityWeather(previousCity);
}

// event handlers
$("#search-form").submit(searchSubmitHandler);
$("#search-history").on("click", "a", function(event) {
    let selectedCity = $(event.target).attr("id");
    getCityWeather(selectedCity);
});


savepriorSearch(previousCity);
