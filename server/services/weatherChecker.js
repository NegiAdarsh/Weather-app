// services/weatherChecker.js

// Function to check weather data
const getWeatherData = async (location) => {
    console.log(`fetching weather for city ${location}`);

    try {
        const apiKey = process.env.WEATHER_API_KEY;
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${apiKey}&units=metric`);

        if (!response.ok) {
            throw new Error(`Error fetching weather data: ${response.statusText}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching weather data:', error);
        throw new Error('Unable to fetch weather data');
    }
};

// Export the function for use in other parts of the application
module.exports = {
    getWeatherData,
};
