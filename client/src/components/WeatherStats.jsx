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
    <div className="weather-container">
      {Object.entries(weatherData).map(([city, dates]) => (
        <div className="weather-city-section" key={city}>
          <h2 className="weather-city-title">{city}</h2>
          {Object.entries(dates).map(([date, details]) => (
            <div className="weather-info-card" key={date}>
              <p className="weather-detail-info">Date: {new Date(date).toLocaleDateString()}</p>
              <p className="weather-detail-info">Avg Temperature: {details.averageTemperature} °C</p>
              <p className="weather-detail-info">Max Temperature: {details.maximumTemperature} °C</p>
              <p className="weather-detail-info">Min Temperature: {details.minimumTemperature} °C</p>
              <p className="weather-detail-info">Condition: {details.dominantCondition}</p>
              
              {/* Display Humidity */}
              <p className="weather-detail-info">Humidity: {details.averageHumidity} %</p> {/* Added Humidity */}
              
              {/* Display Wind Speed */}
              <p className="weather-detail-info">Wind Speed: {details.averageWindSpeed} m/s</p> {/* Added Wind Speed */}

              {/* Display Weather Icon */}
              {details.iconUrl && (
                <img 
                  src={details.iconUrl} 
                  alt="Weather Icon" 
                  className="weather-icon-img"
                />
              )}
              
              {/* Display Time */}
              <p className="weather-detail-info">Last updated at: {new Date(details.timestamp).toLocaleTimeString()}</p>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default WeatherStats;
