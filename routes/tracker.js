const express = require("express");
const { startTask, stopTask, resumeTask } = require("../controllers/tracker");
const router = express.Router();

// Route to start a task
router.post("/start", startTask);

// Route to stop a task by its ID
router.put("/stop/:id", stopTask);

// Route to resume a task by its ID (creates a new entry)
router.post("/resume/:id", resumeTask);

module.exports = router;
