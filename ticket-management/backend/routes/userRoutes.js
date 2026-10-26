const express = require("express");
const router = express.Router();
const { protect, isSuperAdmin } = require("../middleware/auth");
const { getUsers, getUserById, createUser, updateUser, deleteUser, getStaffUsers } = require("../controllers/userController");

router.use(protect);
router.get("/staff", getStaffUsers);          // accessible to all authenticated (for assignment)
router.use(isSuperAdmin);
router.route("/").get(getUsers).post(createUser);
router.route("/:id").get(getUserById).put(updateUser).delete(deleteUser);

module.exports = router;
