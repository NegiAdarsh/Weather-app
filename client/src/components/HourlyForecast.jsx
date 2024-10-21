import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const HourlyForecast = ({ data }) => {
  const hourlyData = data.list.slice(0, 8).map(item => ({
    time: new Date(item.dt * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    temperature: Math.round(item.main.temp),
    description: item.weather[0].description,
    icon: item.weather[0].icon
  }));

  return (
    <div className="bg-white rounded-3xl p-8 shadow-lg">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">24-Hour Forecast</h2>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={hourlyData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
          <XAxis dataKey="time" stroke="#718096" />
          <YAxis stroke="#718096" />
          <Tooltip content={<CustomTooltip />} />
          <Line type="monotone" dataKey="temperature" stroke="#4299e1" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 8 }} />
        </LineChart>
      </ResponsiveContainer>
      <div className="mt-6 grid grid-cols-4 sm:grid-cols-8 gap-4">
        {hourlyData.map((item, index) => (
          <div key={index} className="flex flex-col items-center">
            <p className="text-sm text-gray-600">{item.time}</p>
            <img
              src={`http://openweathermap.org/img/wn/${item.icon}.png`}
              alt={item.description}
              className="w-8 h-8"
            />
            <p className="text-sm font-semibold text-gray-800">{item.temperature}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-gray-200 p-4 rounded shadow-md">
        <p className="font-semibold text-gray-800">{label}</p>
        <p className="text-blue-500">{`Temperature: ${payload[0].value}`}</p>
        <p className="text-gray-600">{payload[0].payload.description}</p>
      </div>
    );
  }
  return null;
};

export default HourlyForecast;