const express = require("express");
const r = express.Router();
const { protect, isSuperAdmin } = require("../middleware/auth");
const { getRooms, createRoom, updateRoom, deleteRoom } = require("../controllers/masterController");

r.route("/")
  .get(getRooms)
  .post(protect, isSuperAdmin, createRoom);

r.route("/:id")
  .put(protect, isSuperAdmin, updateRoom)
  .delete(protect, isSuperAdmin, deleteRoom);

module.exports = r;
