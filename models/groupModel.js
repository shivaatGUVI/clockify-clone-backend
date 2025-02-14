const mongoose = require("mongoose");

const groupSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,  // Ensuring the name is always required
    unique: true,    // Ensures no two groups can have the same name
  },
  members: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",   // This will store references to User documents
  }],
}, { timestamps: true });  // Adds createdAt and updatedAt fields automatically

const Group = mongoose.model("Group", groupSchema);
module.exports = Group;
