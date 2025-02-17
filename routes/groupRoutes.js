const express = require("express");
const {UserModel} = require("../models/user.model")
const Group = require("../models/groupModel");

const router = express.Router();

// Create a new group
router.post("/group/create", async (req, res) => {
  const { name } = req.body;

  // Check if group name already exists
  const existingGroup = await Group.findOne({ name });
  if (existingGroup) {
    return res.status(400).json({ message: "Group with this name already exists." });
  }

  try {
    const newGroup = new Group({ name });
    await newGroup.save();
    res.status(201).json({ message: "Group created successfully.", group: newGroup });
  } catch (error) {
    res.status(500).json({ message: "Error creating group.", error: error.message });
  }
});

// Get all groups
router.get("/groups", async (req, res) => {
  try {
    const groups = await Group.find();
    res.status(200).json(groups);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
});


// Get members of a group
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

// // Add a user to a group
// router.post("/group/addmembers/:groupId", async (req, res) => {
//   const { groupId } = req.params;
//   const { userId } = req.body;

//   try {
//     const group = await Group.findById(groupId);
//     if (!group) {
//       return res.status(404).json({ message: "Group not found." });
//     }

//     const user = await UserModel.findById(userId);
//     if (!user) {
//       return res.status(404).json({ message: "User not found." });
//     }

//     if (group.members.includes(userId)) {
//       return res.status(400).json({ message: "User is already in this group." });
//     }

//     group.members.push(userId);
//     await group.save();

//     user.group = group._id;
//     await user.save();

//     res.status(201).json({ message: "User added to the group successfully." });
//   } catch (error) {
//     res.status(500).json({ message: "Internal Server Error", error: error.message });
//   }
// });


// Update a group

// router.post("/group/addmembers/:groupId", async (req, res) => {
//   const { groupId } = req.params;
//   const { userId } = req.body;

//   try {
//     const user = await User.findById(userId);
//     if (!user) {
//       return res.status(404).json({ message: "User not found." });
//     }

//     const newGroup = await Group.findById(groupId);
//     if (!newGroup) {
//       return res.status(404).json({ message: "Group not found." });
//     }

//     const oldGroup = await Group.findById(user.group);

//     // Remove user from the old group if they had one
//     if (oldGroup) {
//       oldGroup.members = oldGroup.members.filter(id => id.toString() !== userId);
//       await oldGroup.save();
//     }

//     // Check if user is already in the new group
//     if (newGroup.members.includes(userId)) {
//       return res.status(400).json({ message: "User is already in this group." });
//     }

//     // Add user to the new group
//     newGroup.members.push(userId);
//     await newGroup.save();

//     // Update the user's group reference
//     user.group = newGroup._id;
//     await user.save();

//     res.status(201).json({ message: "User added to the group successfully." });
//   } catch (error) {
//     res.status(500).json({ message: "Internal Server Error", error: error.message });
//   }
// });

// router.post("/group/addmembers/:groupId", async (req, res) => {
//   const { groupId } = req.params;
//   const { userId } = req.body;

//   try {
//     const user = await User.findById(userId);
//     if (!user) {
//       return res.status(404).json({ message: "User not found." });
//     }

//     const newGroup = await Group.findById(groupId);
//     if (!newGroup) {
//       return res.status(404).json({ message: "Group not found." });
//     }

//     const oldGroup = await Group.findOne({ members: userId });

//     // Remove user from old group
//     if (oldGroup) {
//       oldGroup.members = oldGroup.members.filter(id => id.toString() !== userId);
//       await oldGroup.save();
//     }

//     // Check if the user is already in the new group
//     if (newGroup.members.includes(userId)) {
//       return res.status(400).json({ message: "User is already in this group." });
//     }

//     // Add user to the new group
//     newGroup.members.push(userId);
//     await newGroup.save();

//     // Update user record with new group
//     user.group = groupId;
//     await user.save();

//     res.status(200).json({ message: "User added to the group successfully." });
//   } catch (error) {
//     console.error("Error adding user to group:", error);
//     res.status(500).json({ message: "Internal server error." });
//   }
// });

router.post("/group/addmembers", async (req, res) => {
  const { userId, groupId } = req.body;

  if (!userId || !groupId) {
    return res.status(400).json({ message: "User ID and Group ID are required." });
  }

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    const newGroup = await Group.findById(groupId);
    if (!newGroup) {
      return res.status(404).json({ message: "Group not found." });
    }

    // Find the old group where the user exists
    const oldGroup = await Group.findOne({ members: userId });

    // Remove user from old group if exists
    if (oldGroup) {
      oldGroup.members = oldGroup.members.filter(id => id.toString() !== userId);
      await oldGroup.save();
    }

    // Check if user is already in the new group
    if (newGroup.members.includes(userId)) {
      return res.status(400).json({ message: "User is already in this group." });
    }

    // Add user to the new group
    newGroup.members.push(userId);
    await newGroup.save();

    // Update the user's group field
    user.group = groupId;
    await user.save();

    res.status(200).json({ message: "User added to the group successfully." });
  } catch (error) {
    console.error("Error adding user to group:", error);
    res.status(500).json({ message: "Internal server error." });
  }
});


// Remove a user from a group
router.delete("/group/removemembers/:groupId/:userId", async (req, res) => {
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

    const user = await User.findById(userId);
    if (user) {
      user.group = null; // Remove group reference from user
      await user.save();
    }

    res.status(200).json({ message: "User removed from the group successfully." });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
});

module.exports = router;
