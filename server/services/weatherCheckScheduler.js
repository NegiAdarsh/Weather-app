// weatherCheckScheduler.js
const cron = require('node-cron');
const { User, Violation } = require('../models/User');
const { getWeatherData } = require('./weatherChecker'); 

// Function to check the weather and record violations
const checkWeatherAlerts = async () => {
    try {
        const users = await User.find(); // Fetch all users

        for (const user of users) {
            for (const alert of user.weather_alerts) {
                const weatherData = await getWeatherData(alert.location);
               
          
                const temperature  = weatherData.main.temp;
                const windSpeed = weatherData.wind.speed;
                 // troubleshooting for data
                // console.log(weatherData);
                // console.log(temperature);
                // console.log(windSpeed);
                
                

                if (weatherData) {
                    // const { temperature, windSpeed } = weatherData;
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

// Schedule the cron job to run every 10 minutes
cron.schedule('*/10 * * * *', checkWeatherAlerts);

console.log('Weather alert scheduler started...');
