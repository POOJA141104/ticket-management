const Complaint = require("../models/Complaint");
const User = require("../models/User");

const STAFF_ROLES = ["Networking Staff", "Plumber", "Electrician", "Software Developer"];

const populateFields = [
  { path: "block",      select: "name" },
  { path: "room",       select: "number" },
  { path: "department", select: "name shortName" },
  { path: "programme",  select: "name shortName" },
  { path: "raisedBy",   select: "name email role", populate: { path: "role", select: "name" } },
  { path: "assignedTo", select: "name email role", populate: { path: "role", select: "name" } },
];

// GET complaints - role-based filtering
const getComplaints = async (req, res) => {
  try {
    const roleName = req.user.role.name;
    let query = {};

    if (roleName === "SuperAdmin") {
      // See all complaints, optional dept filter
      if (req.query.department) query.department = req.query.department;
    } else if (STAFF_ROLES.includes(roleName)) {
      // Staff sees only their assigned complaints
      query.assignedTo = req.user._id;
    } else {
      // Regular users see only their own complaints
      query.raisedBy = req.user._id;
    }

    if (req.query.status) query.status = req.query.status;
    if (req.query.type)   query.type   = req.query.type;

    const complaints = await Complaint.find(query)
      .populate(populateFields)
      .sort({ createdAt: -1 });

    res.json({ success: true, count: complaints.length, data: complaints });
  } catch (error) { res.status(500).json({ success: false, message: error.message }); }
};

// GET dashboard stats
const getDashboardStats = async (req, res) => {
  try {
    const roleName = req.user.role.name;
    let matchQuery = {};

    if (roleName === "SuperAdmin") { /* all */ }
    else if (STAFF_ROLES.includes(roleName)) matchQuery.assignedTo = req.user._id;
    else matchQuery.raisedBy = req.user._id;

    const [total, pending, assigned, inProgress, onHold, completed] = await Promise.all([
      Complaint.countDocuments(matchQuery),
      Complaint.countDocuments({ ...matchQuery, status: "Pending" }),
      Complaint.countDocuments({ ...matchQuery, status: "Assigned" }),
      Complaint.countDocuments({ ...matchQuery, status: "In-Progress" }),
      Complaint.countDocuments({ ...matchQuery, status: "On-Hold" }),
      Complaint.countDocuments({ ...matchQuery, status: "Completed" }),
    ]);

    res.json({ success: true, data: { total, pending, assigned, inProgress, onHold, completed } });
  } catch (error) { res.status(500).json({ success: false, message: error.message }); }
};

// GET single complaint
const getComplaintById = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id).populate(populateFields);
    if (!complaint) return res.status(404).json({ success: false, message: "Complaint not found" });
    res.json({ success: true, data: complaint });
  } catch (error) { res.status(500).json({ success: false, message: error.message }); }
};

// CREATE complaint - User & SuperAdmin only
const createComplaint = async (req, res) => {
  try {
    const roleName = req.user.role.name;
    if (STAFF_ROLES.includes(roleName))
      return res.status(403).json({ success: false, message: "Staff cannot raise complaints" });

    const complaintData = {
      ...req.body,
      raisedBy:   req.user._id,
      department: req.user.department?._id || req.body.department,
      programme:  req.user.programme?._id  || req.body.programme,
      attachment: req.file ? req.file.filename : null,
      statusHistory: [{ status: "Pending", changedBy: req.user._id, note: "Complaint raised" }],
    };

    const complaint = await Complaint.create(complaintData);
    await complaint.populate(populateFields);
    res.status(201).json({ success: true, data: complaint });
  } catch (error) { res.status(400).json({ success: false, message: error.message }); }
};

// ASSIGN complaint - SuperAdmin only
const assignComplaint = async (req, res) => {
  try {
    const { assignedTo } = req.body;
    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) return res.status(404).json({ success: false, message: "Complaint not found" });
    if (complaint.status === "Completed")
      return res.status(400).json({ success: false, message: "Cannot reassign a completed complaint" });

    complaint.assignedTo = assignedTo;
    complaint.status = "Assigned";
    complaint.statusHistory.push({ status: "Assigned", changedBy: req.user._id, note: `Assigned by ${req.user.name}` });
    await complaint.save();
    await complaint.populate(populateFields);
    res.json({ success: true, data: complaint });
  } catch (error) { res.status(400).json({ success: false, message: error.message }); }
};

// UPDATE status - Staff only
const updateStatus = async (req, res) => {
  try {
    const roleName = req.user.role.name;
    if (!STAFF_ROLES.includes(roleName))
      return res.status(403).json({ success: false, message: "Only assigned staff can update status" });

    const { status, note } = req.body;
    const allowed = ["In-Progress", "On-Hold", "Completed"];
    if (!allowed.includes(status))
      return res.status(400).json({ success: false, message: `Status must be one of: ${allowed.join(", ")}` });

    const complaint = await Complaint.findOne({ _id: req.params.id, assignedTo: req.user._id });
    if (!complaint) return res.status(404).json({ success: false, message: "Complaint not found or not assigned to you" });

    complaint.status = status;
    complaint.statusHistory.push({ status, changedBy: req.user._id, note: note || `Status updated to ${status}` });
    await complaint.save();
    await complaint.populate(populateFields);
    res.json({ success: true, data: complaint });
  } catch (error) { res.status(400).json({ success: false, message: error.message }); }
};

module.exports = { getComplaints, getDashboardStats, getComplaintById, createComplaint, assignComplaint, updateStatus };
