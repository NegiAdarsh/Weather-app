// services/weatherChecker.js

const axios = require('axios');

// Function to check weather data
const getWeatherData = async (location) => {
    console.log(`fetching weather for city ${location}`);
    
    try {
        const apiKey = "e4ba4b05eee9251d041f4745a2222fce";
        // troubleshooting service 
        // console.log(`https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${apiKey}units=metric`);  
        const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${apiKey}&units=metric`);
      
        
        
        return response.data;
    } catch (error) {
        console.error('Error fetching weather data:', error);
        throw new Error('Unable to fetch weather data');
    }
};

// Export the function for use in other parts of the application
module.exports = {
    getWeatherData,
};
