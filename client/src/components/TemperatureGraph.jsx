import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';

const TemperatureGraph = ({ violations }) => {
  const [groupedData, setGroupedData] = useState({});

  useEffect(() => {
    // Group violations by location (city) and alert type
    const grouped = violations.reduce((acc, violation) => {
      const { location, alertType } = violation;

      // Initialize the location object if it doesn't exist
      if (!acc[location]) {
        acc[location] = { temp: [], wind: [] }; // Ensure temp and wind are arrays
      }

      // Push violations into the appropriate array
      if (alertType === 'temp_above' || alertType === 'temp_below') {
        acc[location].temp.push(violation);
      } else if (alertType === 'wind_speed_above') {
        acc[location].wind.push(violation);
      }

      return acc;
    }, {});

    setGroupedData(grouped);
  }, [violations]);

  const renderTemperatureGraphs = (tempViolations) => {
    const labels = tempViolations.map(violation => 
      new Date(violation.timestamp).toLocaleString()
    );

    const thresholdValues = tempViolations.map(violation => violation.thresholdValue);
    const recordedTemperatures = tempViolations.map(violation => violation.recordedTemperature);

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

    return <Line data={data} />;
  };

  const renderWindGraph = (windViolations) => {
    const labels = windViolations.map(violation => 
      new Date(violation.timestamp).toLocaleString()
    );

    const thresholdValues = windViolations.map(violation => violation.thresholdValue);
    const recordedWindSpeeds = windViolations.map(violation => violation.recordedWindSpeed);

    const data = {
      labels,
      datasets: [
        {
          label: 'Threshold Wind Speed (m/s)',
          data: thresholdValues,
          borderColor: 'orange',
          backgroundColor: 'rgba(255, 159, 64, 0.2)',
          fill: false,
          tension: 0.1,
        },
        {
          label: 'Recorded Wind Speed (m/s)',
          data: recordedWindSpeeds,
          borderColor: 'green',
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          fill: false,
          tension: 0.1,
        }
      ]
    };

    return <Line data={data} />;
  };

  const renderGraphs = () => {
    return Object.keys(groupedData).map((location) => {
      const cityData = groupedData[location];
      const tempViolations = cityData.temp || [];
      const windViolations = cityData.wind || [];

      return (
        <div key={location} style={{ marginBottom: '40px' }}>
          <h3 className="text-xl font-bold mb-4">{location} Temperature Violations</h3>
          {tempViolations.length > 0 ? renderTemperatureGraphs(tempViolations) : <p>No temperature violations</p>}
          
          {windViolations.length > 0 && (
            <>
              <h3 className="text-xl font-bold mt-6 mb-4">{location} Wind Speed Violations</h3>
              {renderWindGraph(windViolations)}
            </>
          )}
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
