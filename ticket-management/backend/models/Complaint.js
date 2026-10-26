const mongoose = require("mongoose");

const COMPLAINT_TYPES = ["PC Hardware", "PC Software", "Application Issues", "Network", "Electronics", "Plumbing", "Electrician", "Other"];
const STATUSES = ["Pending", "Assigned", "In-Progress", "On-Hold", "Completed"];

const complaintSchema = new mongoose.Schema(
  {
    ticketId:   { type: String, unique: true },
    block:      { type: mongoose.Schema.Types.ObjectId, ref: "Block", required: true },
    room:       { type: mongoose.Schema.Types.ObjectId, ref: "Room", required: true },
    type:       { type: String, enum: COMPLAINT_TYPES, required: true },
    remarks:    { type: String, required: true, trim: true },
    attachment: { type: String, default: null },
    status:     { type: String, enum: STATUSES, default: "Pending" },
    raisedBy:   { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    department: { type: mongoose.Schema.Types.ObjectId, ref: "Department", required: true },
    programme:  { type: mongoose.Schema.Types.ObjectId, ref: "Programme" },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    statusHistory: [
      {
        status:    { type: String },
        changedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        changedAt: { type: Date, default: Date.now },
        note:      { type: String },
      },
    ],
  },
  { timestamps: true }
);

// Auto-generate ticket ID before saving
complaintSchema.pre("save", async function (next) {
  if (!this.ticketId) {
    const count = await this.constructor.countDocuments();
    this.ticketId = `TKT-${String(count + 1001).padStart(4, "0")}`;
  }
  next();
});

module.exports = mongoose.model("Complaint", complaintSchema);
