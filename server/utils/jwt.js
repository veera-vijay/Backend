const jwt = require("jsonwebtoken");

// JWT Secret from .env file
const JWT_SECRET = process.env.JWT_SECRET || "myFallbackSecretKey123!@#";

// Generate Token
const generateToken = (user) => {
  const payload = {
    id: user._id,
    username: user.username,
    email: user.email,
     role: user.role ,
       timestamp: Date.now() 
  };
  
  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "1d" });

 const decoded = jwt.decode(token);
  const now = Date.now();
  const expiresAt = decoded.exp * 1000;
  
  console.log("\n🔐 TOKEN CREATED:");
  console.log("   Created:", new Date(decoded.timestamp).toLocaleTimeString());
  console.log("   Expires:", new Date(expiresAt).toLocaleTimeString());
  console.log("   Duration:", (expiresAt - decoded.timestamp) / 1000, "seconds");
  console.log("   Current time:", new Date(now).toLocaleTimeString());
  
  if (expiresAt < now) {
    console.log("   ⚠️ WARNING: Token already expired!");
  } else {
    console.log("   ✅ Token valid for", (expiresAt - now) / 1000, "more seconds");
  }
  console.log("");

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
