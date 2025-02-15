const express = require("express");
const checkAdmin = require("../middleware/checkAdmin");
const User = require("../models/userModel");
const Group = require("../models/groupModel");

const router = express.Router();

// Route to create a new group
router.post("/group/create", async (req, res) => {
  const { name, description } = req.body;

  // Check if group name already exists
  const existingGroup = await Group.findOne({ name });
  if (existingGroup) {
    return res
      .status(400)
      .json({ message: "Group with this name already exists." });
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

// Get All the group
router.get("/groups", async (req, res) => {
  try {
    const groups = await Group.find();
    res.status(200).json(groups);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
});

// Get Members of a group
router.get("/group/members/:groupId", async (req, res) => {
  const { groupId } = req.params;

  try {
    const group = await Group.findById(groupId).populate("members", "name email");
    if (!group) {
      return res.status(404).json({ message: "Group not found." });
    }

    res.status(200).json({ groupName: group.name, members: group.members });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
});

// Admin adds a user to a group
// router.post("/group/addmembers/:groupId", checkAdmin, async (req, res) => {
  router.post("/group/addmembers/:groupId", async (req, res) => {
  const { groupId } = req.params;
  const { userId } = req.body;

  try {
    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ message: "Group not found." });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    if (group.members.includes(userId)) {
      return res.status(400).json({ message: "User is already in this group." });
    }

    group.members.push(userId);
    await group.save();

    // Add the user to the group
    user.group = group._id;
    await user.save();

    res.status(201).json({ message: "User added to the group successfully." });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
});

// Admin removes user from the group
router.delete("/group/removemembers/:groupId/:userId", checkAdmin, async (req, res) => {
  const { groupId, userId } = req.params;

  try {
    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ message: "Group not found." });
    }

    if (!group.members.includes(userId)) {
      return res.status(400).json({ message: "User is not in this group." });
    }

    group.members = group.members.filter((id) => id.toString() !== userId);
    await group.save();

    res.status(200).json({ message: "User removed from the group successfully." });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
});

module.exports = router;
