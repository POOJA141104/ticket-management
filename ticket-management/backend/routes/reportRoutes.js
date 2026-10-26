const express = require("express");
const router = express.Router();
const { protect, isSuperAdmin } = require("../middleware/auth");
const { generateReport } = require("../controllers/reportController");

router.use(protect, isSuperAdmin);
router.get("/complaints", generateReport);

module.exports = router;
