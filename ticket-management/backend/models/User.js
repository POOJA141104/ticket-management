const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name:       { type: String, required: true, trim: true },
    username:   { type: String, required: true, unique: true, trim: true, lowercase: true },
    email:      { type: String, required: true, unique: true, trim: true, lowercase: true },
    phone:      { type: String, required: true },
    password:   { type: String, required: true },
    role:       { type: mongoose.Schema.Types.ObjectId, ref: "Role", required: true },
    department: { type: mongoose.Schema.Types.ObjectId, ref: "Department" },
    programme:  { type: mongoose.Schema.Types.ObjectId, ref: "Programme" },
    isActive:   { type: Boolean, default: true },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", userSchema);
