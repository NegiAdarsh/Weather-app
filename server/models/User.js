const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  home_city: String,
  weather_alerts: [{
    location: { type: String, required: true }, // Specific location for the alert
    threshold_value: Number, // Threshold for temperature or wind speed
    alert_type: { 
      type: String,
      enum: ['temp_above', 'temp_below', 'wind_speed_above'], // Define specific alert types
      required: true 
    },
    remark: { type: String }, // Optional remark for each alert
  }],
  searched_locations: [String] // Store searched locations
});

module.exports = mongoose.model('User', UserSchema);
