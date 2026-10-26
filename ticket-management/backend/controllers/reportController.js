const Complaint = require("../models/Complaint");

// GET report - SuperAdmin only
const generateReport = async (req, res) => {
  try {
    const { department, programme, type, status, assignee } = req.query;
    const query = {};
    if (department) query.department = department;
    if (programme)  query.programme  = programme;
    if (type)       query.type       = type;
    if (status)     query.status     = status;
    if (assignee)   query.assignedTo = assignee;

    const complaints = await Complaint.find(query)
      .populate({ path: "block",      select: "name" })
      .populate({ path: "room",       select: "number" })
      .populate({ path: "department", select: "name shortName" })
      .populate({ path: "programme",  select: "name shortName" })
      .populate({ path: "raisedBy",   select: "name email", populate: { path: "role", select: "name" } })
      .populate({ path: "assignedTo", select: "name email", populate: { path: "role", select: "name" } })
      .sort({ createdAt: -1 });

    // Summary stats
    const summary = {
      total:      complaints.length,
      pending:    complaints.filter(c => c.status === "Pending").length,
      assigned:   complaints.filter(c => c.status === "Assigned").length,
      inProgress: complaints.filter(c => c.status === "In-Progress").length,
      onHold:     complaints.filter(c => c.status === "On-Hold").length,
      completed:  complaints.filter(c => c.status === "Completed").length,
    };

    res.json({ success: true, summary, data: complaints });
  } catch (error) { res.status(500).json({ success: false, message: error.message }); }
};

module.exports = { generateReport };
