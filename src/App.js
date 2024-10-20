import React, { useState, useEffect, useCallback } from 'react';
import { Search } from 'lucide-react';
import CurrentWeather from './components/CurrentWeather';
import Highlights from './components/Highlights';
import WeeklyForecast from './components/WeeklyForecast';
import HourlyForecast from './components/HourlyForecast';
import BackgroundVideo from './components/BackgroundVideo';
import './App.css';

const API_KEY = 'e4ba4b05eee9251d041f4745a2222fce';
const API_BASE_URL = 'https://api.openweathermap.org/data/2.5';

const suggestedCities = ['Delhi', 'Mumbai', 'Chennai', 'Bangalore', 'Kolkata', 'Hyderabad'];

function App() {
  const [searchInput, setSearchInput] = useState('');
  const [activeCity, setActiveCity] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [unit, setUnit] = useState('metric');

  const fetchWeatherData = useCallback(async (cityName, tempUnit) => {
    if (!cityName) return;
    
    setLoading(true);
    setError(null);

    try {
      // Only include units parameter if metric is selected
      const unitParam = tempUnit === 'metric' ? `&units=metric` : '';
      
      const weatherUrl = `${API_BASE_URL}/weather?q=${cityName}${unitParam}&appid=${API_KEY}`;
      const forecastUrl = `${API_BASE_URL}/forecast?q=${cityName}${unitParam}&appid=${API_KEY}`;

      const [weatherResponse, forecastResponse] = await Promise.all([
        fetch(weatherUrl),
        fetch(forecastUrl)
      ]);

      if (!weatherResponse.ok || !forecastResponse.ok) {
        throw new Error('City not found or data unavailable');
      }

      const [weather, forecast] = await Promise.all([
        weatherResponse.json(),
        forecastResponse.json()
      ]);

      setWeatherData(weather);
      setForecast(forecast);
      setActiveCity(cityName);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching weather data:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleUnitChange = useCallback((newUnit) => {
    setUnit(newUnit);
    if (activeCity) {
      fetchWeatherData(activeCity, newUnit);
    }
  }, [activeCity, fetchWeatherData]);

  const handleCitySelect = useCallback((cityName) => {
    if (cityName.trim()) {
      setSearchInput(cityName);
      fetchWeatherData(cityName, unit);
    }
  }, [unit, fetchWeatherData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    handleCitySelect(searchInput);
  };

  const handleSuggestionClick = (suggestedCity) => {
    handleCitySelect(suggestedCity);
  };

  return (
    <div className="app-container">
      {weatherData && (
        <BackgroundVideo
          weatherCondition={weatherData.weather[0].description}
          icon={weatherData.weather[0].icon}
        />
      )}
      <div className="content-container">
        <div className="weather-card">
          <h1 className="text-4xl font-bold mb-8 text-center text-gray-800">
            Weather Forecast
          </h1>

          <form onSubmit={handleSubmit} className="mb-8 flex justify-center">
            <div className="relative w-full max-w-md">
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Enter city name"
                className="w-full p-4 pr-12 text-gray-700 bg-white border-2 border-gray-300 rounded-full focus:outline-none focus:border-blue-500 transition duration-300"
              />
              <button 
                type="submit" 
                className="absolute right-2 top-2 bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600 transition duration-300"
                disabled={loading}
              >
                {loading ? (
                  <div className="w-6 h-6 border-t-2 border-white border-solid rounded-full animate-spin" />
                ) : (
                  <Search size={24} />
                )}
              </button>
            </div>
          </form>

          <div className="flex items-center justify-center mb-4">
            <label className="mr-4 text-gray-700">Temperature Unit:</label>
            <div className="flex space-x-2">
              <button
                onClick={() => handleUnitChange('metric')}
                className={`px-4 py-2 rounded-full transition-colors ${
                  unit === 'metric' ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-700'
                }`}
              >
                Celsius
              </button>
              <button
                onClick={() => handleUnitChange('kelvin')}
                className={`px-4 py-2 rounded-full transition-colors ${
                  unit === 'kelvin' ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-700'
                }`}
              >
                Kelvin
              </button>
            </div>
          </div>

          {error && (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-8 rounded" role="alert">
              <p className="font-bold">Error</p>
              <p>{error}</p>
            </div>
          )}

          <div className="mb-8">
            <h2 className="text-lg font-bold">Popular Cities:</h2>
            <div className="flex flex-wrap gap-2">
              {suggestedCities.map((city) => (
                <button
                  key={city}
                  onClick={() => handleSuggestionClick(city)}
                  className="suggestion-bubble"
                >
                  {city}
                </button>
              ))}
            </div>
          </div>

          {weatherData && <CurrentWeather data={weatherData} unit={unit} />}
          {weatherData && <Highlights data={weatherData} />}
          {forecast && <WeeklyForecast data={forecast} unit={unit} />}
          {forecast && <HourlyForecast data={forecast} />}
        </div>
      </div>
    </div>
  );
}

export default App;