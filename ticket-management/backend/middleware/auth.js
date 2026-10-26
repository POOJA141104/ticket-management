const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Verify JWT token
const protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  }
  if (!token) return res.status(401).json({ success: false, message: "Not authorized, no token" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).populate("role department programme").select("-password");
    if (!req.user) return res.status(401).json({ success: false, message: "User not found" });
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: "Token invalid or expired" });
  }
};

// Role-based access
const authorize = (...roles) => {
  return (req, res, next) => {
    const roleName = req.user?.role?.name || (typeof req.user?.role === "string" ? req.user.role : null);
    if (!roleName || !roles.includes(roleName)) {
      return res.status(403).json({ success: false, message: `Role '${roleName || "Unknown"}' is not authorized` });
    }
    next();
  };
};

const isSuperAdmin = authorize("SuperAdmin");

module.exports = { protect, authorize, isSuperAdmin };
