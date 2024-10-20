import React, { useState } from 'react';
import { Search } from 'lucide-react';
import CurrentWeather from './components/CurrentWeather';
import Highlights from './components/Highlights';
import WeeklyForecast from './components/WeeklyForecast';
import HourlyForecast from './components/HourlyForecast';

const API_KEY = 'e4ba4b05eee9251d041f4745a2222fce';
const API_BASE_URL = 'https://api.openweathermap.org/data/2.5';

function App() {
  const [city, setCity] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchWeatherData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${API_BASE_URL}/weather?q=${city}&units=metric&appid=${API_KEY}`);
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

  const fetchForecastData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${API_BASE_URL}/forecast?q=${city}&units=metric&appid=${API_KEY}`);
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
      fetchWeatherData();
      fetchForecastData();
    }
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
          
          {error && (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-8 rounded" role="alert">
              <p className="font-bold">Error</p>
              <p>{error}</p>
            </div>
          )}

          {weatherData && <CurrentWeather data={weatherData} />}
          {weatherData && <Highlights data={weatherData} />}
          {forecast && <WeeklyForecast data={forecast} />}
          {forecast && <HourlyForecast data={forecast} />}
        </div>
      </div>
    </div>
  );
}

export default App;