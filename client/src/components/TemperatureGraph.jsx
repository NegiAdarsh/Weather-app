import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';

const TemperatureGraph = ({ violations }) => {
  const [groupedData, setGroupedData] = useState({});

  useEffect(() => {
    // Group violations by location (city)
    const grouped = violations.reduce((acc, violation) => {
      if (!acc[violation.location]) {
        acc[violation.location] = [];
      }
      acc[violation.location].push(violation);
      return acc;
    }, {});
    setGroupedData(grouped);
  }, [violations]);

  const renderGraphs = () => {
    return Object.keys(groupedData).map((location) => {
      const cityViolations = groupedData[location];

      const labels = cityViolations.map(violation =>
        new Date(violation.timestamp).toLocaleString()
      );

      const thresholdValues = cityViolations.map(violation => violation.thresholdValue);
      const recordedTemperatures = cityViolations.map(violation => violation.recordedTemperature);

      const data = {
        labels,
        datasets: [
          {
            label: 'Threshold Temperature (°C)',
            data: thresholdValues,
            borderColor: 'red',
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            fill: false,
            tension: 0.1,
          },
          {
            label: 'Recorded Temperature (°C)',
            data: recordedTemperatures,
            borderColor: 'blue',
            backgroundColor: 'rgba(54, 162, 235, 0.2)',
            fill: false,
            tension: 0.1,
          }
        ]
      };

      return (
        <div key={location} style={{ marginBottom: '40px' }}>
          <h3 className="text-xl font-bold mb-4">{location} Temperature Violations</h3>
          <Line data={data} />
        </div>
      );
    });
  };

  return (
    <div>
      {Object.keys(groupedData).length === 0 ? (
        <div>No temperature violations to display.</div>
      ) : (
        renderGraphs()
      )}
    </div>
  );
};

export default TemperatureGraph;
