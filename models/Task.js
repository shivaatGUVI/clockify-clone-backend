const mongoose = require("mongoose");

// Task Schema
const TaskSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  },
  startTime: { type: Date, required: true },
  endTime: { type: Date },
  duration: { type: Number },
  title: { type: String },
});

module.exports = mongoose.model("Task", TaskSchema);
