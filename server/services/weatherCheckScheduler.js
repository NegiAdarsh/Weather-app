const cron = require('node-cron');
const { User, Violation, WeatherData } = require('../models/User');
const { getWeatherData } = require('./weatherChecker');

// Variable to track the last run date for daily weather recording
let lastRunDate = null;

// Function to check the weather and record violations
const checkWeatherAlerts = async () => {
    try {
        const users = await User.find(); // Fetch all users

        for (const user of users) {
            for (const alert of user.weather_alerts) {
                const weatherData = await getWeatherData(alert.location);

                const temperature = weatherData.main.temp;
                const windSpeed = weatherData.wind.speed;

                if (weatherData) {
                    let conditionMet = false;

                    switch (alert.alert_type) {
                        case 'temp_above':
                            if (temperature > alert.threshold_value) conditionMet = true;
                            break;
                        case 'temp_below':
                            if (temperature < alert.threshold_value) conditionMet = true;
                            break;
                        case 'wind_speed_above':
                            if (windSpeed > alert.threshold_value) conditionMet = true;
                            break;
                    }

                    if (conditionMet) {
                        const newViolation = new Violation({
                            userId: user._id,
                            location: alert.location,
                            alertType: alert.alert_type,
                            thresholdValue: alert.threshold_value,
                            recordedTemperature: temperature,
                            recordedWindSpeed: windSpeed,
                        });

                        await newViolation.save(); // Save the violation to the database
                        console.log(`Violation recorded for user: ${user.username} at ${alert.location}`);
                    }
                }
            }
        }
    } catch (error) {
        console.error('Error checking weather conditions:', error);
    }
};

// Function to record daily weather data for all searched locations
const recordDailyWeather = async () => {
    const today = new Date().toISOString().split('T')[0]; // Get current date in YYYY-MM-DD format

    if (lastRunDate === today) {
        console.log('Weather data for today has already been recorded. Skipping...');
        return; // Exit if today’s data has already been recorded
    }

    lastRunDate = today; // Update the last run date

    try {
        const users = await User.find(); // Fetch all users

        for (const user of users) {
            for (const city of user.searched_locations) {
                const weatherData = await getWeatherData(city);

                if (weatherData) {
                    const weatherEntry = new WeatherData({
                        userId: user._id,
                        location: city,
                        averageTemperature: weatherData.main.temp,
                        maximumTemperature: weatherData.main.temp_max,
                        minimumTemperature: weatherData.main.temp_min,
                        dominantCondition: weatherData.weather[0].main,
                        iconUrl: `http://openweathermap.org/img/wn/${weatherData.weather[0].icon}.png`,
                        averageHumidity: weatherData.main.humidity, // Add humidity
                        averageWindSpeed: weatherData.wind.speed, // Add wind speed
                        timestamp: new Date(), // Store the timestamp for the entry
                    });

                    await weatherEntry.save(); // Save the weather data to the database
                    console.log(`Weather data recorded for ${city} for user: ${user.username}`);
                }
            }
        }
    } catch (error) {
        console.error('Error recording daily weather data:', error);
    }
};


// Schedule the cron job to check weather alerts every 10 minutes
cron.schedule('*/10 * * * *', checkWeatherAlerts);

// Run the daily weather recording function when the application starts
recordDailyWeather(); // This will only record data if run for the first time today

console.log('Weather alert and daily weather recording scheduler started...');
