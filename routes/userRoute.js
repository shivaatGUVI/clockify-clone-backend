// routes/user.js

const express = require("express");
const router = express.Router();
const User = require('../models/userModel');

// Route to create a new user
router.post("/users", async (req, res) => {
  const { name, email, password, role } = req.body;
  
  // Check if the user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ message: "User already exists." });
  }

  // Create a new user
  const newUser = new User({ name, email, password, role });

  try {
    await newUser.save();
    res.status(201).json({ message: "User created successfully", user: newUser });
  } catch (error) {
    res.status(400).json({ message: "Error creating user", error });
  }
});

module.exports = router;
