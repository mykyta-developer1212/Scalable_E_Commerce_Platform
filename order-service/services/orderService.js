const pool = require("../db/db");

exports.createOrder = async (user_id, total) => {
    const result = await pool.query(
        "INSERT INTO orders(user_id,total) VALUES($1,$2) RETURNING *",
        [user_id, total]
    );

    return result.rows[0];
};

exports.getOrders = async () => {
    const result = await pool.query(
        "SELECT * FROM orders ORDER BY id DESC"
    );

    return result.rows;
};

exports.getOrderById = async (id) => {
    const result = await pool.query(
        "SELECT * FROM orders WHERE id=$1",
        [id]
    );

    return result.rows[0];
};

exports.updateStatus = async (id, status) => {
    const result = await pool.query(
        "UPDATE orders SET status=$1 WHERE id=$2 RETURNING *",
        [status, id]
    );

    return result.rows[0];
};

exports.getUserHistory = async (userId) => {
    const result = await pool.query(
        "SELECT * FROM orders WHERE user_id=$1 ORDER BY created_at DESC",
        [userId]
    );

    return result.rows;
};