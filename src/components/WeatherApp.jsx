import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// API key and base URL (replace with your actual API key)
const API_KEY = 'your_openweathermap_api_key';
const API_BASE_URL = 'https://api.openweathermap.org/data/2.5';

const WeatherApp = () => {
  const [city, setCity] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [forecast, setForecast] = useState(null);

  const fetchWeatherData = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/weather?q=${city}&units=metric&appid=${API_KEY}`);
      const data = await response.json();
      setWeatherData(data);
    } catch (error) {
      console.error('Error fetching weather data:', error);
    }
  };

  const fetchForecastData = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/forecast?q=${city}&units=metric&appid=${API_KEY}`);
      const data = await response.json();
      setForecast(data);
    } catch (error) {
      console.error('Error fetching forecast data:', error);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchWeatherData();
    fetchForecastData();
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Weather App</h1>
      <form onSubmit={handleSearch} className="mb-4">
        <input
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="Enter city name"
          className="p-2 border rounded mr-2"
        />
        <button type="submit" className="bg-blue-500 text-white p-2 rounded">Search</button>
      </form>
      {weatherData && <CurrentWeather data={weatherData} />}
      {weatherData && <Highlights data={weatherData} />}
      {forecast && <WeeklyForecast data={forecast} />}
      {forecast && <HourlyForecast data={forecast} />}
    </div>
  );
};

export default WeatherApp;