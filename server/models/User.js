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

// Weather Data Schema
const WeatherDataSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    location: { type: String, required: true },
    averageTemperature: { type: Number },
    maximumTemperature: { type: Number },
    minimumTemperature: { type: Number },
    dominantCondition: { type: String },
    iconUrl: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
});

// Creating Models
const User = mongoose.model('User', UserSchema);
const Violation = mongoose.model('Violation', ViolationSchema);
const WeatherData = mongoose.model('WeatherData', WeatherDataSchema);

// Exporting Models
module.exports = { User, Violation, WeatherData };
