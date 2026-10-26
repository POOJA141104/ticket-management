const express = require("express");
const router = express.Router();
const { protect, isSuperAdmin } = require("../middleware/auth");
const upload = require("../middleware/upload");
const {
  getComplaints, getDashboardStats, getComplaintById,
  createComplaint, assignComplaint, updateStatus,
} = require("../controllers/complaintController");

router.use(protect);
router.get("/dashboard", getDashboardStats);
router.route("/").get(getComplaints).post(upload.single("attachment"), createComplaint);
router.get("/:id", getComplaintById);
router.put("/:id/assign",  isSuperAdmin, assignComplaint);
router.put("/:id/status",  updateStatus);

module.exports = router;
