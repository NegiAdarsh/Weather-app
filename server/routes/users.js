const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {User,Violation} = require('../models/User')
const router = express.Router();

// Middleware to verify token
const authMiddleware = (req, res, next) => {
  const token = req.header('x-auth-token');
  if (!token) {
    return res.status(401).json({ success: false, msg: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.id; // Attach user id to request
    next();
  } catch (err) {
    res.status(401).json({ success: false, msg: 'Token is not valid' });
  }
};



router.get('/violations', authMiddleware,async (req, res) => {
  // console.log(req.user.username);
  
  console.log("Fetching violations for user ID:", req.user); // Log user ID
    try {
        const violations = await Violation.find({ userId: req.user }); // Make sure this matches your model
        console.log("Violations found:", violations);
        res.json(violations);
    } catch (error) {
        console.error("Error fetching violations:", error);
        res.status(500).json({ error: 'Failed to fetch violations' });
    }
});




//post 
router.post('/violations', authMiddleware, async (req, res) => {
  try {
      const { location, alertType, thresholdValue, recordedTemperature, recordedWindSpeed } = req.body;

      // Create a new violation with the userId from the token
      const newViolation = new Violation({
          userId: req.user,  // req.user is set by the auth middleware
          location,
          alertType,
          thresholdValue,
          recordedTemperature,
          recordedWindSpeed,
          timestamp: new Date()  // Record the current timestamp
      });

      // Save the new violation to the database
      await newViolation.save();

      // Send the created violation back in the response
      res.status(201).json(newViolation);
  } catch (error) {
      console.error('Error saving violation:', error);
      res.status(500).json({ error: 'Failed to save violation' });
  }
});

// Register route
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ success: false, msg: 'User already exists' });

    user = new User({ username, email, password });
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    await user.save();

    res.status(201).json({ success: true, msg: 'User registered successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, msg: 'Server error' });
  }
});

// Login route
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ success: false, msg: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ success: false, msg: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ success: true, token, user: { id: user._id, username: user.username, email: user.email } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, msg: 'Server error' });
  }
});

// Profile route (fetch user profile)
router.get('/profile', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user).select('-password'); // Exclude the password field
    if (!user) return res.status(404).json({ success: false, msg: 'User not found' });
    // console.log(user);
    
    res.json({ success: true, user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, msg: 'Server error' });
  }
});

// Add a city to searched locations
router.post('/addCity', authMiddleware, async (req, res) => {
  try {
    const { city } = req.body;
    const user = await User.findById(req.user);

    if (!user) return res.status(404).json({ success: false, msg: 'User not found' });

    // Add city to searched_locations if it doesn't already exist
    if (!user.searched_locations.includes(city)) {
      user.searched_locations.push(city);
      await user.save();
    }

    res.json({ success: true, user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, msg: 'Server error' });
  }
});

// Remove a city from searched locations
router.delete('/removeCity', authMiddleware, async (req, res) => {
  try {
    const { city } = req.body;
    const user = await User.findById(req.user);
    if (!user) return res.status(404).json({ success: false, msg: 'User not found' });

    // Remove city from searched_locations
    user.searched_locations = user.searched_locations.filter((loc) => loc !== city);
    await user.save();

    res.json({ success: true, user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, msg: 'Server error' });
  }
});
router.put('/updateHomeCity', authMiddleware, async (req, res) => {
  try {
    const { homeCity } = req.body;
    if (!homeCity) {
      return res.status(400).json({ msg: 'Home city is required' });
    }
    // const user = await User.findById(req.user);

    const user = await User.findByIdAndUpdate(
      req.user,
      { $set: { home_city: homeCity } },
      { new: true }
    ).select('-password');
    if (!user) return res.status(404).json({ success: false, msg: 'User not found' });

    res.json({ user });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});



router.get('/weather-alerts', authMiddleware, async (req, res) => {
  try {
      const user = await User.findById(req.user.id);
      if (!user) return res.status(404).json({ error: 'User not found' });
      res.json({ alerts: user.weather_alerts });
  } catch (error) {
      res.status(500).json({ error: 'Failed to fetch weather alerts' });
  }
});

// Example route in Express
router.get('/:id', authMiddleware, async (req, res) => {
  try {
      const user = await User.findById(req.params.id); // Fetch user by ID from the database
    //   console.log("hello ");
      
      if (!user) return res.status(404).send('User not found');
      res.json(user); // Send the complete user object
  } catch (error) {
      res.status(500).send('Server Error');
  }
});


router.post('/addAlert', authMiddleware, async (req, res) => {
  console.log("Received request to add alert");
  
  const { location, threshold_value, alert_type, remark } = req.body;

  if (!location || !threshold_value || !alert_type) {
    return res.status(400).json({ msg: 'Please provide all required fields' });
  }

  try {
    // console.log(req.user);
    
    const userId = req.user;
    console.log(`Adding alert for user: ${userId}`);

    const alert = {
      location,
      threshold_value,
      alert_type,
      remark
    };

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $push: { weather_alerts: alert } },
      { new: true }
    );

    if (!updatedUser) {
      console.log(`User not found: ${userId}`);
      return res.status(404).json({ msg: 'User not found' });
    }

    console.log(`Alert added successfully for user: ${userId}`);
    res.json({ user: updatedUser });
  } catch (error) {
    console.error('Error adding alert:', error);
    res.status(500).json({ msg: 'Server error', error: error.message });
  }
});

router.delete('/deleteAlert', authMiddleware, async (req, res) => {
  const { alertToDelete } = req.body;

  if (!alertToDelete) {
      return res.status(400).json({ msg: 'No alert specified' });
  }

  try {
      const userId = req.user;
      const updatedUser = await User.findByIdAndUpdate(
          userId,
          { $pull: { weather_alerts: alertToDelete } },
          { new: true }
      );

      if (!updatedUser) {
          return res.status(404).json({ msg: 'User not found' });
      }

      res.json({ user: updatedUser });
  } catch (error) {
      console.error('Error deleting alert:', error);
      res.status(500).json({ msg: 'Server error', error: error.message });
  }
});



module.exports = router;
