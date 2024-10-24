import React, { useEffect, useState } from 'react';
import './WeatherStats.css';

const WeatherStats = () => {
  const [weatherData, setWeatherData] = useState({});

  useEffect(() => {
    const token = localStorage.getItem('token');
    const fetchWeatherStats = async () => {
      try {
        const response = await fetch(`http://localhost:3001/api/users/stats`, {
          method: 'GET',
          headers: {
            'x-auth-token': token,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch weather stats');
        }

        const data = await response.json();

        // Group by city and date
        const groupedData = {};
        data.forEach((entry) => {
          const city = entry.location;
          const date = new Date(entry.timestamp).toDateString(); // Use timestamp to get the full date

          if (!groupedData[city]) {
            groupedData[city] = {};
          }

          if (!groupedData[city][date]) {
            groupedData[city][date] = entry;
          }
        });

        setWeatherData(groupedData);
      } catch (error) {
        console.error('Error fetching weather stats:', error);
      }
    };

    fetchWeatherStats();
  }, []);

  return (
    <div className="weather-container"> {/* Updated class name */}
      {Object.entries(weatherData).map(([city, dates]) => (
        <div className="weather-city-section" key={city}> {/* Updated class name */}
          <h2 className="weather-city-title">{city}</h2> {/* Updated class name */}
          {Object.entries(dates).map(([date, details]) => (
            <div className="weather-info-card" key={date}> {/* Updated class name */}
              <p className="weather-detail-info">Date: {new Date(date).toLocaleDateString()}</p> {/* Updated class name */}
              <p className="weather-detail-info">Avg Temperature: {details.averageTemperature} °C</p> {/* Updated class name */}
              <p className="weather-detail-info">Max Temperature: {details.maximumTemperature} °C</p> {/* Updated class name */}
              <p className="weather-detail-info">Min Temperature: {details.minimumTemperature} °C</p> {/* Updated class name */}
              <p className="weather-detail-info">Condition: {details.dominantCondition}</p> {/* Updated class name */}
              
              {/* Display Weather Icon */}
              {details.iconUrl && (
                <img 
                  src={details.iconUrl} 
                  alt="Weather Icon" 
                  className="weather-icon-img" // Updated class name
                />
              )}
              
              {/* Display Time */}
              <p className="weather-detail-info">Last updated at: {new Date(details.timestamp).toLocaleTimeString()}</p> {/* Updated class name */}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default WeatherStats;
