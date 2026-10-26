const User = require("../models/User");

const populate = "role department programme";

// GET all users - SuperAdmin only
const getUsers = async (req, res) => {
  try {
    const users = await User.find().populate(populate).select("-password").sort("name");
    res.json({ success: true, data: users });
  } catch (error) { res.status(500).json({ success: false, message: error.message }); }
};

// GET single user
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).populate(populate).select("-password");
    if (!user) return res.status(404).json({ success: false, message: "User not found" });
    res.json({ success: true, data: user });
  } catch (error) { res.status(500).json({ success: false, message: error.message }); }
};

// CREATE user - SuperAdmin only
const createUser = async (req, res) => {
  try {
    const existing = await User.findOne({ $or: [{ email: req.body.email }, { username: req.body.username }] });
    if (existing) return res.status(400).json({ success: false, message: "Username or email already exists" });
    const user = await User.create(req.body);
    await user.populate(populate);
    const userObj = user.toObject();
    delete userObj.password;
    res.status(201).json({ success: true, data: userObj });
  } catch (error) { res.status(400).json({ success: false, message: error.message }); }
};

// UPDATE user - SuperAdmin only
const updateUser = async (req, res) => {
  try {
    if (req.body.password) {
      const bcrypt = require("bcryptjs");
      req.body.password = await bcrypt.hash(req.body.password, 10);
    }
    const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
      .populate(populate).select("-password");
    if (!user) return res.status(404).json({ success: false, message: "User not found" });
    res.json({ success: true, data: user });
  } catch (error) { res.status(400).json({ success: false, message: error.message }); }
};

// DELETE user - SuperAdmin only
const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });
    res.json({ success: true, message: "User deleted" });
  } catch (error) { res.status(500).json({ success: false, message: error.message }); }
};

// GET staff users (for assignment dropdown)
const getStaffUsers = async (req, res) => {
  try {
    const staffRoles = ["Networking Staff", "Plumber", "Electrician", "Software Developer"];
    const Role = require("../models/Role");
    const roles = await Role.find({ name: { $in: staffRoles } });
    const roleIds = roles.map(r => r._id);
    const users = await User.find({ role: { $in: roleIds } }).populate("role", "name").select("-password");
    res.json({ success: true, data: users });
  } catch (error) { res.status(500).json({ success: false, message: error.message }); }
};

module.exports = { getUsers, getUserById, createUser, updateUser, deleteUser, getStaffUsers };
