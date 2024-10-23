import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './WeatherAlerts.css';
import ViolationList from './ViolationList';

const WeatherAlerts = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [weatherAlerts, setWeatherAlerts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [alertDetails, setAlertDetails] = useState({
        location: '',
        threshold_value: '',
        alert_type: 'temp_above', // Default alert type
        remark: ''
    });
    const [error, setError] = useState('');

    useEffect(() => {
        const token = localStorage.getItem('token');

        if (!token) {
            console.log('No token found, redirecting to login.');
            navigate('/login');
            return;
        }

        const parseJwt = (token) => {
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            return JSON.parse(window.atob(base64));
        };

        try {
            const decoded = parseJwt(token);
            const userId = decoded.id;

            const fetchUserDetails = async () => {
                try {
                    const response = await fetch(`http://localhost:3001/api/users/${userId}`, {
                        method: 'GET',
                        headers: {
                            'x-auth-token': token
                        }
                    });

                    if (!response.ok) {
                        throw new Error('Failed to fetch user details');
                    }

                    const userDetails = await response.json();
                    setUsername(userDetails.username);
                    setWeatherAlerts(userDetails.weather_alerts || []);
                } catch (error) {
                    console.error('Error fetching user details:', error);
                    navigate('/login');
                } finally {
                    setLoading(false);
                }
            };

            fetchUserDetails();
        } catch (error) {
            console.error('Failed to decode token:', error);
            navigate('/login');
        }
    }, [navigate]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setAlertDetails((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');

        try {
            const response = await fetch('http://localhost:3001/api/users/addAlert', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': token
                },
                body: JSON.stringify(alertDetails)
            });

            if (!response.ok) {
                throw new Error('Failed to add alert');
            }

            const updatedUser = await response.json();
            setWeatherAlerts(updatedUser.user.weather_alerts); // Update the weather alerts
            setAlertDetails({ location: '', threshold_value: '', alert_type: 'temp_above', remark: '' }); // Reset form
            setError(''); // Clear any previous error
        } catch (error) {
            console.error('Error adding alert:', error);
            setError('Could not add weather alert. Please try again.');
        }
    };

    const handleDelete = async (alertIndex) => {
        const token = localStorage.getItem('token');
        const alertToDelete = weatherAlerts[alertIndex];

        try {
            const response = await fetch(`http://localhost:3001/api/users/deleteAlert`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': token
                },
                body: JSON.stringify({ alertToDelete })
            });

            if (!response.ok) {
                throw new Error('Failed to delete alert');
            }

            const updatedUser = await response.json();
            setWeatherAlerts(updatedUser.user.weather_alerts); // Update the weather alerts
        } catch (error) {
            console.error('Error deleting alert:', error);
            setError('Could not delete weather alert. Please try again.');
        }
    };

    return (
        <div className="weather-alerts-container">
            <h2 className="welcome-message">{username ? `Welcome, ${username}!` : 'Loading user information...'}</h2>

            <div className="alerts-section">
                <h4>Your Weather Alerts:</h4>
                {loading ? (
                    <p>Loading weather alerts...</p>
                ) : weatherAlerts.length > 0 ? (
                    <div className="alerts-list">
                        {weatherAlerts.map((alert, index) => (
                            <div className="alert-card" key={index}>
                                <h5>{alert.location}</h5>
                                <p><strong>Threshold:</strong> {alert.threshold_value}</p>
                                <p><strong>Type:</strong> {alert.alert_type}</p>
                                {alert.remark && <p><strong>Remark:</strong> {alert.remark}</p>}
                                <button className="delete-button" onClick={() => handleDelete(index)}>Delete</button>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p>No weather updates found.</p>
                )}
            </div>

            <div className="add-alert-section">
                <h4>Add a New Weather Alert:</h4>
                <form onSubmit={handleSubmit} className="alert-form">
                    {error && <p className="error-message">{error}</p>}
                    <input
                        type="text"
                        name="location"
                        placeholder="Location"
                        value={alertDetails.location}
                        onChange={handleInputChange}
                        required
                    />
                    <input
                        type="number"
                        name="threshold_value"
                        placeholder="Threshold Number"
                        value={alertDetails.threshold_value}
                        onChange={handleInputChange}
                        required
                    />
                    <select
                        name="alert_type"
                        value={alertDetails.alert_type}
                        onChange={handleInputChange}
                        required
                    >
                        <option value="temp_above">Temperature Above</option>
                        <option value="temp_below">Temperature Below</option>
                        <option value="wind_speed_above">Wind Speed Above</option>
                    </select>
                    <input
                        type="text"
                        name="remark"
                        placeholder="Remark (optional)"
                        value={alertDetails.remark}
                        onChange={handleInputChange}
                    />
                    <button type="submit" className="add-alert-button">Add Alert</button>
                </form>
            </div>
            <ViolationList/>
        </div>
    );
};

export default WeatherAlerts;
