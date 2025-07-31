import React, { useState } from "react";
import "./App.css";
import backgroundImage from "./background.jpg"; // Import the default background
import { WiDaySunny, WiCloud, WiRain, WiSnow, WiThunderstorm, WiFog, WiHumidity, WiStrongWind } from "react-icons/wi";

const API_KEY = "df9f15dd30d146ac78b5997d6498e575";
const UNSPLASH_ACCESS_KEY = "-KNGyITBLl9tBbmQjlQMB6tTopY2O-nj-6r24vR7ydQ";

const App = () => {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [background, setBackground] = useState(backgroundImage); // Default background
  const [error, setError] = useState(null);

  const fetchWeather = async () => {
    try {
      setError(null);
      const weatherResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}`
      );
      if (!weatherResponse.ok) throw new Error("City not found");
      const weatherData = await weatherResponse.json();
      setWeather(weatherData);

      const imageResponse = await fetch(
        `https://api.unsplash.com/search/photos?query=${city}&client_id=${UNSPLASH_ACCESS_KEY}&per_page=1`
      );
      const imageData = await imageResponse.json();
      
      setBackground(imageData.results[0]?.urls.regular || backgroundImage); // Fallback to default if no image found
    } catch (err) {
      setError(err.message);
      setWeather(null);
      setBackground(backgroundImage);
    }
  };

  const getWeatherIcon = (condition) => {
    switch (condition) {
      case "Clear":
        return <WiDaySunny className="weather-icon" />;
      case "Clouds":
        return <WiCloud className="weather-icon" />;
      case "Rain":
        return <WiRain className="weather-icon" />;
      case "Snow":
        return <WiSnow className="weather-icon" />;
      case "Thunderstorm":
        return <WiThunderstorm className="weather-icon" />;
      case "Fog":
      case "Mist":
        return <WiFog className="weather-icon" />;
      default:
        return <WiDaySunny className="weather-icon" />;
    }
  };

  return (
    <div className="app" style={{ backgroundImage: `url(${background})` }}>
      <div className="content">
        <h1>Weather App</h1>
        <div className="input-container">
          <input
            type="text"
            placeholder="Enter city/state/country"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />
          <button onClick={fetchWeather}>Get Weather</button>
        </div>
        {error && <p className="error">{error}</p>}
        {weather && (
          <div className="weather-info">
            <h2>{weather.name}, {weather.sys.country}</h2>
            <p>{weather.weather[0].description}</p>
            {getWeatherIcon(weather.weather[0].main)}
            <p><WiDaySunny className="icon" /> Temperature: {weather.main.temp}°C</p>
            <p><WiHumidity className="icon" /> Humidity: {weather.main.humidity}%</p>
            <p><WiStrongWind className="icon" /> Wind Speed: {weather.wind.speed} m/s</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
