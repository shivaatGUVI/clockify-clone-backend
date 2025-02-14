const express = require("express");
const {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
} = require("../controllers/category");
const router = express.Router();

// Route to create a new category
router.post("/", createCategory);

// Route to get all categories
router.get("/", getCategories);

// Route to get category by ID
router.get("/:id", getCategoryById);

// Route to update category by ID
router.put("/:id", updateCategory);

// Route to delete category by ID
router.delete("/:id", deleteCategory);

module.exports = router;
