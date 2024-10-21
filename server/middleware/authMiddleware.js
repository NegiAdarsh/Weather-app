const jwt = require('jsonwebtoken');

/**
 * Auth Middleware to protect routes.
 * This middleware verifies the JWT token provided in the request header.
 */
const authMiddleware = (req, res, next) => {
  // Get token from the request header
  const token = req.header('x-auth-token');

  // Check if there is no token
  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach the user information (user ID) to the request object
    req.user = decoded.id;  // Ensure this matches how the token is signed

    // Proceed to the next middleware or route handler
    next();
  } catch (err) {
    // Handle token expiration or invalid token errors
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ msg: 'Token has expired, please log in again.' });
    }

    if (err.name === 'JsonWebTokenError') {
      return res.status(401).json({ msg: 'Invalid token, authorization denied.' });
    }

    // Log the error and return a specific server error message
    console.error('JWT error:', err.message);
    res.status(500).json({ msg: 'Server error during token validation' });
  }
};

module.exports = authMiddleware;
