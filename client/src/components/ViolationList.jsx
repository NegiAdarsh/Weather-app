import React, { useEffect, useState } from 'react';
import TemperatureGraph from './TemperatureGraph';

const ViolationItem = ({ violation }) => (
  <div className="border border-gray-300 rounded p-4 mb-4">
    <h3 className="text-lg font-bold mb-2">Violation</h3>
    <div>Location: {violation.location}</div>
    <div>Alert Type: {violation.alertType}</div>
    <div>Threshold Value: {violation.thresholdValue}</div>
    <div>Recorded Temperature: {violation.recordedTemperature} °C</div>
    <div>Recorded Wind Speed: {violation.recordedWindSpeed} m/s</div>
    <div>Timestamp: {new Date(violation.timestamp).toLocaleString()}</div>
  </div>
);

const ViolationList = () => {
  const [violations, setViolations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchViolations = async () => {
      const token = localStorage.getItem('token');
      console.log('Token:', token); // Check token here
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
          const errorData = await response.json(); // Get error response
          console.error('Fetch error:', errorData); // Log error
          throw new Error(errorData.msg || 'Failed to fetch violations');
        }
  
        const data = await response.json();
        setViolations(data);
      } catch (err) {
        setError('An error occurred while fetching your violations. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
  
    fetchViolations();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
        <strong className="font-bold">Error:</strong> {error}
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Violation History </h2>
      {violations.length === 0 ? (
        <div>No violations recorded.</div>
      ) : (
        violations.map((violation) => (
          <ViolationItem key={violation._id} violation={violation} />
        ))
      )}
      {/* <TemperatureGraph/> */}
      <TemperatureGraph violations={violations} />

    </div>
  );
};

export default ViolationList;
