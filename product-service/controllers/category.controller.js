const service = require("../services/category.service");

async function getCategories(req, res) {
  try {
    const data = await service.getCategories();
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "DB error" });
  }
}

async function getCategory(req, res) {
  try {
    const data = await service.getCategoryById(req.params.id);

    if (!data) {
      return res.status(404).json({ error: "Category not found" });
    }

    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "DB error" });
  }
}

async function createCategory(req, res) {
  try {
    const data = await service.createCategory(req.body);
    res.status(201).json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "DB error" });
  }
}

async function updateCategory(req, res) {
  try {
    const data = await service.updateCategory(req.params.id, req.body);

    if (!data) {
      return res.status(404).json({ error: "Category not found" });
    }

    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "DB error" });
  }
}

async function deleteCategory(req, res) {
  try {
    await service.deleteCategory(req.params.id);
    res.json({ message: "Category deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "DB error" });
  }
}

module.exports = {
  getCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory
};