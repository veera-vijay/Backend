const jwt = require("jsonwebtoken");

// JWT Secret from .env file
const JWT_SECRET = process.env.JWT_SECRET || "myFallbackSecretKey123!@#";

// Generate Token
const generateToken = (user) => {
  const payload = {
    id: user._id,
    username: user.username,
    email: user.email,
     role: user.role 
  };

  const token = jwt.sign(
    payload, // payload
    JWT_SECRET, // secret key
    { expiresIn: "7d" }, // expires in 7 days
  );

  return token;
};

// Verify Token (Middleware)
const verifyToken = (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Access denied. No token provided.",
    });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // Attach user info to request
    next();
  } catch (error) {
    return res.status(403).json({
      success: false,
      message: "Invalid or expired token.",
    });
  }
};

module.exports = {
  generateToken,
  verifyToken,
};
