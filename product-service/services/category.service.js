const db = require("../db/db");

// GET /categories
async function getCategories() {
  const result = await db.query(
    "SELECT * FROM categories ORDER BY id ASC"
  );

  return result.rows;
}

// GET /categories/:id
async function getCategoryById(id) {
  const result = await db.query(
    "SELECT * FROM categories WHERE id = $1",
    [id]
  );

  return result.rows[0];
}

// POST /categories
async function createCategory(category) {
  const { name } = category;

  const result = await db.query(
    `INSERT INTO categories (name)
     VALUES ($1)
     RETURNING *`,
    [name]
  );

  return result.rows[0];
}

// PUT /categories/:id
async function updateCategory(id, category) {
  const { name } = category;

  const result = await db.query(
    `UPDATE categories
     SET name = $1
     WHERE id = $2
     RETURNING *`,
    [name, id]
  );

  return result.rows[0];
}

// DELETE /categories/:id
async function deleteCategory(id) {
  await db.query(
    "DELETE FROM categories WHERE id = $1",
    [id]
  );

  return { message: "Category deleted successfully" };
}

module.exports = {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory
};