import React, { useEffect, useState } from 'react';
import clearSkyDay from '../videos/weather/clear_sky_day.mp4';
import clearSkyNight from '../videos/weather/clear_sky_night.mp4';
import cloudyDay from '../videos/weather/cloudy_sky_day.mp4';
import cloudyNight from '../videos/weather/cloudy_sky_night.mp4';
import rain from '../videos/weather/rain.mp4';
import snow from '../videos/weather/snow.mp4';
import haze from '../videos/weather/haze.mp4'

const BackgroundVideo = ({ weatherCondition, icon }) => {
  const [videoSrc, setVideoSrc] = useState('');

  useEffect(() => {
    const getVideoSource = () => {
      const timeOfDay = icon.endsWith('d') ? 'day' : 'night';
      const condition = weatherCondition.toLowerCase();

      if (condition.includes('rain')) {
        return rain;
      } else if (condition.includes('snow')) {
        return snow;
      } else if (condition.includes('clouds') || condition.includes('overcast')) {
        return timeOfDay === 'day' ? cloudyDay : cloudyNight;
      } 
      else if(condition.includes('haze') || condition.includes('mist'))
        {
          return haze;
        }
      else {
        return timeOfDay === 'day' ? clearSkyDay : clearSkyNight;
      }
    };

    setVideoSrc(getVideoSource());
  }, [weatherCondition, icon]);

  return (
    <video
      key={videoSrc} // Add this to force re-render when source changes
      autoPlay
      loop
      muted
      className="background-video"
    >
      <source src={videoSrc} type="video/mp4" />
      Your browser does not support the video tag.
    </video>
  );
};

export default BackgroundVideo;