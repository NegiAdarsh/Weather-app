import React, { useEffect, useState } from 'react';
import TemperatureGraph from './TemperatureGraph';

const ViolationItem = ({ violation }) => (
  <div className="border border-gray-300 rounded p-4 mb-2 shadow-md bg-white">
    <h3 className="text-lg font-bold mb-2">Violation</h3>
    <div><strong>Location:</strong> {violation.location}</div>
    <div><strong>Alert Type:</strong> {violation.alertType}</div>
    <div><strong>Threshold Value:</strong> {violation.thresholdValue}</div>
    <div><strong>Recorded Temperature:</strong> {violation.recordedTemperature} °C</div>
    <div><strong>Recorded Wind Speed:</strong> {violation.recordedWindSpeed} m/s</div>
    <div><strong>Timestamp:</strong> {new Date(violation.timestamp).toLocaleString()}</div>
  </div>
);

const CityCard = ({ city, violations }) => (
  <div className="border border-blue-300 rounded-lg p-4 mb-6 shadow-lg bg-blue-50">
    <h2 className="text-xl font-semibold mb-3">{city}</h2>
    {violations.map(violation => (
      <ViolationItem key={violation._id} violation={violation} />
    ))}
  </div>
);

const ViolationList = () => {
  const [violations, setViolations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchViolations = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('You need to log in to see violations.');
        setLoading(false);
        return;
      }
  
      try {
        const response = await fetch('http://localhost:3001/api/users/violations', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'x-auth-token': token,
          },
        });
  
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.msg || 'Failed to fetch violations');
        }
  
        const data = await response.json();
        setViolations(data);
      } catch (err) {
        setError('An error occurred while fetching your violations. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
  
    fetchViolations();
  }, []);

  if (loading) return <div className="text-center">Loading...</div>;
  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
        <strong className="font-bold">Error:</strong> {error}
      </div>
    );
  }

  // Group violations by city
  const violationsByCity = violations.reduce((acc, violation) => {
    const city = violation.location;
    if (!acc[city]) {
      acc[city] = [];
    }
    acc[city].push(violation);
    return acc;
  }, {});

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Violation History</h2>
      {Object.keys(violationsByCity).length === 0 ? (
        <div>No violations recorded.</div>
      ) : (
        Object.keys(violationsByCity).map(city => (
          <CityCard key={city} city={city} violations={violationsByCity[city]} />
        ))
      )}
      <TemperatureGraph violations={violations} />
    </div>
  );
};

export default ViolationList;
