"use strict";
const loadingScreen = document.getElementById("loading-screen");
loadingScreen.style.display = "";
setTimeout(() => {
  loadingScreen.style.display = "none";
}, 4000);
document.addEventListener("DOMContentLoaded", (e) => {
  const input = document.querySelector(".search__input");
  const btn = document.querySelector(".btn__search");
  const temprature = document.querySelector("#temprature");
  const highTemp = document.querySelector("#h__temp");
  const lowTemp = document.querySelector("#l__temp");
  const feelsLike = document.querySelector("#feels_like");
  const windSpeed = document.querySelector("#wind_speed");
  const humidity = document.querySelector("#humidity");

  const air = document.querySelector("#air_quality");
  async function getCurrentLocationWeather() {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;

        try {
          const weatherData = await fetchWeatherData(lon, lat);
          updateWeatherDisplay(weatherData);
          airQuality(lon, lat);
        } catch (error) {
          console.error("Error fetching weather data:", error);
        }
      });
    } else {
      console.error("Geolocation is not available in this browser.");
    }
  }

  // ... (existing code)

  // Automatically fetch and display weather data for current location
  getCurrentLocationWeather();
  async function fetchWeatherData(lon, lat) {
    const apiKey = "c1a167f4f6ebec7337196551d8121377";
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}`;

    try {
      const response = await fetch(apiUrl);
      return await response.json();
    } catch (error) {
      console.error("Error fetching weather data:", error);
      throw error;
    }
  }

  function convertKelvinToCelsius(kelvin) {
    return Math.trunc(kelvin - 273.15);
  }

  function convertMpsToMph(mps) {
    return Math.trunc(mps * 2.237);
  }
  function celsiusToFahrenheit(celsius) {
    return (celsius * 9) / 5 + 32;
  }
  function updateWeatherDisplay(data) {
    const celciusTemp = convertKelvinToCelsius(data.main.temp);
    const highTempC = convertKelvinToCelsius(data.main.temp_max);
    const lowTempC = convertKelvinToCelsius(data.main.temp_min);
    const feelsC = convertKelvinToCelsius(data.main.feels_like);
    const windMph = convertMpsToMph(data.wind.speed);

    temprature.textContent = `${celciusTemp}°`;
    highTemp.textContent = `H:${highTempC}°`;
    lowTemp.textContent = `L:${lowTempC}°`;
    feelsLike.textContent = `${feelsC}°`;
    windSpeed.textContent = `${windMph}mph`;
    humidity.textContent = `${data.main.humidity}%`;
    const weatherIconElement = document.querySelector(".weather-icon");
    const weatherIcon = data.weather[0].icon;
    weatherIconElement.style.backgroundImage = `url('http://openweathermap.org/img/wn/${weatherIcon}.png')`;
  }
  async function airQuality(lon, lat) {
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=c1a167f4f6ebec7337196551d8121377`
      );
      const result = await response.json();

      const airQualityIndex = result.list[0].main.aqi;
      if (result && result.list && result.list.length > 0) {
        if (airQualityIndex === 1) {
          air.textContent = `GOOD: ${airQualityIndex}`;
          console.log("Air Quality:", airQualityIndex);
        } else if (airQualityIndex === 2) {
          air.textContent = `Moderate: ${airQualityIndex}`;
          console.log("Air Quality:", airQualityIndex);
        } else if (airQualityIndex === 3) {
          air.textContent = `AQ: Unhealthy for sensitive groups: ${airQualityIndex}`;
          air.style.fontSize = "20px";
          console.log("Air Quality:", airQualityIndex);
        } else if (airQualityIndex === 4) {
          air.textContent = `Unhealthy: ${airQualityIndex}`;
          console.log("Air Quality:", airQualityIndex);
        } else if (airQualityIndex === 5) {
          air.textContent = `Very Unhealthy: ${airQualityIndex}`;
          console.log("Air Quality:", airQualityIndex);
        } else if (airQualityIndex === 6) {
          air.textContent = `Hazardous: ${airQualityIndex}`;
          console.log("Air Quality:", airQualityIndex);
        }
      } else {
        console.log("Air quality data not available.");
      }
    } catch (error) {
      console.error("Error fetching air quality data:", error);
    }
  }
  async function handleSearchButtonClick() {
    const cityName = input.value;
    const geoURL = `https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=c1a167f4f6ebec7337196551d8121377`;

    try {
      const response = await fetch(geoURL);
      const result = await response.json();

      if (result.length > 0) {
        const foundCity = result[0];
        const foundCityName = foundCity.name;

        if (foundCityName.toLowerCase() === cityName.toLowerCase()) {
          console.log("City found:", foundCity);
          const lon = foundCity.lon;
          const lat = foundCity.lat;
          const weatherData = await fetchWeatherData(lon, lat);
          updateWeatherDisplay(weatherData);
          airQuality(lon, lat);
        } else {
          console.log("City name does not match the input.");
        }
      } else {
        console.log("City not found.");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }
  const unitSwitch = document.querySelector(".unit__switch");
  let isCelsius = true; // Track current temperature unit (Celsius by default)

  unitSwitch.addEventListener("click", (e) => {
    e.preventDefault();
    isCelsius = !isCelsius;
    const temperature = parseFloat(temprature.textContent);

    if (isCelsius) {
      temprature.textContent = `${convertKelvinToCelsius(temperature)}°C`;
      highTemp.textContent = `H:${convertKelvinToCelsius(
        parseFloat(highTemp.textContent.split(":")[1])
      )}°C`;
      lowTemp.textContent = `L:${convertKelvinToCelsius(
        parseFloat(lowTemp.textContent.split(":")[1])
      )}°C`;
      feelsLike.textContent = `${convertKelvinToCelsius(
        parseFloat(feelsLike.textContent)
      )}°C`;
    } else {
      temprature.textContent = `${celsiusToFahrenheit(temperature)}°F`;
      highTemp.textContent = `H:${celsiusToFahrenheit(
        parseFloat(highTemp.textContent.split(":")[1])
      )}°F`;
      lowTemp.textContent = `L:${celsiusToFahrenheit(
        parseFloat(lowTemp.textContent.split(":")[1])
      )}°F`;
      feelsLike.textContent = `${celsiusToFahrenheit(
        parseFloat(feelsLike.textContent)
      )}°F`;
    }
  });
  btn.addEventListener("click", handleSearchButtonClick);
  input.addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
      handleSearchButtonClick();
    }
  });
});
