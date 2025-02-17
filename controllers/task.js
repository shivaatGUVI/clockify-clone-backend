const Task = require("../models/Task");

// Create a new task
const createTask = async (req, res) => {
  try {
    const { user, category, date, startTime, endTime, title } = req.body;

    const task = new Task({
      user,
      category,
      date,
      startTime,
      endTime,
      duration: endTime
        ? (new Date(endTime) - new Date(startTime)) / 1000
        : null,
      title,
    });

    await task.save();
    res.status(201).json({ success: true, message: "Task created", task });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get all tasks
const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find().populate("category");
    res.status(200).json({ success: true, tasks });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Update a task
const updateTask = async (req, res) => {
  try {
    const { category, date, startTime, endTime, title } = req.body;

    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      {
        category,
        date,
        startTime,
        endTime,
        duration: endTime
          ? (new Date(endTime) - new Date(startTime)) / 1000
          : null,
        title,
      },
      { new: true }
    );

    if (!updatedTask)
      return res
        .status(404)
        .json({ success: false, message: "Task not found" });

    res
      .status(200)
      .json({ success: true, message: "Task updated", updatedTask });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Delete a task
const deleteTask = async (req, res) => {
  try {
    const deletedTask = await Task.findByIdAndDelete(req.params.id);
    if (!deletedTask)
      return res
        .status(404)
        .json({ success: false, message: "Task not found" });

    res.status(200).json({ success: true, message: "Task deleted" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = {
  createTask,
  getTasks,
  updateTask,
  deleteTask,
};
