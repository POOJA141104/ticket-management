const express = require("express");
const r = express.Router();
const { protect, isSuperAdmin } = require("../middleware/auth");
const { getBlocks, createBlock, updateBlock, deleteBlock } = require("../controllers/masterController");

router = r;
router.route("/")
  .get(getBlocks)
  .post(protect, isSuperAdmin, createBlock);

router.route("/:id")
  .put(protect, isSuperAdmin, updateBlock)
  .delete(protect, isSuperAdmin, deleteBlock);

module.exports = router;
