const express = require("express");
const router = express.Router();
const { protect, isSuperAdmin } = require("../middleware/auth");
const { getProgrammes, createProgramme, updateProgramme, deleteProgramme } = require("../controllers/masterController");

router.route("/")
  .get(getProgrammes)
  .post(protect, isSuperAdmin, createProgramme);

router.route("/:id")
  .put(protect, isSuperAdmin, updateProgramme)
  .delete(protect, isSuperAdmin, deleteProgramme);

module.exports = router;
