const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
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

module.exports = router;
