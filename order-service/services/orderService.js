const pool = require("../db/db");

exports.getOrders = async () => {
  const result = await pool.query("SELECT * FROM orders ORDER BY id DESC");

  return result.rows;
};

exports.getOrderById = async (id) => {
  const result = await pool.query("SELECT * FROM orders WHERE id = $1", [id]);

  return result.rows[0];
};

exports.getUserHistory = async (userId) => {
  const result = await pool.query(
    "SELECT * FROM orders WHERE user_id = $1 ORDER BY created_at DESC",
    [userId],
  );

  return result.rows;
};
