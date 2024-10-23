import React from 'react';
import { Sunrise, Sunset, Eye,ChartLine,  Wind, Gauge, ClockAlert, ArrowUp, ArrowDown } from 'lucide-react';

const Highlights = ({ data }) => {
  const formatTime = (timestamp) => {
    return new Date(timestamp * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  const time = new Date(data.dt * 1000).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
  
  const highlightItems = [
    { icon: <Wind size={24} />, title: 'Wind Speed', value: `${data.wind.speed} m/s` },
    { icon: <Gauge size={24} />, title: 'Pressure', value: `${data.main.pressure} hPa` },
    { icon: <Eye size={24} />, title: 'Visibility', value: `${data.visibility / 1000} km` },
    { icon: <Sunrise size={24} />, title: 'Sunrise', value: formatTime(data.sys.sunrise) },
    { icon: <Sunset size={24} />, title: 'Sunset', value: formatTime(data.sys.sunset) },
    { icon: <ArrowUp size={24} />, title: 'Max Temp', value: `${data.main.temp_max}` },
    { icon: <ArrowDown size={24} />, title: 'Min Temp', value: `${data.main.temp_min}` },
    { icon: <ClockAlert size={24} />, title: 'Last Updated', value: `${time}` },
    { icon: <ChartLine size ={24} />, title: 'Avg Temp', value: `${(data.main.temp_min + data.main.temp_max)/2}` },
    
  ];

  return (
    <div className="bg-white rounded-3xl p-8 mb-8 shadow-lg">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">Today's Highlights</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
        {highlightItems.map((item, index) => (
          <div key={index} className="bg-gray-100 rounded-2xl p-6 flex flex-col items-center justify-center">
            <div className="text-blue-500 mb-2">{item.icon}</div>
            <p className="text-gray-600 mb-1">{item.title}</p>
            <p className="text-2xl font-semibold text-gray-800">{item.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Highlights;