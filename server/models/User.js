const mongoose = require('mongoose');

// Violation Schema
const ViolationSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    location: { type: String, required: true },
    alertType: { type: String, required: true },
    thresholdValue: { type: Number, required: true },
    recordedTemperature: { type: Number, required: true },
    recordedWindSpeed: { type: Number, required: true },
    timestamp: { type: Date, default: Date.now },
});

// User Schema
const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    home_city: String,
    weather_alerts: [{
        location: { type: String, required: true },
        threshold_value: Number,
        alert_type: { 
            type: String,
            enum: ['temp_above', 'temp_below', 'wind_speed_above'],
            required: true 
        },
        remark: { type: String },
    }],
    searched_locations: [String],
    violations: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Violation' }],
});

const WeatherDataSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Reference to the User
    location: { type: String, required: true }, // Location name
    averageTemperature: { type: Number, required: true }, // Average temperature
    maximumTemperature: { type: Number, required: true }, // Maximum temperature
    minimumTemperature: { type: Number, required: true }, // Minimum temperature
    dominantCondition: { type: String, required: true }, // Dominant weather condition
    iconUrl: { type: String, required: true }, // URL for the weather icon
    averageHumidity: { type: Number, required: true }, // New field for average humidity
    averageWindSpeed: { type: Number, required: true }, // New field for average wind speed
    timestamp: { type: Date, default: Date.now }, // Timestamp of the weather entry
});

// Creating Models
const User = mongoose.model('User', UserSchema);
const Violation = mongoose.model('Violation', ViolationSchema);
const WeatherData = mongoose.model('WeatherData', WeatherDataSchema);

// Exporting Models
module.exports = { User, Violation, WeatherData };
