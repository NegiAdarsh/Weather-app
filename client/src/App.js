import React, { useState, useEffect, useCallback } from 'react';
import { Search } from 'lucide-react';
import CurrentWeather from './components/CurrentWeather';
import Highlights from './components/Highlights';
import WeeklyForecast from './components/WeeklyForecast';
import HourlyForecast from './components/HourlyForecast';
import BackgroundVideo from './components/BackgroundVideo';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'; // Use Routes instead of Switch for v6
import Login from './components/Login';
import Register from './components/Register';
import Profile from './components/Profile';
import './App.css';
import Navbar from './components/Navbar';
import WeatherAlerts from './components/WeatherAlert';

const API_KEY = 'e4ba4b05eee9251d041f4745a2222fce';
const API_BASE_URL = 'https://api.openweathermap.org/data/2.5';

const suggestedCities = ['Delhi', 'Mumbai', 'Chennai', 'Bangalore', 'Kolkata', 'Hyderabad'];

function App() {
  const [searchInput, setSearchInput] = useState(''); // State for search input
  const [activeCity, setActiveCity] = useState(''); // State for the active city
  const [weatherData, setWeatherData] = useState(null); // State for current weather data
  const [forecast, setForecast] = useState(null); // State for forecast data
  const [loading, setLoading] = useState(false); // State for loading status
  const [error, setError] = useState(null); // State for error messages
  const [unit, setUnit] = useState('metric'); // State for temperature unit
  const [intervalId, setIntervalId] = useState(null); // State for managing interval

  // Fetch weather and forecast data for the given city and unit
  const fetchWeatherData = useCallback(async (cityName, tempUnit) => {
    if (!cityName) return;

    setLoading(true);
    setError(null);

    try {
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

      setWeatherData(weather); // Set weather data
      setForecast(forecast); // Set forecast data
      setActiveCity(cityName); // Set the active city
    } catch (err) {
      setError(err.message); // Set error message if request fails
    } finally {
      setLoading(false); // Stop loading indicator
    }
  }, []);

  // Change the temperature unit and fetch weather data for the active city
  const handleUnitChange = useCallback((newUnit) => {
    setUnit(newUnit); // Update unit state
    if (activeCity) {
      fetchWeatherData(activeCity, newUnit); // Refetch data with new unit
    }
  }, [activeCity, fetchWeatherData]);

  // Function to handle city search and selection
  const handleCitySelect = useCallback((cityName) => {
    if (cityName.trim()) {
      setSearchInput(cityName); // Update search input state
      fetchWeatherData(cityName, unit); // Fetch data for the selected city

      if (intervalId) {
        clearInterval(intervalId);
      }

      const id = setInterval(() => {
        fetchWeatherData(cityName, unit); // Fetch data automatically every 5 minutes
      }, 300000);
      
      setIntervalId(id); // Store the interval ID
    }
  }, [unit, fetchWeatherData, intervalId]);

  // Handle form submission for city search
  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent page reload
    handleCitySelect(searchInput); // Trigger city selection based on input
  };

  // Handle suggested city clicks
  const handleSuggestionClick = (suggestedCity) => {
    handleCitySelect(suggestedCity); // Trigger city selection when a suggested city is clicked
  };

  // Clean up interval when component unmounts
  useEffect(() => {
    return () => {
      if (intervalId) {
        clearInterval(intervalId); // Clear interval on unmount
      }
    };
  }, [intervalId]);

  return (
    <Router>
      <div className="app-container">
        <Navbar/>
        {weatherData && (
          <BackgroundVideo
            weatherCondition={weatherData.weather[0].description}
            icon={weatherData.weather[0].icon}
          />
        )}
        
        <div className="content-container">
          <Routes>
            <Route
              path="/"
              element={(
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
              )}
            />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/profile" element={<Profile />} />
            <Route path='/weather-alerts' element={<WeatherAlerts/>} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}  


export default App;
