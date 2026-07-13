const db = require("../db/db");

// GET /products
async function getAllProducts() {
  const result = await db.query(
    "SELECT * FROM products ORDER BY id ASC"
  );

  return result.rows;
}

// GET /products/:id
async function getProductById(id) {
  const result = await db.query(
    "SELECT * FROM products WHERE id = $1",
    [id]
  );

  return result.rows[0];
}

// POST /products
async function createProduct(product) {
  const { name, description, price, category_id } = product;

  const result = await db.query(
    `INSERT INTO products (name, description, price, category_id)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
    [name, description, price, category_id]
  );

  return result.rows[0];
}

// PUT /products/:id
async function updateProduct(id, product) {
  const { name, description, price, category_id } = product;

  const result = await db.query(
    `UPDATE products
     SET name = $1,
         description = $2,
         price = $3,
         category_id = $4
     WHERE id = $5
     RETURNING *`,
    [name, description, price, category_id, id]
  );

  return result.rows[0];
}

// DELETE /products/:id
async function deleteProduct(id) {
  await db.query(
    "DELETE FROM products WHERE id = $1",
    [id]
  );

  return { message: "Product deleted successfully" };
}

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
};