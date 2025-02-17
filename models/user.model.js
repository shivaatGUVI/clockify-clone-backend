const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: false, // optional field
    },
    googleId: {
      type: String,
      required: false, // optional field
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    group:{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Group",
      required: false, 
    }
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields automatically
  }
);

const UserModel = mongoose.model("User", userSchema);

module.exports = { UserModel };
