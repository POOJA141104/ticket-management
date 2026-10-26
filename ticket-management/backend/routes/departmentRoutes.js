const express = require("express");
const router = express.Router();
const { protect, isSuperAdmin } = require("../middleware/auth");
const { getDepartments, createDepartment, updateDepartment, deleteDepartment } = require("../controllers/masterController");

router.route("/")
  .get(getDepartments)
  .post(protect, isSuperAdmin, createDepartment);

router.route("/:id")
  .put(protect, isSuperAdmin, updateDepartment)
  .delete(protect, isSuperAdmin, deleteDepartment);

module.exports = router;
