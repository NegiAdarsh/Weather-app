import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CurrentWeather from './CurrentWeather'; // Make sure this import is correct
import './Profile.css';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [newCity, setNewCity] = useState('');
  const [homeCity, setHomeCity] = useState(''); // State for home city
  const [unit, setUnit] = useState('metric'); // Default to Celsius
  const [isEditing, setIsEditing] = useState(false); // State for edit mode
  const navigate = useNavigate();
  const apiKey = 'e4ba4b05eee9251d041f4745a2222fce'; // Your OpenWeather API key
  const [weatherData, setWeatherData] = useState([]);
  

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/users/profile', {
          headers: {
            'x-auth-token': localStorage.getItem('token')
          }
        });

        if (response.ok) {
          const data = await response.json();
          setUser(data.user);
          setHomeCity(data.user.home_city || ''); // Set the home city
          await fetchWeatherData(data.user.searched_locations, unit); // Fetch weather data for searched locations
        } else {
          const errorData = await response.json();
          setError(errorData.msg);
          navigate('/login');
        }
      } catch (error) {
        console.error('Profile fetch error:', error);
        setError('An error occurred while fetching the profile.');
        navigate('/login');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate, unit]);

  const fetchWeatherData = async (cities, unit) => {
    if (cities.length > 0) {
      const promises = cities.map((city) =>
        fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=${unit}&appid=${apiKey}`)
          .then((res) => res.json())
      );
      const weatherResponses = await Promise.all(promises);
      setWeatherData(weatherResponses);
    }
  };

  const addCity = async () => {
    if (!newCity) return;

    try {
      const response = await fetch('http://localhost:3001/api/users/addCity', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': localStorage.getItem('token')
        },
        body: JSON.stringify({ city: newCity })
      });

      if (response.ok) {
        const updatedUser = await response.json();
        setUser(updatedUser.user);
        setNewCity('');
        await fetchWeatherData([...user.searched_locations, newCity], unit); // Fetch weather data for the new city
      } else {
        const errorData = await response.json();
        setError(errorData.msg);
      }
    } catch (error) {
      console.error('Error adding city:', error);
      setError('An error occurred while adding the city.');
    }
  };


  const updateHomeCity = async () => {
    if (!homeCity) return;

    try {
      const response = await fetch('http://localhost:3001/api/users/updateHomeCity', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': localStorage.getItem('token')
        },
        body: JSON.stringify({ homeCity })
      });

      if (response.ok) {
        const updatedUser = await response.json();
        setUser(updatedUser.user);
        setIsEditing(false);
      } else {
        const errorData = await response.json();
        setError(errorData.msg);
      }
    } catch (error) {
      console.error('Error updating home city:', error);
      setError('An error occurred while updating the home city.');
    }
  };

  const removeCity = async (city) => {
    try {
      const response = await fetch('http://localhost:3001/api/users/removeCity', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': localStorage.getItem('token')
        },
        body: JSON.stringify({ city })
      });

      if (response.ok) {
        const updatedUser = await response.json();
        setUser(updatedUser.user);
        await fetchWeatherData(updatedUser.user.searched_locations, unit); // Fetch weather data for remaining cities
      } else {
        const errorData = await response.json();
        setError(errorData.msg);
      }
    } catch (error) {
      console.error('Error removing city:', error);
      setError('An error occurred while removing the city.');
    }
  };

  const toggleUnit = (newUnit) => {
    setUnit(newUnit); // Set the new unit
    fetchWeatherData(user.searched_locations, newUnit); // Fetch weather data for searched locations
  };


  if (loading) {
    return <div className="loading">Loading profile...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="profile-container">
      <h2>User Profile</h2>
      {user ? (
        <div className="profile-details">
          <div className="profile-item">
            <strong>Username:</strong> <span>{user.username}</span>
          </div>
          <div className="profile-item">
            <strong>Email:</strong> <span>{user.email}</span>
          </div>
          <div className="profile-item">
  <strong>Home City:</strong>
  {isEditing ? (
    <div className="home-city-edit">
      <input
        type="text"
        value={homeCity}
        onChange={(e) => setHomeCity(e.target.value)}
        placeholder="Enter your home city"
        className="home-city-input"
      />
      <button onClick={updateHomeCity} className="button save-button">Save</button>
      <button onClick={() => setIsEditing(false)} className="button cancel-button">Cancel</button>
    </div>
  ) : (
    <div className="home-city-display">
      <span>{homeCity || 'Not set'}</span>
      <button 
        onClick={() => {
          setIsEditing(true);
          setHomeCity(homeCity || '');
        }} 
        className="button edit-button"
      >
        Edit
      </button>
    </div>
  )}
</div>


          <div className="profile-section">
            <h3>Weather Alerts</h3>
            {user.weather_alerts && user.weather_alerts.length > 0 ? (
              <ul className="alert-list">
                {user.weather_alerts.map((alert, index) => (
                  <li key={index}>
                    <strong>{alert.location}:</strong> {alert.alert_type} (Threshold: {alert.threshold_value})
                  </li>
                ))}
              </ul>
            ) : (
              <p>No weather alerts set</p>
            )}
          </div>

          <div className="profile-section">
            <h3>Recently Searched Locations</h3>
            <div className="add-city">
              <input
                type="text"
                value={newCity}
                onChange={(e) => setNewCity(e.target.value)}
                placeholder="Add a new city"
                className="city-input"
              />
              <button onClick={addCity} className="add-city-button">Add City</button>
            </div>
            {user.searched_locations && user.searched_locations.length > 0 ? (
              <ul className="location-list">
                {user.searched_locations.map((location, index) => (
                  <li key={index} className="location-item">
                    {location}
                    <button onClick={() => removeCity(location)} className="remove-city-button">Remove</button>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No recent searches</p>
            )}
          </div>

          <div className="unit-toggle">
            <span>Select Unit:</span>
            <div className="bubble-container">
              <button
                className={`suggestion-bubble ${unit === 'metric' ? 'active' : ''}`}
                onClick={() => toggleUnit('metric')} // Set unit to metric (Celsius)
              >
                Celsius
              </button>
              <button
                className={`suggestion-bubble ${unit === 'standard' ? 'active' : ''}`}
                onClick={() => toggleUnit('standard')} // Set unit to standard (Kelvin)
              >
                Kelvin
              </button>
            </div>
          </div>

          <div className="weather-data-section">
  {weatherData.length > 0 && (
    <div className="weather-data">
      <h3>Weather Data</h3>
      {weatherData.map((data, index) => (
        data && data.main ? ( // Check if data and data.main are valid
          <CurrentWeather key={index} data={data} unit={unit} />
        ) : (
          <div key={index}>Error fetching weather data for this location.</div>
        )
      ))}
    </div>
  )}
</div>

        </div>
      ) : (
        <p>User data not available.</p>
      )}
    </div>
  );
};

export default Profile;
