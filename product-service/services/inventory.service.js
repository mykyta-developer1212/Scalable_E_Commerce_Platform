const db = require("../db/db");

// GET /inventory
async function getInventory() {
  const result = await db.query(
    "SELECT * FROM inventory ORDER BY product_id ASC"
  );

  return result.rows;
}

// GET /inventory/:productId
async function getInventoryItem(productId) {
  const result = await db.query(
    "SELECT * FROM inventory WHERE product_id = $1",
    [productId]
  );

  return result.rows[0];
}

// PATCH /inventory/:productId
async function updateQuantity(productId, quantity) {
  const result = await db.query(
    `UPDATE inventory
     SET quantity = $1
     WHERE product_id = $2
     RETURNING *`,
    [quantity, productId]
  );

  return result.rows[0];
}

// (optional) create inventory record
async function createInventoryItem(productId, quantity = 0) {
  const result = await db.query(
    `INSERT INTO inventory (product_id, quantity)
     VALUES ($1, $2)
     RETURNING *`,
    [productId, quantity]
  );

  return result.rows[0];
}

// (optional) delete inventory record
async function deleteInventoryItem(productId) {
  await db.query(
    "DELETE FROM inventory WHERE product_id = $1",
    [productId]
  );

  return { message: "Inventory item deleted" };
}

module.exports = {
  getInventory,
  getInventoryItem,
  updateQuantity,
  createInventoryItem,
  deleteInventoryItem
};