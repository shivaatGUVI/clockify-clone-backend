const Category = require("../models/Category");

// Create a new category
const createCategory = async (req, res) => {
  try {
    const { name } = req.body;
    const newCategory = new Category(name);
    await newCategory.save();
    res.status(201).json(newCategory);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error creating category" });
  }
};

// Get all categories
const getCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (err) {
    res.status(500).json({ message: "Error fetching categories" });
  }
};

// Get category by ID
const getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await Category.findById(id);
    if (!category)
      return res.status(404).json({ message: "Category not found" });
    res.json(category);
  } catch (err) {
    res.status(500).json({ message: "Error fetching category" });
  }
};

// Update category by ID
const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    const category = await Category.findById(id);
    if (!category)
      return res.status(404).json({ message: "Category not found" });

    category.name = name || category.name;
    await category.save();
    res.json(category);
  } catch (err) {
    res.status(500).json({ message: "Error updating category" });
  }
};

// Delete category by ID
const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await Category.findByIdAndDelete(id);

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.json({ message: "Category deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting category" });
  }
};

module.exports = {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
};
