const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  home_city: String,
  weather_alerts: [{
    location: String,
    threshold_value: Number, // Can be optional, depending on the alert type
    alert_type: { 
      type: String,
      enum: ['temperature', 'cold', 'raining', 'wind'], // Restrict to specific alert types
      required: true 
    },
  }],
  searched_locations: [String]
});

module.exports = mongoose.model('User', UserSchema);