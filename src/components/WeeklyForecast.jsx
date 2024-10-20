import React from 'react';

const WeeklyForecast = ({ data }) => {
  const dailyData = data.list.filter((item, index) => index % 8 === 0).slice(0, 7);

  return (
    <div className="bg-white rounded-3xl p-8 mb-8 shadow-lg">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">7-Day Forecast</h2>
      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-4">
        {dailyData.map((day, index) => (
          <div key={index} className="bg-gray-100 rounded-2xl p-4 flex flex-col items-center">
            <p className="font-semibold text-gray-700 mb-2">
              {new Date(day.dt * 1000).toLocaleDateString([], { weekday: 'short' })}
            </p>
            <img
              src={`http://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`}
              alt={day.weather[0].description}
              className="w-16 h-16"
            />
            <p className="text-xl font-bold text-gray-800 mt-2">{Math.round(day.main.temp)}°C</p>
            <p className="text-sm text-gray-600">{day.weather[0].main}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WeeklyForecast;