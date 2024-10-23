const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();
const router = require('./routes/users');
const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());



// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/users',router );

require('./services/weatherCheckScheduler');

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));