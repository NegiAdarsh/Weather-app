import React from 'react';
import clearSkyDay from '../images/weather/clear_sky_day.png';
import clearSkyNight from '../images/weather/clear_sky_night.png';
import cloudyDay from '../images/weather/cloudy_sky_day.png';
import cloudyNight from '../images/weather/cloud_sky_night.png';
import rain from '../images/weather/rain_day.png';
import snow from '../images/weather/snow.png';
import cloud from '../images/weather/cloud.png';

// A component that takes weather description and icon to render the appropriate image
const WeatherImage = ({ description, icon }) => {
  // Mapping of weather conditions to images
  const weatherImages = {
    'clear sky day': clearSkyDay,
    'clear sky night': clearSkyNight,
    'clouds day': cloudyDay,
    'clouds night': cloudyNight,
    'cloud' : cloud,
    'rain': rain,
    'snow': snow,
  };

  // Determine if it's day or night
  const timeOfDay = icon.endsWith('d') ? 'day' : 'night';
  
  // Create the key for matching with weatherImages
  let weatherKey;
  if (description.includes('rain')) {
    weatherKey = 'rain';
  } else if (description.includes('snow')) {
    weatherKey = 'snow';
  } 
  else if(description.includes('clouds') && (!description.includes('day') || !description.includes('night')))
    {
        weatherKey ='cloud';
    }
  else {
    weatherKey = `${description.toLowerCase()} ${timeOfDay}`;
  }

  // Fetch the image or fallback to OpenWeather default image
  const imageUrl = weatherImages[weatherKey] || `http://openweathermap.org/img/wn/${icon}@2x.png`;

  return (
    <img
      src={imageUrl}
      alt={weatherKey}
      className="w-16 h-16"
    />
  );
};

export default WeatherImage;
