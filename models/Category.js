const mongoose = require("mongoose");

// Category Schema
const CategorySchema = new mongoose.Schema({
  name: { type: String, required: true },
});

module.exports = mongoose.model("Category", CategorySchema);
