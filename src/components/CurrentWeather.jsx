import React from 'react';
import { Cloud, Droplets, Wind } from 'lucide-react';
import WeatherImage from './WeatherImage';

const CurrentWeather = ({ data }) => {
  return (
    <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-3xl p-8 mb-8 shadow-lg">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-4xl font-bold mb-2">{data.name}</h2>
          <WeatherImage description={data.weather[0].description} icon={data.weather[0].icon} />
          <p className="text-xl">{data.weather[0].description}</p>
        </div>
        <div className="text-right">
          <p className="text-6xl font-bold">{Math.round(data.main.temp)}°C</p>
          <p className="text-xl">Feels like {Math.round(data.main.feels_like)}°C</p>
        </div>
      </div>
      <div className="mt-8 flex justify-between items-center">
        <div className="flex items-center">
          <Cloud size={24} className="mr-2" />
          <span>{data.clouds.all}% Clouds</span>
        </div>
        <div className="flex items-center">
          <Droplets size={24} className="mr-2" />
          <span>{data.main.humidity}% Humidity</span>
        </div>
        <div className="flex items-center">
          <Wind size={24} className="mr-2" />
          <span>{data.wind.speed} m/s Wind</span>
        </div>
      </div>
    </div>
  );
};

export default CurrentWeather;