const Department = require("../models/Department");
const Programme  = require("../models/Programme");
const Block      = require("../models/Block");
const Room       = require("../models/Room");
const Role       = require("../models/Role");

// ─── DEPARTMENT ───────────────────────────────────────────────────────────────
const getDepartments = async (req, res) => {
  try {
    const departments = await Department.find().sort("name");
    res.json({ success: true, data: departments });
  } catch (error) { res.status(500).json({ success: false, message: error.message }); }
};

const createDepartment = async (req, res) => {
  try {
    const dept = await Department.create(req.body);
    res.status(201).json({ success: true, data: dept });
  } catch (error) { res.status(400).json({ success: false, message: error.message }); }
};

const updateDepartment = async (req, res) => {
  try {
    const dept = await Department.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!dept) return res.status(404).json({ success: false, message: "Department not found" });
    res.json({ success: true, data: dept });
  } catch (error) { res.status(400).json({ success: false, message: error.message }); }
};

const deleteDepartment = async (req, res) => {
  try {
    const dept = await Department.findByIdAndDelete(req.params.id);
    if (!dept) return res.status(404).json({ success: false, message: "Department not found" });
    res.json({ success: true, message: "Department deleted" });
  } catch (error) { res.status(500).json({ success: false, message: error.message }); }
};

// ─── PROGRAMME ────────────────────────────────────────────────────────────────
const getProgrammes = async (req, res) => {
  try {
    const query = req.query.department ? { department: req.query.department } : {};
    const programmes = await Programme.find(query).populate("department", "name shortName").sort("name");
    res.json({ success: true, data: programmes });
  } catch (error) { res.status(500).json({ success: false, message: error.message }); }
};

const createProgramme = async (req, res) => {
  try {
    const prog = await Programme.create(req.body);
    await prog.populate("department", "name shortName");
    res.status(201).json({ success: true, data: prog });
  } catch (error) { res.status(400).json({ success: false, message: error.message }); }
};

const updateProgramme = async (req, res) => {
  try {
    const prog = await Programme.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true }).populate("department", "name shortName");
    if (!prog) return res.status(404).json({ success: false, message: "Programme not found" });
    res.json({ success: true, data: prog });
  } catch (error) { res.status(400).json({ success: false, message: error.message }); }
};

const deleteProgramme = async (req, res) => {
  try {
    const prog = await Programme.findByIdAndDelete(req.params.id);
    if (!prog) return res.status(404).json({ success: false, message: "Programme not found" });
    res.json({ success: true, message: "Programme deleted" });
  } catch (error) { res.status(500).json({ success: false, message: error.message }); }
};

// ─── BLOCK ────────────────────────────────────────────────────────────────────
const getBlocks = async (req, res) => {
  try {
    const query = {};
    if (req.query.department) query.department = req.query.department;
    if (req.query.programme)  query.programme  = req.query.programme;
    const blocks = await Block.find(query).populate("department", "name shortName").populate("programme", "name shortName").sort("name");
    res.json({ success: true, data: blocks });
  } catch (error) { res.status(500).json({ success: false, message: error.message }); }
};

const createBlock = async (req, res) => {
  try {
    const block = await Block.create(req.body);
    await block.populate("department", "name shortName");
    await block.populate("programme", "name shortName");
    res.status(201).json({ success: true, data: block });
  } catch (error) { res.status(400).json({ success: false, message: error.message }); }
};

const updateBlock = async (req, res) => {
  try {
    const block = await Block.findByIdAndUpdate(req.params.id, req.body, { new: true }).populate("department", "name shortName").populate("programme", "name shortName");
    if (!block) return res.status(404).json({ success: false, message: "Block not found" });
    res.json({ success: true, data: block });
  } catch (error) { res.status(400).json({ success: false, message: error.message }); }
};

const deleteBlock = async (req, res) => {
  try {
    const block = await Block.findByIdAndDelete(req.params.id);
    if (!block) return res.status(404).json({ success: false, message: "Block not found" });
    res.json({ success: true, message: "Block deleted" });
  } catch (error) { res.status(500).json({ success: false, message: error.message }); }
};

// ─── ROOM ─────────────────────────────────────────────────────────────────────
const getRooms = async (req, res) => {
  try {
    const query = {};
    if (req.query.block) query.block = req.query.block;
    if (req.query.department) query.department = req.query.department;
    const rooms = await Room.find(query).populate("department", "name shortName").populate("programme", "name shortName").populate("block", "name").sort("number");
    res.json({ success: true, data: rooms });
  } catch (error) { res.status(500).json({ success: false, message: error.message }); }
};

const createRoom = async (req, res) => {
  try {
    const room = await Room.create(req.body);
    await room.populate("block", "name");
    res.status(201).json({ success: true, data: room });
  } catch (error) { res.status(400).json({ success: false, message: error.message }); }
};

const updateRoom = async (req, res) => {
  try {
    const room = await Room.findByIdAndUpdate(req.params.id, req.body, { new: true }).populate("block", "name");
    if (!room) return res.status(404).json({ success: false, message: "Room not found" });
    res.json({ success: true, data: room });
  } catch (error) { res.status(400).json({ success: false, message: error.message }); }
};

const deleteRoom = async (req, res) => {
  try {
    const room = await Room.findByIdAndDelete(req.params.id);
    if (!room) return res.status(404).json({ success: false, message: "Room not found" });
    res.json({ success: true, message: "Room deleted" });
  } catch (error) { res.status(500).json({ success: false, message: error.message }); }
};

// ─── ROLE ─────────────────────────────────────────────────────────────────────
const getRoles = async (req, res) => {
  try {
    const roles = await Role.find().sort("name");
    res.json({ success: true, data: roles });
  } catch (error) { res.status(500).json({ success: false, message: error.message }); }
};

const createRole = async (req, res) => {
  try {
    const role = await Role.create(req.body);
    res.status(201).json({ success: true, data: role });
  } catch (error) { res.status(400).json({ success: false, message: error.message }); }
};

const updateRole = async (req, res) => {
  try {
    const role = await Role.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!role) return res.status(404).json({ success: false, message: "Role not found" });
    res.json({ success: true, data: role });
  } catch (error) { res.status(400).json({ success: false, message: error.message }); }
};

const deleteRole = async (req, res) => {
  try {
    const role = await Role.findByIdAndDelete(req.params.id);
    if (!role) return res.status(404).json({ success: false, message: "Role not found" });
    res.json({ success: true, message: "Role deleted" });
  } catch (error) { res.status(500).json({ success: false, message: error.message }); }
};

module.exports = {
  getDepartments, createDepartment, updateDepartment, deleteDepartment,
  getProgrammes,  createProgramme,  updateProgramme,  deleteProgramme,
  getBlocks,      createBlock,      updateBlock,      deleteBlock,
  getRooms,       createRoom,       updateRoom,       deleteRoom,
  getRoles,       createRole,       updateRole,       deleteRole,
};
