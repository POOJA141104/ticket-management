const jwt = require("jsonwebtoken");
const User = require("../models/User");

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE || "7d" });

// @route  POST /api/auth/login
// @access Public
const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password)
      return res.status(400).json({ success: false, message: "Please provide username and password" });

    const user = await User.findOne({ username: username.toLowerCase() })
      .populate("role", "name")
      .populate("department", "name shortName")
      .populate("programme", "name shortName");

    if (!user || !(await user.matchPassword(password)))
      return res.status(401).json({ success: false, message: "Invalid credentials" });

    if (!user.isActive)
      return res.status(403).json({ success: false, message: "Account is deactivated" });

    const token = generateToken(user._id);

    res.json({
      success: true,
      token,
      user: {
        _id: user._id,
        name: user.name,
        username: user.username,
        email: user.email,
        phone: user.phone,
        role: user.role,
        department: user.department,
        programme: user.programme,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @route  GET /api/auth/me
// @access Private
const getMe = async (req, res) => {
  res.json({ success: true, user: req.user });
};

// @route  PUT /api/auth/profile
// @access Private
const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    if (req.body.name) user.name = req.body.name.trim();
    if (req.body.phone) user.phone = req.body.phone.trim();
    if (req.body.email) user.email = req.body.email.trim().toLowerCase();
    if (req.body.password && req.body.password.trim()) {
      user.password = req.body.password;
    }

    await user.save();
    await user.populate("role department programme");

    const userObj = user.toObject();
    delete userObj.password;

    res.json({ success: true, data: userObj });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

module.exports = { login, getMe, updateProfile };
