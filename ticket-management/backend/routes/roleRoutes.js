const express = require("express");
const r = express.Router();
const { protect, isSuperAdmin } = require("../middleware/auth");
const { getRoles, createRole, updateRole, deleteRole } = require("../controllers/masterController");

// Allow GET /roles without token blocking, keep mutations strictly protected for SuperAdmin
r.route("/")
  .get(getRoles)
  .post(protect, isSuperAdmin, createRole);

r.route("/:id")
  .put(protect, isSuperAdmin, updateRole)
  .delete(protect, isSuperAdmin, deleteRole);

module.exports = r;
