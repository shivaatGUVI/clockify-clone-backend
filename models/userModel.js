const mongoose = require("mongoose");


const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,  // In practice, hash passwords
  role: { type: String, enum: ["admin", "user"], default: "user" },
});

const User = mongoose.model("User", userSchema);
module.exports = User;
