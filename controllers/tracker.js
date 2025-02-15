const Task = require("../models/Task");

// Start tracking task time
const startTask = async (req, res) => {
  try {
    const { category, title } = req.body;
    const now = new Date();

    const newTask = new Task({
      user: req.user.id,
      category,
      title,
      date: now.toISOString().split("T")[0],
      startTime: now,
    });

    await newTask.save();
    res.status(201).json(newTask);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error starting task" });
  }
};

// Stop tracking task time
const stopTask = async (req, res) => {
  try {
    const { id } = req.params;
    const endTime = new Date();

    const task = await Task.findById(id);
    if (!task) return res.status(404).json({ message: "Task not found" });

    if (task.endTime) {
      return res.status(400).json({ message: "Task is already stopped" });
    }

    task.endTime = endTime;
    task.duration = (endTime.getTime() - task.startTime.getTime()) / 1000;

    await task.save();
    res.json(task);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error stopping task" });
  }
};

// Resume task (creates a new entry for a new session)
const resumeTask = async (req, res) => {
  try {
    const { id } = req.params;
    const now = new Date();
    const task = await Task.findById(id);

    if (!task) return res.status(404).json({ message: "Task not found" });

    const newTask = new Task({
      user: req.user.id,
      category: task.category,
      title: task.title,
      date: now.toISOString().split("T")[0],
      startTime: now,
    });

    await newTask.save();
    res.status(201).json(newTask);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error resuming task" });
  }
};

module.exports = {
  startTask,
  stopTask,
  resumeTask,
};
