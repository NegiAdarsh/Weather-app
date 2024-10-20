import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import CurrentWeather from './components/CurrentWeather';
import Highlights from './components/Highlights';
import WeeklyForecast from './components/WeeklyForecast';
import HourlyForecast from './components/HourlyForecast';
import './App.css';

const API_KEY = 'e4ba4b05eee9251d041f4745a2222fce';
const API_BASE_URL = 'https://api.openweathermap.org/data/2.5';

// Suggested cities
const suggestedCities = ['Delhi', 'Mumbai', 'Chennai', 'Bangalore', 'Kolkata', 'Hyderabad'];

function App() {
  const [city, setCity] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [intervalId, setIntervalId] = useState(null);
  const [unit, setUnit] = useState('metric'); // State for temperature unit

  const fetchWeatherData = async (cityName) => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${API_BASE_URL}/weather?q=${cityName}&units=${unit}&appid=${API_KEY}`);
      if (!response.ok) {
        throw new Error('City not found');
      }
      const data = await response.json();
      setWeatherData(data);
    } catch (error) {
      setError(error.message);
      console.error('Error fetching weather data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchForecastData = async (cityName) => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${API_BASE_URL}/forecast?q=${cityName}&units=${unit}&appid=${API_KEY}`);
      if (!response.ok) {
        throw new Error('Forecast data not available');
      }
      const data = await response.json();
      setForecast(data);
    } catch (error) {
      setError(error.message);
      console.error('Error fetching forecast data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (city.trim()) {
      fetchWeatherData(city);
      fetchForecastData(city);

      // Clear any existing interval
      if (intervalId) {
        clearInterval(intervalId);
      }

      // Set a new interval to fetch data every 5 minutes
      const id = setInterval(() => {
        fetchWeatherData(city);
        fetchForecastData(city);
      }, 300000); // 5 minutes in milliseconds

      setIntervalId(id);
    }
  };

  // Clear the interval when the component unmounts
  useEffect(() => {
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [intervalId]);

  // Handle suggested city selection
  const handleSuggestionClick = (suggestedCity) => {
    setCity(suggestedCity);
    fetchWeatherData(suggestedCity);
    fetchForecastData(suggestedCity);
  };

  // Toggle temperature unit
  const toggleUnit = () => {
    setUnit((prevUnit) => (prevUnit === 'metric' ? 'standard' : 'metric'));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 to-purple-500 p-8">
      <div className="container mx-auto max-w-4xl bg-white bg-opacity-90 rounded-3xl shadow-2xl overflow-hidden">
        <div className="p-8">
          <h1 className="text-4xl font-bold mb-8 text-center text-gray-800">Weather Forecast</h1>
          <form onSubmit={handleSearch} className="mb-8 flex justify-center">
            <div className="relative w-full max-w-md">
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Enter city name"
                className="w-full p-4 pr-12 text-gray-700 bg-white border-2 border-gray-300 rounded-full focus:outline-none focus:border-blue-500 transition duration-300"
              />
              <button 
                type="submit" 
                className="absolute right-2 top-2 bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600 transition duration-300"
                disabled={loading}
              >
                {loading ? (
                  <div className="w-6 h-6 border-t-2 border-white border-solid rounded-full animate-spin"></div>
                ) : (
                  <Search size={24} />
                )}
              </button>
            </div>
          </form>

          <div className="flex items-center justify-center mb-4">
            <label className="mr-4 text-gray-700">Temperature Unit:</label>
            <button
              onClick={toggleUnit}
              className={`px-4 py-2 rounded-full ${unit === 'metric' ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-700'}`}
            >
              Celsius
            </button>
            <button
              onClick={toggleUnit}
              className={`px-4 py-2 rounded-full ${unit === 'standard' ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-700'}`}
            >
              Kelvin
            </button>
          </div>

          {error && (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-8 rounded" role="alert">
              <p className="font-bold">Error</p>
              <p>{error}</p>
            </div>
          )}

          {/* Suggested cities section */}
          <div className="mb-8">
            <h2 className="text-lg font-bold">Popular Cities :</h2>
            <div className="flex flex-wrap">
              {suggestedCities.map((suggestedCity) => (
                <button
                  key={suggestedCity}
                  onClick={() => handleSuggestionClick(suggestedCity)}
                  className="suggestion-bubble"
                >
                  {suggestedCity}
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
