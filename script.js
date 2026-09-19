/* =========================================
   WEATHERLY
   Open-Meteo Weather API
========================================= */


/* =========================================
   HTML ELEMENTS
========================================= */

const cityInput = document.getElementById("cityInput");
const searchBtn = document.getElementById("searchBtn");

const message = document.getElementById("message");

const weatherResult =
    document.getElementById("weatherResult");

const welcomeSection =
    document.getElementById("welcomeSection");

const cityName =
    document.getElementById("cityName");

const countryName =
    document.getElementById("countryName");

const temperature =
    document.getElementById("temperature");

const humidity =
    document.getElementById("humidity");

const windSpeed =
    document.getElementById("windSpeed");

const rain =
    document.getElementById("rain");

const feelsLike =
    document.getElementById("feelsLike");

const weatherCondition =
    document.getElementById("weatherCondition");

const weatherIcon =
    document.getElementById("weatherIcon");

const currentDate =
    document.getElementById("currentDate");


/* =========================================
   SEARCH BUTTON
========================================= */

searchBtn.addEventListener("click", () => {

    const city = cityInput.value.trim();

    if (city === "") {

        showError("Please enter a city name.");

        return;

    }

    getWeather(city);

});


/* =========================================
   ENTER KEY
========================================= */

cityInput.addEventListener("keydown", (event) => {

    if (event.key === "Enter") {

        searchBtn.click();

    }

});


/* =========================================
   MAIN WEATHER FUNCTION
========================================= */

async function getWeather(city) {

    try {

        showLoading("Getting the latest weather data...");


        weatherResult.classList.add("hidden");

        welcomeSection.classList.add("hidden");


        /* =================================
           STEP 1
           FIND CITY COORDINATES
        ================================= */

        const locationURL =
            `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`;


        const locationResponse =
            await fetch(locationURL);


        if (!locationResponse.ok) {

            throw new Error(
                "Unable to connect to the location service."
            );

        }


        const locationData =
            await locationResponse.json();


        if (
            !locationData.results ||
            locationData.results.length === 0
        ) {

            throw new Error(
                "City not found. Please enter a valid city name."
            );

        }


        const location =
            locationData.results[0];


        const latitude =
            location.latitude;

        const longitude =
            location.longitude;


        /* =================================
           STEP 2
           GET WEATHER
        ================================= */

        const weatherURL =
            `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,rain,weather_code,wind_speed_10m&timezone=auto`;


        const weatherResponse =
            await fetch(weatherURL);


        if (!weatherResponse.ok) {

            throw new Error(
                "Unable to retrieve weather data."
            );

        }


        const weatherData =
            await weatherResponse.json();


        const current =
            weatherData.current;


        /* =================================
           DISPLAY LOCATION
        ================================= */

        cityName.textContent =
            location.name;


        countryName.textContent =
            location.country || "Unknown";


        /* =================================
           DISPLAY WEATHER
        ================================= */

        temperature.textContent =
            Math.round(current.temperature_2m);


        humidity.textContent =
            current.relative_humidity_2m;


        windSpeed.textContent =
            Math.round(current.wind_speed_10m);


        rain.textContent =
            current.rain;


        feelsLike.textContent =
            Math.round(
                current.apparent_temperature
            );


        /* =================================
           WEATHER CONDITION
        ================================= */

        const weatherInfo =
            getWeatherInfo(
                current.weather_code
            );


        weatherCondition.textContent =
            weatherInfo.description;


        weatherIcon.textContent =
            weatherInfo.icon;


        /* =================================
           DATE
        ================================= */

        displayDate();


        /* =================================
           SHOW RESULT
        ================================= */

        message.textContent = "";

        message.className = "message";

        weatherResult.classList.remove("hidden");


    } catch (error) {

        console.error(error);

        weatherResult.classList.add("hidden");

        welcomeSection.classList.remove("hidden");

        showError(error.message);

    }

}


/* =========================================
   WEATHER CODE
========================================= */

function getWeatherInfo(code) {

    const weatherCodes = {

        0: {
            description: "Clear Sky",
            icon: "☀️"
        },

        1: {
            description: "Mainly Clear",
            icon: "🌤️"
        },

        2: {
            description: "Partly Cloudy",
            icon: "⛅"
        },

        3: {
            description: "Overcast",
            icon: "☁️"
        },

        45: {
            description: "Foggy",
            icon: "🌫️"
        },

        48: {
            description: "Foggy",
            icon: "🌫️"
        },

        51: {
            description: "Light Drizzle",
            icon: "🌦️"
        },

        53: {
            description: "Moderate Drizzle",
            icon: "🌦️"
        },

        55: {
            description: "Heavy Drizzle",
            icon: "🌧️"
        },

        61: {
            description: "Light Rain",
            icon: "🌧️"
        },

        63: {
            description: "Moderate Rain",
            icon: "🌧️"
        },

        65: {
            description: "Heavy Rain",
            icon: "🌧️"
        },

        71: {
            description: "Light Snow",
            icon: "🌨️"
        },

        73: {
            description: "Moderate Snow",
            icon: "🌨️"
        },

        75: {
            description: "Heavy Snow",
            icon: "❄️"
        },

        80: {
            description: "Light Rain Showers",
            icon: "🌦️"
        },

        81: {
            description: "Moderate Rain Showers",
            icon: "🌧️"
        },

        82: {
            description: "Heavy Rain Showers",
            icon: "⛈️"
        },

        95: {
            description: "Thunderstorm",
            icon: "⛈️"
        },

        96: {
            description: "Thunderstorm with Hail",
            icon: "⛈️"
        },

        99: {
            description: "Heavy Thunderstorm",
            icon: "⛈️"
        }

    };


    return weatherCodes[code] || {

        description: "Unknown Weather",

        icon: "🌤️"

    };

}


/* =========================================
   DATE
========================================= */

function displayDate() {

    const today = new Date();


    const options = {

        weekday: "long",

        year: "numeric",

        month: "long",

        day: "numeric"

    };


    currentDate.textContent =
        today.toLocaleDateString(
            "en-US",
            options
        );

}


/* =========================================
   LOADING
========================================= */

function showLoading(text) {

    message.textContent =
        "⏳ " + text;

    message.className =
        "message loading";

}


/* =========================================
   ERROR
========================================= */

function showError(text) {

    message.textContent =
        "⚠ " + text;

    message.className =
        "message error";

}