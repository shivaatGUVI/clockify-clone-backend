const express = require("express");
const checkAdmin = require("../middleware/checkAdmin");
const Group = require("../models/groupModel");

const router = express.Router();

// Route to create a new group
router.post("/group", async (req, res) => {
  const { name, description } = req.body;

  // Check if group name already exists
  const existingGroup = await Group.findOne({ name });
  if (existingGroup) {
    return res.status(400).json({ message: "Group with this name already exists." });
  }

  // Create new group
  const newGroup = new Group({
    name,
    description,
  });

  try {
    await newGroup.save();
    res.status(201).json({ message: "Group created successfully." });
  } catch (error) {
    res.status(500).json({ message: "Error creating group.", error });
  }
});

// Add user to group (Only admin can add users to groups)
router.post("/group/:groupId/members", checkAdmin, async (req, res) => {
  const { groupId } = req.params;
  const { userId, user } = req.body;  // Expect the user info and userId in the body

  try {
    // Check if the group exists
    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    // Check if the user already exists in the group
    const existingMember = group.members.includes(userId);
    if (existingMember) {
      return res.status(400).json({ message: "User is already a member of the group." });
    }

    // Add the user to the group's members
    group.members.push(userId);
    await group.save();

    res.status(200).json({ message: "User added to the group successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
